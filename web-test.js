'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8'),css=fs.readFileSync('lesson.css','utf8'),js=fs.readFileSync('lesson.js','utf8');
for(const id of ['warmup','toolkit','mission','roleplay','extra-practice','check','situation-check','submit-assessment'])assert(html.includes(`id="${id}"`),`Missing #${id}`);
assert.match(html,/href="#mission"/);assert.match(html,/lesson\.css/);assert.match(html,/lesson\.js/);assert.match(html,/FluentSpring/);
assert.match(js,/function checkSituation/);assert.match(js,/function submitAssessment/);assert.match(js,/function renderSituation/);assert.match(css,/font-size:16px/);
console.log('PASS: published root page, assets, lesson stages and primary activities');
