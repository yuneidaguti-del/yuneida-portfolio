(function () {
  const EMAIL = 'yuneida.guti@gmail.com';

  const styles = `
    #chat-widget { position: fixed; bottom: 2rem; right: 2rem; z-index: 999; font-family: 'DM Sans', sans-serif; transition: bottom 0.15s ease; }

    #chat-btn {
      display: flex; align-items: center; gap: 0.6rem;
      background: #2A2218; color: #FDFAF7;
      border: none; cursor: pointer;
      padding: 0.85rem 1.4rem;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;
      box-shadow: 0 4px 24px rgba(42,34,24,0.22);
      transition: background 0.2s, transform 0.2s;
      position: relative;
    }
    #chat-btn:hover { background: #B85C38; transform: translateY(-2px); }
    #chat-btn .chat-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #C17B5C;
      animation: pulse 2s infinite;
      flex-shrink: 0;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.3); }
    }

    #chat-panel {
      display: none;
      position: absolute; bottom: 4.2rem; right: 0;
      width: 320px;
      background: #FDFAF7;
      box-shadow: 0 8px 40px rgba(42,34,24,0.18);
      flex-direction: column;
      overflow: hidden;
    }
    #chat-panel.open { display: flex; animation: slideUp 0.25s ease; }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .chat-header {
      background: #2A2218; color: #FDFAF7;
      padding: 1rem 1.2rem;
      display: flex; align-items: center; gap: 0.8rem;
    }
    .chat-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: #C17B5C;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 500; letter-spacing: 0.05em;
      flex-shrink: 0; overflow: hidden;
    }
    .chat-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: center 10%; }
    .chat-header-info { flex: 1; }
    .chat-name { font-size: 0.85rem; font-weight: 500; letter-spacing: 0.04em; }
    .chat-status { font-size: 0.7rem; opacity: 0.55; margin-top: 0.15rem; letter-spacing: 0.04em; }
    .chat-close-btn {
      background: none; border: none; color: rgba(253,250,247,0.5);
      cursor: pointer; font-size: 1rem; line-height: 1; padding: 0;
      transition: color 0.2s;
    }
    .chat-close-btn:hover { color: #FDFAF7; }

    .chat-body { padding: 1.2rem; display: flex; flex-direction: column; gap: 1rem; }

    .chat-bubble {
      background: #F7F3EE;
      border: 1px solid #E8DDD0;
      padding: 0.9rem 1rem;
      font-size: 0.88rem; line-height: 1.65; color: #2A2218;
    }

    .chat-quickreplies { display: flex; flex-direction: column; gap: 0.4rem; }
    .chat-quickreplies button {
      background: transparent;
      border: 1px solid #E8DDD0;
      padding: 0.6rem 0.9rem;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem; letter-spacing: 0.06em;
      color: #2A2218; cursor: pointer; text-align: left;
      transition: background 0.2s, border-color 0.2s;
    }
    .chat-quickreplies button:hover { background: #F7F3EE; border-color: #C17B5C; color: #C17B5C; }

    .chat-input-wrap {
      display: flex; border-top: 1px solid #E8DDD0;
    }
    #chat-input {
      flex: 1; border: none; outline: none;
      padding: 0.85rem 1rem;
      font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
      background: #FDFAF7; color: #2A2218;
    }
    #chat-input::placeholder { color: #8C7E6F; }
    #chat-send {
      background: #C17B5C; color: white; border: none;
      padding: 0 1.2rem; cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
      transition: background 0.2s;
    }
    #chat-send:hover { background: #B85C38; }
  `;

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Build HTML
  const widget = document.createElement('div');
  widget.id = 'chat-widget';
  widget.innerHTML = `
    <div id="chat-panel">
      <div class="chat-header">
        <div class="chat-avatar">
          <img src="https://pub-df00f54d297446b9a93ee43e7eba0e5e.r2.dev/Photos%20of%20Yuneida/setty_139.jpg" alt="Yuneida" onerror="this.style.display='none';this.parentNode.textContent='YG'" />
        </div>
        <div class="chat-header-info">
          <div class="chat-name">Yuneida Gutierrez</div>
          <div class="chat-status">Typically replies within 24 hours</div>
        </div>
        <button class="chat-close-btn" id="chat-close">✕</button>
      </div>
      <div class="chat-body">
        <div class="chat-bubble">
          Hi there! 👋 Thinking about working together? Tell me a bit about what you need and I'll get back to you.
        </div>
        <div class="chat-quickreplies">
          <button>I'm interested in UGC content</button>
          <button>I need influencer management</button>
          <button>I'd like a creator collaboration</button>
          <button>I have a project in mind</button>
        </div>
      </div>
      <div class="chat-input-wrap">
        <input type="text" id="chat-input" placeholder="Type a message..." />
        <button id="chat-send">Send</button>
      </div>
    </div>
    <button id="chat-btn">
      <span class="chat-dot"></span>
      Let's Work Together
    </button>
  `;
  document.body.appendChild(widget);

  const btn = document.getElementById('chat-btn');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  btn.addEventListener('click', () => panel.classList.toggle('open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  // Quick replies fill input
  document.querySelectorAll('.chat-quickreplies button').forEach(b => {
    b.addEventListener('click', () => {
      input.value = b.textContent;
      input.focus();
    });
  });

  // Send opens mailto
  function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;
    window.location.href = `mailto:${EMAIL}?subject=Working Together&body=${encodeURIComponent(msg)}`;
    input.value = '';
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  // Keep button above footer when footer scrolls into view
  function adjustWidgetPosition() {
    const footer = document.querySelector('footer');
    const w = document.getElementById('chat-widget');
    if (!footer || !w) return;
    const footerTop = footer.getBoundingClientRect().top;
    const vh = window.innerHeight;
    if (footerTop < vh) {
      w.style.bottom = (vh - footerTop) + 'px';
    } else {
      w.style.bottom = '2rem';
    }
  }
  window.addEventListener('scroll', adjustWidgetPosition, { passive: true });
  window.addEventListener('resize', adjustWidgetPosition);
  adjustWidgetPosition();
})();
