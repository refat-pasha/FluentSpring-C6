type GenderVoice = 'female' | 'male';
interface AssessmentResult { score: number; feedback: string[]; strengths: string[]; }
interface Criterion { label: string; test: (text: string) => boolean; fix: string; }
interface RoleRound {
  label: string; phase: 'Guided practice' | 'Main task'; window: string; scene: string; task: string;
  who: string; line: string; starters: string[]; placeholder: string; model: string;
  criteria: Criterion[]; reply: (text: string, name: string) => string;
}
interface RoundResult { round: string; earned: number; total: number; missed: string[]; text: string; }

const $ = <T extends HTMLElement>(selector: string): T => document.querySelector(selector) as T;
const $$ = <T extends HTMLElement>(selector: string): T[] => Array.from(document.querySelectorAll(selector)) as T[];
const NAME_STOP = '(?!a\\b|an\\b|the\\b|not\\b|from\\b|here\\b|new\\b|student\\b|fine\\b|good\\b|in\\b|so\\b|here\\b)';
const nameTest = (text: string): boolean => new RegExp(`(?:i am|i['’]?m|my name is)\\s+${NAME_STOP}[\\p{L}]+`, 'iu').test(text);
const hasQuestion = (text: string): boolean => /\?/.test(text) || /\b(what|how|why|where|do you|are you|have you|would you)\b/i.test(text);

