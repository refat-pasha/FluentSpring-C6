'use strict';
// Browser-independent tests for the 15-minute role-play lesson.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const html = fs.readFileSync('index.html', 'utf8');
const source = fs.readFileSync('lesson.js', 'utf8');

for (const id of ['warmup', 'toolkit', 'roleplay', 'check', 'rp-setup', 'rp-player', 'rp-report', 'rp-begin', 'rp-submit', 'rp-model', 'rp-pause', 'rp-copy', 'rp-again', 'submit-assessment']) {
  assert.ok(html.includes(`id="${id}"`), `Missing HTML control #${id}`);
}
assert.ok(!html.includes('id="situations"'), 'Removed practice section should be gone');
for (const phrase of ['15-minute role-play', 'Four rounds', 'Role-play report']) assert.ok(html.includes(phrase), `Missing copy: ${phrase}`);

const timers = new Map();
let timerId = 0;
const elements = new Map();
const route = [0, 1, 2, 3].map(() => ({ classList: { add() {}, remove() {} } }));

function makeElement(name) {
  return {
    name, textContent: '', value: '', hidden: false, disabled: false, placeholder: '',
    innerHTML: '', children: [], style: {}, dataset: {}, attributes: {}, handlers: {},
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener(type, fn) { this.handlers[type] = fn; },
    append(...kids) { this.children.push(...kids); },
    appendChild(kid) { this.children.push(kid); },
    replaceChildren(...kids) { this.children = kids; },
    remove() {}, removeAttribute() {}, setAttribute() {}, getAttribute() { return null; },
    focus() {}, scrollIntoView() {}, querySelector() { return null; }, querySelectorAll() { return []; },
    get scrollHeight() { return 0; },
  };
}
function el(selector) {
  if (!elements.has(selector)) elements.set(selector, makeElement(selector));
  return elements.get(selector);
}
for (const id of ['warmup', 'warmup-feedback', 'notice-answer', 'notice-feedback', 'roleplay', 'rp-setup', 'rp-player', 'rp-report', 'rp-dialogue', 'rp-name', 'rp-voice', 'rp-round-label', 'rp-window', 'rp-scene', 'rp-task', 'rp-label', 'rp-criteria', 'rp-answer', 'rp-starters', 'rp-submit', 'rp-model', 'rp-say', 'rp-pause', 'rp-clock', 'rp-bar', 'rp-report-summary', 'rp-report-body', 'rp-again', 'rp-copy', 'rp-copy-note', 'rp-voice-status', 'rp-begin', 'rp-feedback', 'exit-answer', 'assessment-result', 'completion-stamp', 'reset-lesson', 'submit-assessment', 'start-lesson', 'lesson-route']) {
  el(`#${id}`);
}
el('#rp-voice').value = 'female';

let quiz1 = { value: 'b' };
let quiz2 = { value: 'a' };
const documentMock = {
  querySelector(selector) {
    if (selector === 'input[name="quiz1"]:checked') return quiz1;
    if (selector === 'input[name="quiz2"]:checked') return quiz2;
    return el(selector);
  },
  querySelectorAll(selector) {
    if (selector === '#lesson-route li') return route;
    if (selector === '.warmup-option' || selector === '.text-advance' || selector === '.hear-phrase') return [];
    return [];
  },
  createElement() { return makeElement('created'); },
  getElementById(id) { return el(`#${id}`); },
  body: { classList: { add() {}, remove() {} } },
  addEventListener() {},
};
const windowMock = {
  ready: null,
  addEventListener(type, fn) { if (type === 'DOMContentLoaded') this.ready = fn; },
  setInterval(fn) { const id = ++timerId; timers.set(id, fn); return id; },
  clearInterval(id) { timers.delete(id); },
};
const context = { document: documentMock, window: windowMock, console, setTimeout, clearTimeout, navigator: {} };
vm.runInNewContext(source, context);
windowMock.ready();

