'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('lesson.css', 'utf8');
const js = fs.readFileSync('lesson.js', 'utf8');

for (const id of ['warmup', 'toolkit', 'roleplay', 'review', 'check', 'rp-begin', 'rp-submit', 'rp-report', 'review-check', 'submit-assessment']) {
  assert.ok(html.includes(`id="${id}"`), `Missing #${id}`);
}

// The six-stage lesson design must be visible, not implied.
const stages = ['Warm-up', 'Delivery', 'Guided practice', 'Main task', 'Review', 'Feedback'];
const framework = html.slice(html.indexOf('framework-strip'), html.indexOf('lesson-layout'));
stages.forEach(stage => assert.ok(framework.includes(stage), `Framework strip is missing ${stage}`));
stages.forEach((stage, index) => assert.ok(html.includes(`Stage ${index + 1} · `) || html.includes(`Stages 3–4`), `Panel label missing for ${stage}`));

assert.ok(html.includes('Stages 3–4 · Guided practice + main task · 15 minutes'), 'Practice labelled as 15 minutes');
assert.ok(html.includes('Round 1 of 4'), 'Four role-play rounds present');
assert.ok(/function rpStart/.test(js) && /function rpSubmit/.test(js) && /function rpFinish/.test(js), 'Role-play engine compiled');
assert.ok(/function checkReview/.test(js), 'Review stage compiled');
assert.ok(/phase: 'Guided practice'/.test(js) && /phase: 'Main task'/.test(js), 'Rounds mapped to stages 3 and 4');
assert.ok(css.includes('.framework-strip') && css.includes('.rp-timer'), 'Framework and role-play styles present');
assert.ok(html.includes('lesson.css') && html.includes('lesson.js'), 'Assets linked');

console.log('PASS: six-stage design visible (warm-up → feedback)');
console.log('PASS: stages mapped to the 15-minute role-play and review');
console.log('PASS: page, assets and styles complete');