const rounds: RoleRound[] = [
  {
    label: 'First contact', phase: 'Guided practice', window: '0:00–3:00',
    scene: 'The fair is loud. Nila is standing near the debate society table, holding a campus map.',
    task: 'Greet Nila, say your name, and answer her question.',
    who: 'Nila',
    line: 'Hi! I’m Nila. This is my first club fair — are you a student here too?',
    starters: ['Hi, I’m …', 'Hello, Nila. I’m …', 'Yes, I’m a student here.'],
    placeholder: 'Hi, I’m Tania. Yes, I’m a student here too.',
    model: 'Hi, Nila! I’m Tania. Yes, I’m a student here too — this is my first fair as well.',
    criteria: [
      { label: 'Opens with a greeting', test: t => /\b(hi|hello|hey|good (morning|afternoon|evening))\b/i.test(t), fix: 'Open with “Hi” or “Hello” before anything else.' },
      { label: 'Says your name', test: nameTest, fix: 'Give your name: “I’m …” or “My name is …”.' },
      { label: 'Answers her question', test: t => /\b(yes|no|yeah|student|first year|new here|same|too|not yet)\b/i.test(t), fix: 'Answer her question directly: “Yes, I’m a student here.”' }
    ],
    reply: (text, name) => `Lovely to meet you${name ? `, ${name}` : ''}! I’m in my first year. Which club looks interesting to you?`
  },
  {
    label: 'Find common ground', phase: 'Guided practice', window: '3:00–6:00',
    scene: 'Nila points at the debate society poster. The queue behind you is moving slowly.',
    task: 'Share one real detail about yourself, then ask Nila a question.',
    who: 'Nila',
    line: 'I’m thinking of joining debate. What about you — what do you enjoy?',
    starters: ['I’m studying …', 'I’m interested in …', 'What made you choose …?'],
    placeholder: 'I’m studying business, and I enjoy public speaking. What made you choose debate?',
    model: 'I’m studying business, and I enjoy public speaking. What made you choose debate?',
    criteria: [
      { label: 'Shares a personal detail', test: t => /\b(i'?m studying|i study|i'?m interested in|i enjoy|i like|i love|i'?m from|my major is)\b/i.test(t), fix: 'Add one detail: “I’m studying…”, “I’m interested in…”.' },
      { label: 'Asks a question back', test: hasQuestion, fix: 'Ask something back so she keeps talking: “What made you choose debate?”' },
      { label: 'Connects to her topic', test: t => /\b(debate|club|society|poster|join|sign up|fair)\b/i.test(t), fix: 'Pick up her topic — mention debate or the club fair.' }
    ],
    reply: () => 'That sounds interesting — I like how debate makes you think on your feet. I’m a little nervous about speaking in front of people.'
  },
  {
    label: 'Bring a friend in', phase: 'Main task', window: '6:00–10:30',
    scene: 'Your classmate Rafi walks up holding two cups of tea.',
    task: 'Introduce Rafi to Nila and Nila to Rafi. Add one detail that helps them start talking.',
    who: 'Rafi',
    line: 'Hey! Am I interrupting? I brought tea for both of you.',
    starters: ['Nila, this is …', 'Rafi, meet …', 'He’s in my … class.'],
    placeholder: 'Nila, this is my friend Rafi. Rafi, this is Nila — she’s interested in debate.',
    model: 'Nila, this is my friend Rafi. Rafi, this is Nila — she’s thinking of joining debate. Rafi has been a member since last year.',
    criteria: [
      { label: 'Introduces Rafi by name', test: t => /\brafi\b/i.test(t) && /(this is|meet)\b/i.test(t), fix: 'Name him clearly: “Nila, this is my friend Rafi.”' },
      { label: 'Introduces Nila too', test: t => /\bnila\b/i.test(t) && /(this is|meet)\b/i.test(t), fix: 'Introduce both ways: “Rafi, this is Nila.”' },
      { label: 'Gives them something to say', test: t => /\b(he'?s|she'?s|he|she|joined|studies|study|class|friend|interested|member|year)\b/i.test(t), fix: 'Add a detail about one of them: “She’s interested in debate.”' }
    ],
    reply: () => 'Nice to meet you, Nila! Debate is a good choice — the first meeting is friendly. I joined last year and I still go.'
  },
  {
    label: 'Invite and close', phase: 'Main task', window: '10:30–15:00',
    scene: 'Nila looks at the sign-up sheet, then back at you. The fair is starting to empty.',
    task: 'Invite Nila to do something with you, then close the conversation warmly.',
    who: 'Nila',
    line: 'I think I’ll sign up. But honestly, I don’t know anyone here yet…',
    starters: ['Would you like to …', 'We’re going to …', 'It was lovely to meet you.'],
    placeholder: 'Would you like to come to the first meeting with us on Saturday? It was lovely to meet you, Nila.',
    model: 'Would you like to come to the first meeting with us on Saturday? Rafi and I will be there too. It was lovely to meet you, Nila.',
    criteria: [
      { label: 'Invites her with a choice', test: t => /\b(would you like|do you want|shall we|let'?s|why don'?t we|come with|join us|join me|together)\b/i.test(t), fix: 'Invite her kindly: “Would you like to come with us?”' },
      { label: 'Closes warmly', test: t => /\b(nice to meet you|lovely to meet you|good to meet you|see you|take care|bye|welcome|glad)\b/i.test(t), fix: 'Close with warmth: “It was lovely to meet you.”' },
      { label: 'Suggests a next step', test: t => /\b(saturday|sunday|tomorrow|next week|first meeting|monday|friday|at \d)\b/i.test(t) || hasQuestion(t), fix: 'Suggest when to meet again, or ask a follow-up question.' }
    ],
    reply: () => 'That would make it much easier. Thank you — see you on Saturday!'
  }
];

let stage = 0;
let lastPartnerLine = '';
const rp = { active: false, round: 0, awaiting: false, remaining: 900, timer: undefined as number | undefined, running: false, timedOut: false, name: 'Tania', lines: [] as { who: string; text: string }[], results: [] as RoundResult[] };

function setNotice(selector: string, message: string): void { const node = $(selector); if (node) node.textContent = message; }
function extractName(text: string): string {
  const match = text.match(new RegExp(`(?:i am|i['’]?m|my name is)\\s+${NAME_STOP}([\\p{L}]+)`, 'iu'));
  return match ? match[1] : '';
}
function speak(text: string, gender: GenderVoice, statusSelector: string): void {
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') { setNotice(statusSelector, 'Text works. Speech is not available in this browser.'); return; }
  const synth = window.speechSynthesis;
  const voices = synth.getVoices().filter(v => /^en(-|_)/i.test(v.lang));
  const pattern = gender === 'female' ? /female|woman|samantha|ava|jenny|aria|zira|susan|karen|moira|serena|victoria/i : /male|man|daniel|david|mark|guy|james|oliver|ryan|alex|george|fred/i;
  const voice = voices.find(v => pattern.test(v.name));
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice ? voice.lang : 'en-US';
  if (voice) utterance.voice = voice;
  utterance.rate = .93;
  utterance.pitch = gender === 'female' ? 1.1 : .91;
  utterance.onstart = () => setNotice(statusSelector, `Speaking${voice ? ` with ${voice.name}` : ' with the browser voice'}.`);
  utterance.onend = () => setNotice(statusSelector, '');
  utterance.onerror = event => setNotice(statusSelector, `Text works; speech could not play (${event.error}).`);
  synth.speak(utterance);
}
function formatClock(seconds: number): string { return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`; }

/* ---------- Role-play engine ---------- */
function rpVoice(): GenderVoice { return (($('#rp-voice') as HTMLSelectElement).value === 'male' ? 'male' : 'female'); }
function rpAddBubble(who: string, text: string): void {
  const feed = $('#rp-dialogue');
  feed.querySelector('.rp-empty')?.remove();
  const bubble = document.createElement('div');
  bubble.className = `rp-bubble ${who === 'You' ? 'rp-you' : 'rp-partner'}`;
  const name = document.createElement('b');
  name.textContent = who;
  const words = document.createElement('p');
  words.textContent = text;
  bubble.append(name, words);
  feed.append(bubble);
  feed.scrollTop = feed.scrollHeight;
}
function rpCurrent(): RoleRound { return rounds[rp.round]; }
function rpStart(): void {
  const typed = ($('#rp-name') as HTMLInputElement).value.trim();
  rp.name = typed || 'Tania';
  rp.active = true; rp.round = 0; rp.awaiting = false; rp.remaining = 900; rp.timedOut = false; rp.lines = []; rp.results = [];
  ($('#rp-setup') as HTMLElement).hidden = true;
  ($('#rp-player') as HTMLElement).hidden = false;
  ($('#rp-report') as HTMLElement).hidden = true;
  $('#rp-dialogue').replaceChildren();
  rpRender();
  rpStartTimer();
  $('#roleplay').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function rpRender(): void {
  const round = rpCurrent();
  $('#rp-phase').textContent = round.phase;
  $('#rp-round-label').textContent = `Round ${rp.round + 1} of 4`;
  $('#rp-window').textContent = round.window;
  $('#rp-scene').textContent = round.scene;
  $('#rp-task').textContent = round.task;
  $('#rp-label').textContent = round.task;
  const list = $('#rp-criteria');
  list.replaceChildren();
  round.criteria.forEach(criterion => {
    const item = document.createElement('li');
    item.textContent = criterion.label;
    list.append(item);
  });
  const answer = $('#rp-answer') as HTMLTextAreaElement;
  answer.value = '';
  answer.placeholder = round.placeholder;
  const starters = $('#rp-starters');
  starters.replaceChildren();
  round.starters.forEach(text => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'starter-chip';
    button.textContent = text;
    button.addEventListener('click', () => { answer.value = text; answer.focus(); });
    starters.append(button);
  });
  const submit = $('#rp-submit') as HTMLButtonElement;
  submit.textContent = rp.round === 3 ? 'Close the conversation ↗' : 'Say your line ↗';
  submit.disabled = false;
  setNotice('#rp-feedback', '');
  rpAddBubble(round.who, round.line);
  lastPartnerLine = round.line;
  speak(round.line, rpVoice(), '#rp-voice-status');
  ($('#rp-say') as HTMLElement).hidden = false;
  answer.focus();
}
function rpStartTimer(): void {
  if (rp.timedOut) return;
  rp.running = true;
  rp.timer = window.setInterval(rpTick, 1000);
  ($('#rp-pause') as HTMLButtonElement).textContent = 'Pause';
  rpPaintClock();
}
function rpStopTimer(): void { if (rp.timer) window.clearInterval(rp.timer); rp.timer = undefined; rp.running = false; }
function rpPaintClock(): void {
  $('#rp-clock').textContent = formatClock(rp.remaining);
  const used = ((900 - rp.remaining) / 900) * 100;
  ($('#rp-bar') as HTMLElement).style.width = `${Math.min(100, Math.max(0, used))}%`;
}
function rpTick(): void {
  if (!rp.running) return;
  rp.remaining -= 1;
  if (rp.remaining < 0) rp.remaining = 0;
  rpPaintClock();
  if (rp.remaining === 0) {
    rpStopTimer();
    rp.timedOut = true;
    setNotice('#rp-feedback', 'Time is up. Your lines still count — finish this round, then read your role-play report.');
    ($('#rp-pause') as HTMLButtonElement).textContent = 'Paused';
  }
}
function rpScore(text: string): { earned: number; missed: string[] } {
  const round = rpCurrent();
  let earned = 0;
  const missed: string[] = [];
  round.criteria.forEach(criterion => { if (criterion.test(text)) earned += 1; else missed.push(criterion.fix); });
  return { earned, missed };
}
function rpSubmit(): void {
  if (!rp.active) return;
  if (rp.awaiting) { rpAdvance(); return; }
  const answer = ($('#rp-answer') as HTMLTextAreaElement).value.trim();
  if (answer.length < 3) { setNotice('#rp-feedback', 'Write a short line first — even “Hi, I’m …” is a start.'); return; }
  const round = rpCurrent();
  rpAddBubble('You', answer);
  rp.lines.push({ who: 'You', text: answer });
  const partnerLine = round.reply(answer, extractName(answer) || rp.name);
  rpAddBubble(round.who, partnerLine);
  rp.lines.push({ who: round.who, text: partnerLine });
  lastPartnerLine = partnerLine;
  speak(partnerLine, rpVoice(), '#rp-voice-status');
  const { earned, missed } = rpScore(answer);
  rp.results[rp.round] = { round: round.label, earned, total: 3, missed, text: answer };
  if (rp.round === 1) markStage(2);
  setNotice('#rp-feedback', `${round.label}: ${earned}/3. ${missed.length ? missed[0] : 'Everything this round needed is there.'}`);
  const submit = $('#rp-submit') as HTMLButtonElement;
  submit.textContent = rp.round === 3 ? 'See my role-play report ↗' : `Continue to round ${rp.round + 2} →`;
  rp.awaiting = true;
}
function rpAdvance(): void {
  rp.awaiting = false;
  if (rp.round < rounds.length - 1) { rp.round += 1; rpRender(); ($('#rp-answer') as HTMLTextAreaElement).focus(); return; }
  rpFinish();
}
function rpFinish(): void {
  rpStopTimer();
  markStage(3);
  ($('#rp-player') as HTMLElement).hidden = true;
  const report = $('#rp-report') as HTMLElement;
  report.hidden = false;
  const total = rp.results.reduce((sum, item) => sum + (item ? item.earned : 0), 0);
  const band = total >= 10 ? 'Strong role-play: warm, clear and inclusive.' : total >= 7 ? 'Good role-play with a few gaps to close.' : 'A brave start — rebuild the lines with the toolkit phrases.';
  $('#rp-report-summary').textContent = `${rp.name}, you scored ${total}/12 across four rounds in ${formatClock(900 - rp.remaining)}. ${band}`;
  const body = $('#rp-report-body');
  body.replaceChildren();
  if (!rp.results.length) {
    const empty = document.createElement('p');
    empty.className = 'rp-next';
    empty.textContent = 'No lines were written this run. Press “Run it again” and write at least one line in round 1.';
    body.append(empty);
  }
  rounds.forEach((round, index) => {
    const item = rp.results[index];
    if (!item) {
      const skipped = document.createElement('article');
      skipped.className = 'rp-score-card';
      skipped.textContent = `${round.label}: no line written.`;
      body.append(skipped);
      return;
    }
    const card = document.createElement('article');
    card.className = 'rp-score-card';
    const head = document.createElement('div');
    head.className = 'rp-score-head';
    const title = document.createElement('strong');
    title.textContent = item.round;
    const score = document.createElement('span');
    score.textContent = `${item.earned}/${item.total}`;
    head.append(title, score);
    const quote = document.createElement('p');
    quote.className = 'rp-quote';
    quote.textContent = `“${item.text}”`;
    card.append(head, quote);
    if (item.missed.length) {
      const fix = document.createElement('ul');
      fix.className = 'rp-fix';
      item.missed.forEach(line => { const li = document.createElement('li'); li.textContent = line; fix.append(li); });
      card.append(fix);
    }
    body.append(card);
  });
  const missedAll = rp.results.flatMap(item => (item ? item.missed : []));
  const next = document.createElement('p');
  next.className = 'rp-next';
  next.textContent = missedAll.length ? `Next time: ${missedAll.slice(0, 2).join(' ')}` : 'Next time: keep the same warmth and try it with a real classmate.';
  body.append(next);
  report.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function rpReset(): void {
  rpStopTimer();
  rp.active = false; rp.round = 0; rp.awaiting = false; rp.remaining = 900; rp.timedOut = false; rp.lines = []; rp.results = [];
  rpPaintClock();
  ($('#rp-report') as HTMLElement).hidden = true;
  ($('#rp-player') as HTMLElement).hidden = true;
  ($('#rp-setup') as HTMLElement).hidden = false;
  $('#rp-dialogue').replaceChildren();
  $('#roleplay').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function rpCopyTranscript(): void {
  const text = rp.lines.map(line => `${line.who}: ${line.text}`).join('\n');
  const done = (): void => setNotice('#rp-copy-note', 'Transcript copied. Paste it into your lesson notes.');
  const fail = (): void => setNotice('#rp-copy-note', 'Copy is blocked here. Select the lines in the role-play and copy them manually.');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(fail);
    return;
  }
  fail();
}

/* ---------- Exit ticket ---------- */
function evaluateWriting(text: string, needName: boolean): AssessmentResult {
  const clean = text.trim();
  const strengths: string[] = [];
  const feedback: string[] = [];
  if (/\b(hi|hello|hey|good (morning|afternoon))\b/i.test(clean)) strengths.push('You opened with a greeting.');
  else feedback.push('Add a friendly greeting such as “Hi” or “Hello”.');
  if (nameTest(clean)) strengths.push('You used a clear self-introduction phrase.');
  else if (needName) feedback.push('Say who you are: “I’m …” or “My name is …”.');
  if (hasQuestion(clean)) strengths.push('You invited the other person to join in.');
  else if (needName) feedback.push('Add a kind follow-up question to keep the conversation going.');
  if (/\b(this is|meet my|my friend|classmate)\b/i.test(clean.toLowerCase())) strengths.push('You included another person.');
  if (clean.length < 12) feedback.push('Try adding a little more so the other person has something to respond to.');
  if (!feedback.length) feedback.push('Your introduction is clear and welcoming. Try saying it to a classmate.');
  return { score: Math.min(3, strengths.length), feedback, strengths };
}
function showAssessment(container: HTMLElement, result: AssessmentResult, title: string): void {
  container.replaceChildren();
  const summary = document.createElement('div');
  summary.className = 'feedback-score';
  const score = document.createElement('strong');
  score.textContent = `${result.score}/3`;
  const text = document.createElement('p');
  text.textContent = title;
  summary.append(score, text);
  container.append(summary);
  const list = document.createElement('ul');
  list.className = 'feedback-list';
  [...result.strengths, ...result.feedback].forEach(line => { const li = document.createElement('li'); li.textContent = line; list.append(li); });
  container.append(list);
}
function submitAssessment(): void {
  const one = (document.querySelector('input[name="quiz1"]:checked') as HTMLInputElement | null)?.value;
  const two = (document.querySelector('input[name="quiz2"]:checked') as HTMLInputElement | null)?.value;
  const writing = ($('#exit-answer') as HTMLTextAreaElement).value.trim();
  if (!one || !two || !writing) { setNotice('#assessment-result', 'Complete both choices and write your two-line introduction before checking your learning.'); return; }
  const result = evaluateWriting(writing, true);
  const quiz = Number(one === 'b') + Number(two === 'a');
  result.score = Math.min(3, quiz + Number(result.score > 0));
  showAssessment($('#assessment-result'), result, result.score === 3 ? 'Strong evidence: welcoming language and an effective introduction.' : result.score === 2 ? 'You’re getting there. Review the notes, then improve one line.' : 'Keep practising. The toolkit phrases are your base.');
  $('#completion-stamp').removeAttribute('hidden');
  markStage(5);
}
const reviewItems = [
  { key: 'r1', correct: 'b', why: 'Inviting her gives her a choice and an easy way into the group.' },
  { key: 'r2', correct: 'a', why: 'Both names plus the relationship make the introduction clear to everyone.' },
  { key: 'r3', correct: 'c', why: 'A warm close plus a concrete next meeting keeps the connection alive.' }
];
function checkReview(): void {
  const strengths: string[] = [];
  const feedback: string[] = [];
  let score = 0;
  reviewItems.forEach((item, index) => {
    const picked = (document.querySelector(`input[name="${item.key}"]:checked`) as HTMLInputElement | null)?.value;
    if (picked === item.correct) { score += 1; strengths.push(`Question ${index + 1}: correct. ${item.why}`); }
    else feedback.push(picked ? `Question ${index + 1}: ${item.why}` : `Question ${index + 1}: choose an answer first.`);
  });
  showAssessment($('#review-feedback'), { score, feedback, strengths }, score === 3 ? 'All three correct — you noticed the inclusive moves in the conversation.' : score === 2 ? 'Two out of three. Read the note for the one to revisit.' : 'Review the toolkit lines, then try the three questions again.');
  if (score >= 2) markStage(4);
}
function markStage(index: number): void {
  const items = $$('#lesson-route li');
  if (items[index]) items[index].classList.add('route-done');
  $$('#framework-list li').forEach((item, position) => item.classList.toggle('is-done', position <= index));
  if (items[index + 1]) { items.forEach(item => item.classList.remove('route-active')); items[index + 1].classList.add('route-active'); }
}

/* ---------- Boot ---------- */
function initLesson(): void {
  $('#start-lesson').addEventListener('click', () => $('#warmup').scrollIntoView({ behavior: 'smooth', block: 'start' }));
  $$('.warmup-option').forEach(button => button.addEventListener('click', () => {
    $$('.warmup-option').forEach(option => option.classList.remove('chosen', 'correct', 'incorrect'));
    button.classList.add('chosen');
    const ok = button.getAttribute('data-correct') === 'true';
    button.classList.add(ok ? 'correct' : 'incorrect');
    setNotice('#warmup-feedback', ok ? 'Good choice. It is friendly, gives a shared context, and invites a reply.' : 'That could feel abrupt or excluding. Try a gentle question connected to the event.');
    if (ok) markStage(0);
  }));
  $$('.text-advance').forEach(button => button.addEventListener('click', () => {
    const target = document.getElementById(button.getAttribute('data-next') || '');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target?.classList.add('is-highlighted');
    setTimeout(() => target?.classList.remove('is-highlighted'), 1300);
  }));
  $('#notice-answer').addEventListener('change', event => {
    const value = (event.target as HTMLSelectElement).value;
    setNotice('#notice-feedback', value === 'introduce' ? 'Correct. “This is my friend Rafi” names the person and the relationship.' : value ? 'Not quite. Look for the phrase that names another person and your relationship.' : '');
    if (value === 'introduce') markStage(1);
  });
  $$('.hear-phrase').forEach((button, index) => button.addEventListener('click', () => speak(button.getAttribute('data-say') || '', index === 3 ? 'male' : 'female', '#rp-voice-status')));
  $('#rp-begin').addEventListener('click', rpStart);
  $('#rp-submit').addEventListener('click', rpSubmit);
  $('#rp-answer').addEventListener('keydown', event => {
    if ((event as KeyboardEvent).key === 'Enter' && !(event as KeyboardEvent).shiftKey) { event.preventDefault(); rpSubmit(); }
  });
  $('#rp-model').addEventListener('click', () => { ($('#rp-answer') as HTMLTextAreaElement).value = rpCurrent().model; setNotice('#rp-feedback', 'Model line added. Change the names and details so it sounds like you.'); ($('#rp-answer') as HTMLTextAreaElement).focus(); });
  $('#rp-say').addEventListener('click', () => lastPartnerLine ? speak(lastPartnerLine, rpVoice(), '#rp-voice-status') : setNotice('#rp-voice-status', 'Start the role-play to hear a line.'));
  $('#rp-pause').addEventListener('click', () => {
    const button = $('#rp-pause') as HTMLButtonElement;
    if (rp.timedOut) return;
    if (rp.running) { rpStopTimer(); button.textContent = 'Resume'; }
    else { rpStartTimer(); button.textContent = 'Pause'; }
  });
  $('#rp-again').addEventListener('click', rpReset);
  $('#rp-copy').addEventListener('click', rpCopyTranscript);
  $('#review-check').addEventListener('click', checkReview);
  $('#submit-assessment').addEventListener('click', submitAssessment);
  $('#reset-lesson').addEventListener('click', () => { if (confirm('Reset the whole lesson, including the role-play?')) window.location.reload(); });
  $('#rp-voice').addEventListener('change', () => { if (lastPartnerLine) speak(lastPartnerLine, rpVoice(), '#rp-voice-status'); });
  rpPaintClock();
}
window.addEventListener('DOMContentLoaded', initLesson);
