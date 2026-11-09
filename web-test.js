'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('lesson.css', 'utf8');
const js = fs.readFileSync('lesson.js', 'utf8');

for (const id of ['warmup', 'toolkit', 'roleplay', 'check', 'rp-begin', 'rp-submit', 'rp-report', 'submit-assessment']) {
  assert.ok(html.includes(`id="${id}"`), `Missing #${id}`);
}
assert.ok(html.includes('Role-play practice · 15 minutes'), 'Practice is labelled as 15 minutes');
assert.ok(html.includes('Round 1 of 4'), 'Four role-play rounds are present');
assert.ok(!html.includes('id="situations"'), 'Old transfer practice is removed');
assert.ok(html.includes('lesson.css') && html.includes('lesson.js'), 'Assets linked');
assert.ok(/function rpStart/.test(js) && /function rpSubmit/.test(js) && /function rpFinish/.test(js), 'Role-play engine compiled');
assert.ok(css.includes('.rp-timer') && css.includes('.role-card'), 'Role-play styles present');
console.log('PASS: page, assets, 15-minute role-play sections and styles');