function click(selector) {
  const node = el(selector);
  assert.ok(node.handlers.click, `${selector} should have a click handler`);
  node.handlers.click({ target: node, preventDefault() {} });
}
function type(selector, text) {
  const node = el(selector);
  node.value = text;
  if (node.handlers.input) node.handlers.input({ target: node });
}
function bubbles() { return el('#rp-dialogue').children.length; }

// 1. Start the role-play.
el('#rp-name').value = 'Tania';
click('#rp-begin');
assert.equal(el('#rp-setup').hidden, true, 'setup hides on start');
assert.equal(el('#rp-player').hidden, false, 'player shows on start');
assert.equal(el('#rp-clock').textContent, '15:00', 'clock starts at 15:00');
assert.equal(bubbles(), 1, 'partner opens round 1');
assert.equal(el('#rp-round-label').textContent, 'Round 1 of 4');
assert.ok(el('#rp-criteria').children.length === 3, 'three criteria shown per round');
assert.equal(timers.size, 1, 'timer runs');

// 2. Round 1 example.
type('#rp-answer', 'Hi, Nila! I’m Tania. Yes, I’m a student here too.');
click('#rp-submit');
assert.equal(bubbles(), 3, 'learner line and reply added');
assert.match(el('#rp-feedback').textContent, /3\/3/, 'round 1 scores full marks');
assert.match(el('#rp-submit').textContent, /Continue to round 2/);
click('#rp-submit');
assert.equal(el('#rp-round-label').textContent, 'Round 2 of 4');

// 3. Round 2.
type('#rp-answer', 'I’m studying business, and I enjoy public speaking. What made you choose debate?');
click('#rp-submit');
assert.match(el('#rp-feedback').textContent, /3\/3/, 'round 2 scores full marks');
click('#rp-submit');
assert.equal(el('#rp-round-label').textContent, 'Round 3 of 4');

// 4. Round 3 introduces both people.
type('#rp-answer', 'Nila, this is my friend Rafi. Rafi, this is Nila — she is interested in debate.');
click('#rp-submit');
assert.match(el('#rp-feedback').textContent, /3\/3/, 'round 3 scores full marks');
click('#rp-submit');
assert.equal(el('#rp-round-label').textContent, 'Round 4 of 4');

// 5. Round 4 closes the conversation and produces the report.
type('#rp-answer', 'Would you like to come to the first meeting on Saturday? It was lovely to meet you.');
click('#rp-submit');
assert.match(el('#rp-feedback').textContent, /3\/3/, 'round 4 scores full marks');
click('#rp-submit');
assert.equal(el('#rp-player').hidden, true, 'player closes');
assert.equal(el('#rp-report').hidden, false, 'report opens');
assert.match(el('#rp-report-summary').textContent, /12\/12/, 'total score reported');
assert.ok(el('#rp-report-body').children.length >= 5, 'report lists rounds and next step');
assert.equal(timers.size, 0, 'timer stops at the report');

// 6. A weak line must produce targeted feedback rather than a pass.
click('#rp-again');
assert.equal(el('#rp-setup').hidden, false, 'replay returns to setup');
click('#rp-begin');
type('#rp-answer', 'ok thanks');
click('#rp-submit');
assert.match(el('#rp-feedback').textContent, /0\/3|1\/3/, 'weak line scores low');
assert.match(el('#rp-feedback').textContent, /Hi|Hello|name|question/i, 'weak line gets a fix');

// 7. Exit ticket still scores.
click('#rp-pause');
el('#exit-answer').value = 'Hi, I’m Tania. What about you?';
click('#submit-assessment');
assert.ok(el('#assessment-result').children.length > 0, 'exit ticket renders feedback');

console.log('PASS: 15-minute role-play starts with timer and round 1 partner line');
console.log('PASS: four rounds advance only after a learner line is scored');
console.log('PASS: full role-play reaches a 12/12 report with per-round evidence');
console.log('PASS: weak answers receive targeted criteria feedback');
console.log('PASS: exit ticket assessment still works');
