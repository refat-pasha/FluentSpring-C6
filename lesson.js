"use strict";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const stageData = [
    { tag: '01 / SAY HELLO', scene: 'Nila is at the club table.', title: 'How will you introduce yourself?', label: 'Your words', placeholder: 'Hi, I’m …', starters: ['Hi, I’m …', 'Hello, my name is …'], reply: answer => `Hi${extractName(answer) ? `, ${extractName(answer)}` : ' there'}! I’m Nila. It’s lovely to meet you. What brought you to the club fair?` },
    { tag: '02 / SHARE A DETAIL', scene: 'Nila smiles and makes room at the table.', title: 'Share one detail about yourself.', label: 'One detail', placeholder: 'I’m interested in …', starters: ['I’m studying …', 'I’m interested in …'], reply: () => 'That sounds lovely! I’m curious about the debate society. What do you like to do outside class?' },
    { tag: '03 / ASK A QUESTION', scene: 'Your classmate Rafi comes over.', title: 'Invite someone else into the conversation.', label: 'A friendly question or introduction', placeholder: 'This is my friend …', starters: ['This is my friend …', 'What are you interested in?'], reply: () => 'Thanks for introducing us! It’s nice when someone helps a new person feel included.' }
];
let stage = 0, lastReply = '', timerId, remaining = 900, timerRunning = false;
function extractName(text) { return text.match(/(?:i am|i'm|i’m|my name is)\s+([\p{L}]+)/iu)?.[1] ?? ''; }
function setNotice(selector, message) { const node = $(selector); if (node)
    node.textContent = message; }
function renderStage() { const item = stageData[stage]; $('#step-tabs').querySelectorAll('.step-tab').forEach((tab, index) => tab.classList.toggle('active', index === stage)); $('#mission-scene').textContent = item.scene; $('#mission-prompt-title').textContent = item.title; $('#mission-label').textContent = item.label; const input = $('#mission-answer'); input.value = ''; input.placeholder = item.placeholder; const starters = $('#starter-list'); starters.replaceChildren(); item.starters.forEach(text => { const button = document.createElement('button'); button.type = 'button'; button.className = 'starter-chip'; button.textContent = text; button.addEventListener('click', () => { input.value = text; input.focus(); input.setSelectionRange(text.length, text.includes('…') ? text.length : text.length); validateMission(); }); starters.append(button); }); setNotice('#mission-feedback', 'Write a short line to unlock feedback.'); $('#mission-submit').textContent = stage === 2 ? 'Finish the mission ↗' : 'Say it to Nila ↗'; validateMission(); }
function validateMission() { $('#mission-submit').disabled = $('#mission-answer').value.trim().length < 2; }
function addMissionBubble(speaker, text) { const feed = $('#mission-dialogue'); feed.querySelector('.dialogue-placeholder')?.remove(); const bubble = document.createElement('div'); bubble.className = `mission-bubble ${speaker === 'You' ? 'learner' : 'friend'}`; const name = document.createElement('b'); name.textContent = speaker; const words = document.createElement('span'); words.textContent = text; bubble.append(name, words); feed.append(bubble); feed.scrollTop = feed.scrollHeight; }
function speak(text, gender, statusSelector) { if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
    setNotice(statusSelector, 'Text is ready. Speech is not available in this browser.');
    return;
} const synth = window.speechSynthesis, voices = synth.getVoices().filter(v => /^en(-|_)/i.test(v.lang)), pattern = gender === 'female' ? /female|woman|samantha|ava|jenny|aria|zira|susan|karen|moira|serena|victoria/i : /male|man|daniel|david|mark|guy|james|oliver|ryan|alex|george|fred/i, voice = voices.find(v => pattern.test(v.name)); synth.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = voice?.lang ?? 'en-US'; if (voice)
    utterance.voice = voice; utterance.rate = .93; utterance.pitch = gender === 'female' ? 1.1 : .91; utterance.onstart = () => setNotice(statusSelector, `Speaking${voice ? ` with ${voice.name}` : ' with the browser voice'}.`); utterance.onend = () => setNotice(statusSelector, ''); utterance.onerror = event => setNotice(statusSelector, `Text works; speech could not play (${event.error}).`); synth.speak(utterance); }
function evaluateWriting(text, needName) { const clean = text.trim(), strengths = [], feedback = []; if (/\b(hi|hello|hey|good morning|good afternoon)\b/i.test(clean))
    strengths.push('You opened with a greeting.');
else
    feedback.push('Add a friendly greeting such as “Hi” or “Hello”.'); if (/\b(i am|i’m|i'm|my name is)\b/i.test(clean))
    strengths.push('You used a clear self-introduction phrase.');
else if (needName)
    feedback.push('Say who you are: “I’m …” or “My name is …”.'); if (/\b(what about you|how about you|where are you from|what do you like|what are you interested|would you like|have you)\b/i.test(clean) || clean.includes('?'))
    strengths.push('You invited the other person to join in.');
else if (needName)
    feedback.push('Add a kind follow-up question to keep the conversation going.'); if (/\b(this is|meet my|my friend|classmate)\b/i.test(clean.toLowerCase()))
    strengths.push('You included another person.'); if (clean.length < 12)
    feedback.push('Try adding a little more so the other person has something to respond to.'); if (!feedback.length)
    feedback.push('Your introduction is clear and welcoming. Try saying it to a classmate.'); return { score: Math.min(3, strengths.length), feedback, strengths }; }
function showAssessment(container, result, title) { container.replaceChildren(); const summary = document.createElement('div'); summary.className = 'feedback-score'; const score = document.createElement('strong'); score.textContent = `${result.score}/3`; const text = document.createElement('p'); text.textContent = title; summary.append(score, text); container.append(summary); const list = document.createElement('ul'); list.className = 'feedback-list'; [...result.strengths, ...result.feedback].forEach(line => { const li = document.createElement('li'); li.textContent = line; list.append(li); }); container.append(list); }
function markStage(index) { const items = $$('#lesson-route li'); items[index]?.classList.add('route-done'); if (items[index + 1]) {
    items.forEach(item => item.classList.remove('route-active'));
    items[index + 1].classList.add('route-active');
} }
function initLesson() {
    $('#start-lesson').addEventListener('click', () => $('#warmup').scrollIntoView({ behavior: 'smooth', block: 'start' }));
    $$('.warmup-option').forEach(button => button.addEventListener('click', () => { $$('.warmup-option').forEach(option => option.classList.remove('chosen', 'correct', 'incorrect')); button.classList.add('chosen'); const ok = button.getAttribute('data-correct') === 'true'; button.classList.add(ok ? 'correct' : 'incorrect'); setNotice('#warmup-feedback', ok ? 'Good choice. It is friendly, gives a shared context, and invites a reply.' : 'That could feel abrupt or excluding. Try a gentle question connected to the event.'); if (ok)
        markStage(0); }));
    $$('.text-advance').forEach(button => button.addEventListener('click', () => { const target = document.getElementById(button.getAttribute('data-next') ?? ''); target?.scrollIntoView({ behavior: 'smooth', block: 'start' }); target?.classList.add('is-highlighted'); setTimeout(() => target?.classList.remove('is-highlighted'), 1300); }));
    $('#notice-answer').addEventListener('change', event => { const value = event.target.value; setNotice('#notice-feedback', value === 'introduce' ? 'Correct. “This is my friend Rafi” tells us who the person is.' : value ? 'Not quite. Look for the phrase that names another person and your relationship.' : ''); if (value === 'introduce')
        markStage(1); });
    $$('.hear-phrase').forEach(button => button.addEventListener('click', () => speak(button.getAttribute('data-say') ?? '', button.getAttribute('data-voice') === 'male' ? 'male' : 'female', '#voice-notice')));
    $('#step-tabs').addEventListener('click', event => { const button = event.target.closest('.step-tab'); if (button) {
        stage = Number(button.dataset.step);
        renderStage();
    } });
    $('#mission-answer').addEventListener('input', validateMission);
    $('#mission-answer').addEventListener('keydown', event => { if (event.key === 'Enter') {
        event.preventDefault();
        $('#mission-submit').click();
    } });
    $('#mission-submit').addEventListener('click', () => { const answer = $('#mission-answer').value.trim(); if (answer.length < 2) {
        setNotice('#mission-feedback', 'Write a short line first. You can use a starter above.');
        return;
    } addMissionBubble('You', answer); const reply = stageData[stage].reply(answer); lastReply = reply; addMissionBubble('Nila', reply); setNotice('#mission-feedback', stage === 2 ? 'Mission complete. Your words welcomed someone and kept the conversation open.' : 'Nice work. Notice how your words make space for another person.'); if (stage === 2)
        markStage(2); speak(reply, $('#guest-voice').value, '#voice-notice'); if (stage < 2) {
        stage = (stage + 1);
        renderStage();
    }
    else {
        $('#mission-submit').textContent = 'Mission complete ✓';
        $('#mission-submit').disabled = true;
    } });
    $('#replay-last').addEventListener('click', () => lastReply ? speak(lastReply, $('#guest-voice').value, '#voice-notice') : setNotice('#voice-notice', 'Complete a mission step first to hear Nila’s reply.'));
    $('#roleplay-check').addEventListener('click', () => { const text = $('#roleplay-answer').value; if (!text.trim()) {
        setNotice('#roleplay-feedback', 'Write a line first. Try “Nila, this is my friend Rafi…”');
        return;
    } const result = evaluateWriting(text, false); showAssessment($('#roleplay-feedback'), result, result.score >= 2 ? 'You helped the classmates connect.' : 'Use the feedback to make the meeting clearer and warmer.'); markStage(3); });
    $('#roleplay-model').addEventListener('click', () => { $('#roleplay-answer').value = 'Nila, this is my friend Rafi. Rafi joined the photography club last semester. What do you like taking photos of?'; setNotice('#roleplay-feedback', 'Example added. Notice the names, shared interest, and open question. Now adapt it in your own words.'); });
    $('#submit-assessment').addEventListener('click', submitAssessment);
    $('#reset-lesson').addEventListener('click', () => { if (confirm('Reset your lesson answers and timer?'))
        window.location.reload(); });
    $('#timer-toggle').addEventListener('click', toggleTimer);
    $('#guest-voice').addEventListener('change', () => { if (lastReply)
        speak(lastReply, $('#guest-voice').value, '#voice-notice'); });
    // Extra pair-work: choose a social situation, then practise a suitable opening and response.
    $('#situations').addEventListener('change', renderSituation);
    $('#situation-check').addEventListener('click', checkSituation);
    $('#repair-check').addEventListener('click', checkRepair);
    $('#situation-replay').addEventListener('click', () => lastReply ? speak(lastReply, $('#guest-voice').value, '#situation-feedback') : setNotice('#situation-feedback', 'Try the role-play first, then replay the reply.'));
    renderStage();
    renderSituation();
}
function submitAssessment() { const one = document.querySelector('input[name="quiz1"]:checked')?.value, two = document.querySelector('input[name="quiz2"]:checked')?.value, writing = $('#exit-answer').value.trim(); if (!one || !two || !writing) {
    setNotice('#assessment-result', 'Complete both choices and write your two-line introduction before checking your learning.');
    return;
} const result = evaluateWriting(writing, true), quiz = Number(one === 'b') + Number(two === 'a'); result.score = Math.min(3, quiz + Number(result.score > 0)); showAssessment($('#assessment-result'), result, result.score === 3 ? 'Strong evidence: you chose welcoming language and wrote an effective introduction.' : result.score === 2 ? 'You’re getting there. Review the notes, then improve one line.' : 'Keep practising. The lesson toolkit has useful starters.'); $('#completion-stamp').removeAttribute('hidden'); markStage(4); }
function renderSituation() { const select = $('#situations'); if (!select)
    return; const prompts = { club: { scene: 'At the campus club fair, a new student is looking at the debate society poster.', person: 'Nila', line: '“I’m curious about debate, but I don’t know anyone here.”', starters: ['Hi, I’m …', 'Would you like to meet …?', 'What kind of topics interest you?'] }, library: { scene: 'During a group study session at the university library, someone sits at your table.', person: 'A new classmate', line: '“Is anyone using this seat?”', starters: ['Hi, I’m …', 'We’re working on …', 'What subject are you studying?'] }, festival: { scene: 'At a campus cultural evening, your classmate arrives while you are talking with a visitor.', person: 'A visitor', line: '“The music is wonderful. Is this event every year?”', starters: ['This is my friend …', 'We’re enjoying …', 'What has been your favourite part?'] } }; const item = prompts[select.value] ?? prompts.club; $('#situation-scene').textContent = item.scene; $('#situation-person').textContent = item.person; $('#situation-line').textContent = item.line; const chips = $('#situation-starters'); chips.replaceChildren(); item.starters.forEach(text => { const b = document.createElement('button'); b.type = 'button'; b.className = 'starter-chip'; b.textContent = text; b.addEventListener('click', () => { const input = $('#situation-answer'); input.value = text; input.focus(); }); chips.append(b); }); $('#situation-answer').setAttribute('placeholder', `Write a welcoming reply to ${item.person}…`); setNotice('#situation-feedback', 'Choose a setting, then write one or two lines.'); $('#situation-dialogue').replaceChildren(); }
function checkSituation() { const text = $('#situation-answer').value.trim(); if (!text) {
    setNotice('#situation-feedback', 'Write a reply first. Try one of the starters, then add your own words.');
    return;
} const result = evaluateWriting(text, true), container = $('#situation-dialogue'); container.replaceChildren(); const learner = document.createElement('p'); learner.className = 'practice-message learner-message'; learner.textContent = `You: ${text}`; const answer = text.toLowerCase().includes('?') ? 'That sounds interesting! I’m glad you said hello. What else would you like to know?' : 'Hi! I’m glad you came over. What would you like to know?'; lastReply = answer; const other = document.createElement('p'); other.className = 'practice-message partner-message'; other.textContent = `${$('#situation-person').textContent}: ${answer}`; container.append(learner, other); setNotice('#situation-feedback', result.score >= 2 ? 'Strong, welcoming start. You greeted them and helped the conversation continue.' : 'Nice start. Try adding a greeting, your name, or one open question.'); markStage(3); speak(answer, $('#guest-voice').value, '#situation-feedback'); }
function checkRepair() { const answer = document.querySelector('input[name="repair-choice"]:checked')?.value; if (!answer) {
    setNotice('#repair-feedback', 'Choose the phrase you would use.');
    return;
} setNotice('#repair-feedback', answer === 'repair' ? 'Exactly. “Would you like to join us?” is an invitation, not a demand. You can make it even warmer by introducing yourself first.' : 'Try again. A welcoming invitation gives the other person a choice and an easy way to respond.'); if (answer === 'repair')
    markStage(3); }
function toggleTimer() { const button = $('#timer-toggle'), display = $('#timer-display'); if (timerRunning) {
    clearInterval(timerId);
    timerRunning = false;
    button.textContent = 'Resume 15-minute timer';
    button.setAttribute('aria-pressed', 'false');
    document.body.classList.remove('timer-running');
    return;
} timerRunning = true; button.textContent = 'Pause lesson timer'; button.setAttribute('aria-pressed', 'true'); document.body.classList.add('timer-running'); timerId = window.setInterval(() => { remaining--; display.textContent = `${Math.floor(remaining / 60).toString().padStart(2, '0')}:${(remaining % 60).toString().padStart(2, '0')}`; if (remaining <= 60)
    display.parentElement?.classList.add('timer-warning'); if (remaining <= 0) {
    clearInterval(timerId);
    timerRunning = false;
    button.textContent = 'Time is up';
    setNotice('#assessment-result', '15 minutes are up. Finish the exit ticket to show what you learned.');
    $('#check').scrollIntoView({ behavior: 'smooth' });
} }, 1000); }
window.addEventListener('DOMContentLoaded', initLesson);
