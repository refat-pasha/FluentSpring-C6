// Conversation activity. Chat replies are local and work without speech support.
(function () {
  function initConversation() {
    const form = document.getElementById('conversation-form');
    const field = document.getElementById('conversation-input');
    const feed = document.getElementById('conversation-feed');
    const notice = document.getElementById('chat-status');
    const voiceSelect = document.getElementById('friend-gender');
    const clear = document.getElementById('clear-conversation');
    if (!form || !field || !feed) return false;
    if (form.dataset.ready === 'true') return true;
    form.dataset.ready = 'true';
    let turn = 0;

    function bubble(who, words) {
      feed.querySelector('.conversation-empty')?.remove();
      const node = document.createElement('article');
      node.className = 'chat-bubble ' + (who === 'You' ? 'chat-you' : 'chat-friend');
      const title = document.createElement('strong'); title.textContent = who;
      const message = document.createElement('p'); message.textContent = words;
      node.append(title, message); feed.appendChild(node); feed.scrollTop = feed.scrollHeight;
    }
    function speak(words) {
      if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') {
        notice.textContent = 'Your text conversation works; speech is not available in this browser.'; return;
      }
      try {
        const female = !voiceSelect || voiceSelect.value === 'female';
        const voices = window.speechSynthesis.getVoices().filter(v => /^en(-|_)/i.test(v.lang));
        const pattern = female ? /female|woman|samantha|ava|jenny|aria|zira|susan|karen|moira|serena|victoria/i : /male|man|daniel|david|mark|guy|james|oliver|ryan|alex|george|fred/i;
        const voice = voices.find(v => pattern.test(v.name));
        const utterance = new SpeechSynthesisUtterance(words);
        utterance.lang = voice ? voice.lang : 'en-US';
        if (voice) utterance.voice = voice;
        utterance.pitch = female ? 1.12 : .9; utterance.rate = .94;
        utterance.onstart = () => { notice.textContent = 'Maya is speaking' + (voice ? ' with ' + voice.name : ' with the browser voice') + '.'; };
        utterance.onend = () => { notice.textContent = ''; };
        utterance.onerror = e => { notice.textContent = 'Text chat is working, but speech failed: ' + e.error; };
        window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance);
      } catch (e) { notice.textContent = 'Text chat is working; this browser could not start speech.'; }
    }
    const replies = [
      text => { const m = text.match(/(?:i am|i'm|i’m|my name is)\s+([A-Za-z]+)/i); return 'Hi' + (m ? ', ' + m[1] : ' there') + '! I’m Maya. It’s lovely to meet you. Where are you from?'; },
      () => 'That sounds lovely! What do you like to do in your free time?',
      () => 'That’s interesting. What made you want to join this club?',
      () => 'I’ve really enjoyed talking with you. I hope we meet again soon!'
    ];
    form.addEventListener('submit', function (event) {
      event.preventDefault(); event.stopPropagation();
      const text = field.value.trim();
      if (!text) { notice.textContent = 'Type a message first, then press Send.'; field.focus(); return; }
      bubble('You', text); field.value = '';
      const answer = replies[Math.min(turn, replies.length - 1)](text); turn++;
      bubble('Maya', answer); speak(answer); field.focus();
    });
    clear?.addEventListener('click', function () {
      turn = 0; if (window.speechSynthesis) window.speechSynthesis.cancel();
      feed.innerHTML = '<p class="conversation-empty">Your conversation will appear here. Say hello to begin!</p>';
      notice.textContent = ''; field.value = ''; field.focus();
    });
    return true;
  }
  // Handle both normal page loads and scripts injected after DOMContentLoaded.
  if (!initConversation()) {
    document.addEventListener('DOMContentLoaded', initConversation, { once: true });
    let tries = 0; const retry = setInterval(function () { tries++; if (initConversation() || tries > 30) clearInterval(retry); }, 100);
  }
})();
