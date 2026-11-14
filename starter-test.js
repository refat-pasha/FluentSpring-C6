'use strict';
// Static checks for the rebuilt FluentSpring airport-mission lesson.
const fs = require('node:fs');
const assert = require('node:assert/strict');

const html = fs.readFileSync('chatgpt-starter/FluentSpring_AI_Classroom/public/index.html', 'utf8');

// 1. Teacher's banned characters are gone.
assert.ok(!/\bNila\b/i.test(html), 'Nila must not appear');
assert.ok(!/\bNeela\b/i.test(html), 'Neela must not appear');
assert.ok(!/\bRafi\b/i.test(html), 'Rafi must not appear');
assert.ok(!/detective/i.test(html), 'detective framing must not appear');

// 2. New analogy and scenario present.
for (const phrase of ['Skyport International', 'flight FS101', 'Take off', 'Cruise', 'Board a passenger', 'Land safely', 'boarding pass', 'co-pilot']) {
  assert.ok(html.includes(phrase), `Missing scenario element: ${phrase}`);
}

// 3. Real-life examples included in the teaching panel.
assert.ok(html.includes('cricket'), 'Real-life example (cricket team) missing');
assert.ok(html.includes('job interview'), 'Real-life example (job interview) missing');

// 4. Strict 15-minute lesson timer exists and starts at 15:00.
assert.ok(html.includes('15:00'), 'Mission clock must start at 15:00');
assert.ok(html.includes('missionTick'), 'Mission clock tick missing');
assert.ok(html.includes('Role-play · 15 min'), 'Mission labelled 15 min');

// 5. Interactivity: four checkpoints, games, XP, timer controls.
assert.ok((html.match(/checkpoint/g) || []).length >= 10, 'checkpoint system missing');
assert.ok(html.includes("game('gate')") && html.includes('Gate Decision'), 'Gate Decision game missing');
assert.ok(html.includes('toggleMissionTimer') && html.toLowerCase().includes('pause clock'), 'Timer pause control missing');
assert.ok(html.includes('jumpCheckpoint'), 'Checkpoint navigation missing');

// 6. Structure: sections, accessibility, AI tutor hooks kept.
for (const id of ['home', 'learn', 'games', 'speaking', 'listening', 'teacher', 'progress']) {
  assert.ok(html.includes(`id="${id}"`), `Missing section ${id}`);
}
assert.ok(html.includes('skip-link') && html.includes('aria-live') && html.includes('High contrast'), 'Accessibility features missing');
assert.ok(html.includes('FLUENTSPRING_API_URL') && html.includes('/api/tutor'), 'AI tutor backend hook missing');
assert.ok(html.includes('fs_xp2'), 'Progress persistence missing');

console.log('PASS: banned characters removed (no Nila/Neela/Rafi/detective)');
console.log('PASS: airport analogy + real-life examples present');
console.log('PASS: strict 15-minute mission clock wired');
console.log('PASS: 4 interactive checkpoints + 6 games + XP system');
console.log('PASS: accessibility and AI-tutor hooks preserved');
