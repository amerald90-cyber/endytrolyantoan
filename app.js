/**
 * ENDY - TRỢ LÝ AN TOÀN CHO TRẺ EM
 * Main Interactive Application Script
 */

// =============================================================================
// 1. STATE & STORAGE MANAGEMENT
// =============================================================================
const STATE = {
  activeScreen: 'cover-screen', // 'cover-screen' | 'app-screen'
  musicPlaying: false,
  userExplicitlyMuted: false,
  musicVolume: 0.7,
  activeCategory: 'all',
  userName: localStorage.getItem('endy_child_name') || 'Bạn nhỏ',
  userAvatar: localStorage.getItem('endy_child_avatar') || 'assets/avatar_boy.svg',
  hasGreeted: false,
  isSpeaking: false,
  isListening: false
};

// =============================================================================
// 2. AUDIO & TING SOUND EFFECT (WEB AUDIO API)
// =============================================================================
const bgMusic = document.getElementById('bg-music');
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// "Ting Teng" chime effect when Endy replies
function playTingSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    // Cheerful chime: E6 (1318.5Hz) & B6 (1975.5Hz)
    osc1.frequency.setValueAtTime(1318.51, ctx.currentTime);
    osc2.frequency.setValueAtTime(1975.53, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.22);
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn('Audio chime note error:', e);
  }
}

// Background Music Control
function toggleMusic(forcePlay) {
  if (!bgMusic) return;

  const shouldPlay = (typeof forcePlay === 'boolean') ? forcePlay : !STATE.musicPlaying;

  if (shouldPlay) {
    STATE.userExplicitlyMuted = false;
    bgMusic.volume = STATE.musicVolume;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        STATE.musicPlaying = true;
        updateMusicUI();
      }).catch(err => {
        // Browser requires user gesture first
        STATE.musicPlaying = false;
        updateMusicUI();
      });
    }
  } else {
    bgMusic.pause();
    STATE.musicPlaying = false;
    STATE.userExplicitlyMuted = true;
    updateMusicUI();
  }
}

function updateMusicUI() {
  const coverEq = document.getElementById('cover-eq');
  const coverIcon = document.getElementById('cover-music-icon');
  const coverText = document.getElementById('cover-music-title');
  const appMusicToggle = document.getElementById('app-music-toggle');
  const appMusicIcon = document.getElementById('app-music-icon');
  const appMusicText = document.getElementById('app-music-text');

  if (STATE.musicPlaying) {
    if (coverEq) coverEq.classList.add('playing');
    if (coverIcon) coverIcon.textContent = '⏸';
    if (coverText) coverText.textContent = '🎵 Endy Cùng Em Đến Trường';
    if (appMusicToggle) appMusicToggle.classList.add('active');
    if (appMusicIcon) appMusicIcon.textContent = '🎶';
    if (appMusicText) appMusicText.textContent = 'Endy Cùng Em Đến Trường';
  } else {
    if (coverEq) coverEq.classList.remove('playing');
    if (coverIcon) coverIcon.textContent = '▶';
    if (coverText) coverText.textContent = '🎵 Bài hát: Tạm dừng';
    if (appMusicToggle) appMusicToggle.classList.remove('active');
    if (appMusicIcon) appMusicIcon.textContent = '🎵';
    if (appMusicText) appMusicText.textContent = 'Phát bài hát';
  }
}

// Global interaction listeners to guarantee audio plays automatically
function enableAutoplayOnFirstInteraction() {
  function tryStartMusic() {
    if (!STATE.musicPlaying && !STATE.userExplicitlyMuted) {
      toggleMusic(true);
    }
  }

  // Attempt immediate play
  toggleMusic(true);

  // Bind to any micro-interaction
  ['click', 'pointerdown', 'pointermove', 'mousemove', 'touchstart', 'keydown', 'scroll', 'focus'].forEach(evt => {
    window.addEventListener(evt, tryStartMusic, { capture: true });
    document.addEventListener(evt, tryStartMusic, { capture: true });
  });
}

// =============================================================================
// 3. NAVIGATION (SWITCHING SCREENS) & ENDY BOUNCE GREETING
// =============================================================================
function showScreen(screenId) {
  const coverScreen = document.getElementById('cover-screen');
  const appScreen = document.getElementById('app-screen');

  if (screenId === 'app-screen') {
    if (coverScreen) {
      coverScreen.classList.remove('active');
      coverScreen.style.setProperty('display', 'none', 'important');
    }
    if (appScreen) {
      appScreen.classList.add('active');
      appScreen.style.setProperty('display', 'flex', 'important');
    }
    STATE.activeScreen = 'app-screen';

    // Ensure music is playing if not explicitly muted by user
    if (!STATE.musicPlaying && !STATE.userExplicitlyMuted) {
      toggleMusic(true);
    }

    // Trigger Endy bouncing entrance greeting if first time entering!
    if (!STATE.hasGreeted) {
      triggerEndyGreeting();
      STATE.hasGreeted = true;
    }

    // Focus input
    const input = document.getElementById('chat-input');
    if (input) setTimeout(() => input.focus(), 300);
  } else {
    if (appScreen) {
      appScreen.classList.remove('active');
      appScreen.style.setProperty('display', 'none', 'important');
    }
    if (coverScreen) {
      coverScreen.classList.add('active');
      coverScreen.style.setProperty('display', 'flex', 'important');
    }
    STATE.activeScreen = 'cover-screen';
  }
}
window.showScreen = showScreen;

function goToChatCategory(category) {
  showScreen('app-screen');
  setTimeout(() => {
    selectCategory(category);
  }, 250);
}
window.goToChatCategory = goToChatCategory;

// Endy bounces out and greets first!
function triggerEndyGreeting() {
  const chatMascot = document.getElementById('chat-hero-mascot');
  if (chatMascot) {
    chatMascot.style.animation = 'none';
    void chatMascot.offsetWidth; // trigger reflow
    chatMascot.style.animation = 'endyBounce 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }

  // Play chime
  playTingSound();

  // Show typing indicator briefly, then greeting
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.classList.add('active');

  setTimeout(() => {
    if (typing) typing.classList.remove('active');

    const greetingText =
      `**Chào ${STATE.userName}! 👋 Mình là Endy - Lá chắn an toàn của các bạn nhỏ 🛡️**\n\n` +
      `Tớ rất vui được gặp em! Tớ sẽ giúp em học các kỹ năng cần thiết để bảo vệ bản thân và bạn bè:\n` +
      `• 🛟 **Phòng chống đuối nước & cứu bạn an toàn**\n` +
      `• 🚦 **An toàn giao thông & đi qua đường đúng cách**\n` +
      `• 🧯 **Phòng cháy chữa cháy & kỹ năng thoát hiểm**\n` +
      `• 🩹 **Xử lý tai nạn thương tích (hóc nghẹn, bỏng, chó lạ...)**\n` +
      `• ⚡ **An toàn điện trong gia đình và trường học**\n\n` +
      `Em hãy bấm vào các **câu hỏi gợi ý** bên dưới hoặc gõ câu hỏi vào ô chat để trò chuyện cùng Endy nhé! 😊`;

    appendBotMessage(greetingText, '', true);
    playTingSound();
  }, 500);
}

// =============================================================================
// 4. CATEGORIES & SUGGESTED QUESTIONS
// =============================================================================
const CATEGORY_SUGGESTIONS = {
  all: [
    '🛟 Nếu thấy bạn rơi xuống nước thì làm gì?',
    '🚒 Cháy điện có được dội nước không?',
    '🚦 Đi qua đường thế nào cho an toàn?',
    '🔍 Em bị hóc nghẹn thì sao?',
    '🐶 Gặp chó lạ làm gì?',
    '🔥 Số cứu hỏa là gì?',
    '⚡ Không tự ý nghịch điện',
    '🏊 Bị chuột rút khi bơi làm sao?',
    '🩹 Bị bỏng nước sôi làm gì?',
    '🪖 Đội mũ bảo hiểm đúng cách?'
  ],
  drowning: [
    '🛟 Nếu thấy bạn rơi xuống nước thì làm gì?',
    '🏊 Bị chuột rút khi bơi làm sao?',
    '🌊 Kỹ năng nổi ngửa tự cứu thế nào?',
    '⚠️ Tại sao không được tự ý đi bơi một mình?',
    '🆘 Khi nào cần gọi số 115 cấp cứu?',
    '🦺 Mặc áo phao khi nào?'
  ],
  traffic: [
    '🚦 Đi qua đường thế nào cho an toàn?',
    '🪖 Quy tắc đội mũ bảo hiểm đúng cách?',
    '🚴 Đi xe đạp trên đường cần nhớ gì?',
    '🟡 Đèn giao thông màu vàng phải làm sao?',
    '🚶 Đi bộ trên đường không có vỉa hè?'
  ],
  fire: [
    '🚒 Cháy điện có được dội nước không?',
    '🔥 Số cứu hỏa là gì?',
    '🧯 Cách bò thấp thoát khỏi đám khói?',
    '💨 Dùng khăn ướt bịt mũi miệng khi cháy?',
    '🏢 Thoát hiểm nhà cao tầng khi có cháy?'
  ],
  injury: [
    '🔍 Em bị hóc nghẹn thì sao?',
    '🐶 Gặp chó lạ làm gì?',
    '🩹 Bị bỏng nước sôi làm gì?',
    '🐝 Bị ong đốt xử lý thế nào?',
    '✂️ Cẩn thận với dao kéo và vật sắc nhọn',
    '📞 Gọi 111 bảo vệ trẻ em khi nào?'
  ],
  electric: [
    '⚡ Không tự ý nghịch điện',
    '💧 Tay ướt có được chạm vào ổ cắm không?',
    '⚠️ Thấy dây điện rơi xuống đất làm gì?',
    '⛈️ Tránh sét đánh khi trời mưa dông?',
    '🔌 Dây điện bị hở phải làm sao?'
  ],
  quick: [
    '📞 Bốn số điện thoại cứu hộ khẩn cấp',
    '❓ Đố em câu hỏi đúng sai về an toàn',
    '🛡️ Endy là ai và giúp được gì cho em?',
    '🚨 Gọi 114 nói những thông tin gì?'
  ]
};

function selectCategory(categoryKey) {
  STATE.activeCategory = categoryKey;

  // Update sidebar active buttons
  const catButtons = document.querySelectorAll('.category-btn');
  catButtons.forEach(btn => {
    if (btn.dataset.category === categoryKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update suggestions bar
  renderSuggestions(categoryKey);

  // Bot intro tip for category
  sendCategoryWelcome(categoryKey);
}

function renderSuggestions(categoryKey) {
  const bar = document.getElementById('suggestions-bar');
  if (!bar) return;

  const suggestions = CATEGORY_SUGGESTIONS[categoryKey] || CATEGORY_SUGGESTIONS.all;
  let html = `<span class="suggestions-label">⚡ Gợi ý câu hỏi cho em:</span>`;

  suggestions.forEach(text => {
    const cleanQuery = text.replace(/^[\uD800-\uDBFF\uDC00-\uDFFF\u2600-\u27BF\uFE0F\s]+/, '').trim();
    html += `<button class="suggestion-chip" onclick="sendSuggestion('${cleanQuery.replace(/'/g, "\\'")}')">${text}</button>`;
  });

  bar.innerHTML = html;
  bar.scrollLeft = 0;
}

function sendCategoryWelcome(categoryKey) {
  if (categoryKey === 'all') return;

  let tipText = '';
  let badge = '';

  switch (categoryKey) {
    case 'drowning':
      tipText = '**Chủ đề: Phòng chống đuối nước 🛟**\nEm hãy luôn nhớ: Không tự ý đi tắm ao hồ, sông suối một mình. Luôn bơi ở nơi có người lớn giám sát và biết bơi an toàn!';
      badge = 'assets/illust_drowning.png';
      break;
    case 'traffic':
      tipText = '**Chủ đề: An toàn giao thông 🚦**\nKhi ra đường, hãy luôn đi bộ trên vạch sang đường khi đèn xanh, và nhớ đội mũ bảo hiểm đạt chuẩn khi ngồi trên xe máy, xe đạp điện nhé!';
      badge = 'assets/illust_traffic.png';
      break;
    case 'fire':
      tipText = '**Chủ đề: Phòng cháy chữa cháy 🧯**\nKhi phát hiện đám cháy, hãy hô to cho người lớn, bò thấp người để tránh khói độc, dùng khăn ướt bịt mũi miệng và gọi ngay số **114**!';
      badge = 'assets/illust_electric.png';
      break;
    case 'injury':
      tipText = '**Chủ đề: Phòng tránh tai nạn thương tích 🩹**\nEndy sẽ hướng dẫn em cách xử lý khi bị hóc dị vật, bỏng nước sôi, gặp chó lạ và gọi số bảo vệ trẻ em **111**!';
      break;
    case 'electric':
      tipText = '**Chủ đề: An toàn điện ⚡**\nTuyệt đối không chọc que sắt vào ổ cắm, không chạm vào công tắc khi tay ướt và tránh xa các trạm biến áp, dây điện đứt!';
      badge = 'assets/illust_electric.png';
      break;
    case 'quick':
      tipText = '**Chủ đề: Câu hỏi nhanh & Đố vui an toàn 💬**\nEm có thể hỏi Endy bất kỳ câu hỏi nào hoặc bấm nút **Đố vui** trên thanh công cụ để thử tài hiểu biết nhé!';
      break;
  }

  if (tipText) {
    setTimeout(() => {
      appendBotMessage(tipText, badge);
      playTingSound();
    }, 200);
  }
}

// =============================================================================
// 5. CHAT MESSAGING ENGINE
// =============================================================================
function getCurrentTimeStr() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function formatMarkdown(text) {
  if (!text) return '';
  let html = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  html = html.replace(/\n•/g, '<br>•');
  return html;
}

function appendUserMessage(text) {
  const container = document.getElementById('chat-messages');
  const time = getCurrentTimeStr();

  const row = document.createElement('div');
  row.className = 'msg-row user';
  row.innerHTML = `
    <img src="${STATE.userAvatar}" alt="User" class="msg-avatar">
    <div class="msg-content-wrapper">
      <div class="msg-bubble">
        ${escapeHtml(text)}
      </div>
      <span class="msg-time">${time}</span>
    </div>
  `;

  const typingIndicator = document.getElementById('typing-indicator');
  container.insertBefore(row, typingIndicator);
  scrollChatToBottom();
}

function appendBotMessage(text, badgeImgUrl, isGreeting = false) {
  const container = document.getElementById('chat-messages');
  const time = getCurrentTimeStr();

  const formattedHtml = formatMarkdown(text);
  const badgeHtml = badgeImgUrl ? `<img src="${badgeImgUrl}" alt="Minh họa an toàn" class="bot-illustration-img">` : '';

  const row = document.createElement('div');
  row.className = `msg-row bot ${isGreeting ? 'endy-greeting' : ''}`;
  row.innerHTML = `
    <img src="assets/avatar_endy.png" alt="Endy" class="msg-avatar">
    <div class="msg-content-wrapper">
      <div class="msg-bubble">
        <div class="bot-header-name">
          <span>Endy</span>
          <span class="bot-badge-shield">🛡️</span>
        </div>
        <div class="bot-body-layout">
          <div class="bot-text-area">
            ${formattedHtml}
          </div>
          ${badgeHtml}
        </div>
        <div class="msg-actions">
          <button class="msg-action-btn" onclick="speakText(this)">🔊 Đọc to</button>
          <button class="msg-action-btn" onclick="copyMsgText(this)">📋 Sao chép</button>
          <span class="msg-time" style="margin-left: auto;">${time}</span>
        </div>
      </div>
    </div>
  `;

  const typingIndicator = document.getElementById('typing-indicator');
  container.insertBefore(row, typingIndicator);
  scrollChatToBottom();
}

function scrollChatToBottom() {
  const container = document.getElementById('chat-messages');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function handleSendMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;

  const rawText = input.value.trim();
  if (!rawText) return;

  // 1. Add user message
  appendUserMessage(rawText);
  input.value = '';

  // 2. Show typing indicator
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.classList.add('active');
  scrollChatToBottom();

  // 3. Search Endy Knowledge Base
  setTimeout(() => {
    if (typing) typing.classList.remove('active');

    let botResponse = null;
    let badge = '';

    if (window.searchEndyKB) {
      const match = window.searchEndyKB(rawText);
      if (match && match.item) {
        botResponse = match.item.response;
        badge = match.item.badge || '';
      }
    }

    if (!botResponse) {
      botResponse = `Xin lỗi **${STATE.userName}**, câu hỏi của em hơi vắn tắt nên Endy chưa tìm được câu trả lời chính xác nhất! 😊\n\nEm có thể hỏi mình về:\n• **Bơi lội an toàn & cứu đuối** (như: *thấy bạn đuối nước làm gì?*)\n• **An toàn giao thông** (như: *đi qua đường an toàn*, *mũ bảo hiểm*)\n• **Phòng cháy chữa cháy** (như: *cháy điện có dội nước không?*, *số 114*)\n• **Tai nạn thương tích** (như: *bị hóc nghẹn*, *bị bỏng*, *gặp chó lạ*)\n\nHoặc em hãy bấm vào các gợi ý có sẵn bên dưới nhé! ❤️`;
    }

    appendBotMessage(botResponse, badge);
    playTingSound();
  }, 450);
}

function sendSuggestion(text) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    handleSendMessage();
  }
}

function askEndyHotline(number) {
  showScreen('app-screen');
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = `Số điện thoại ${number} là gì?`;
    handleSendMessage();
  }
}

function clearChat() {
  if (confirm('Em có chắc muốn xóa lịch sử trò chuyện để bắt đầu cuộc trò chuyện mới không?')) {
    const container = document.getElementById('chat-messages');
    const typing = document.getElementById('typing-indicator');
    container.innerHTML = '';
    container.appendChild(typing);

    appendBotMessage(
      `Chào **${STATE.userName}**! Mình là **Endy - Lá chắn an toàn của các bạn nhỏ 🛡️**.\nEm muốn học hoặc hỏi về tình huống an toàn nào hôm nay? 😊`
    );
    playTingSound();
  }
}

function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(string).replace(/[&<>"']/g, s => entityMap[s]);
}

function copyMsgText(btn) {
  try {
    const bubble = btn.closest('.msg-bubble');
    const textArea = bubble.querySelector('.bot-text-area');
    if (textArea) {
      navigator.clipboard.writeText(textArea.innerText).then(() => {
        const origText = btn.textContent;
        btn.textContent = '✅ Đã chép!';
        setTimeout(() => { btn.textContent = origText; }, 1500);
      });
    }
  } catch (e) {
    console.error('Copy failed:', e);
  }
}

// =============================================================================
// 6. TEXT-TO-SPEECH (READ ALOUD IN VIETNAMESE)
// =============================================================================
function speakText(btn) {
  if (!('speechSynthesis' in window)) {
    alert('Trình duyệt của em chưa hỗ trợ tính năng đọc to giọng nói.');
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    btn.textContent = '🔊 Đọc to';
    return;
  }

  const bubble = btn.closest('.msg-bubble');
  const textArea = bubble.querySelector('.bot-text-area');
  if (!textArea) return;

  const textToRead = textArea.innerText.replace(/[•*#⚠️🛟🚦⚡🚒🍎🐶🩹❤️]/g, ' ');
  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  btn.textContent = '⏹️ Dừng';

  utterance.onend = () => { btn.textContent = '🔊 Đọc to'; };
  utterance.onerror = () => { btn.textContent = '🔊 Đọc to'; };

  window.speechSynthesis.speak(utterance);
}

// =============================================================================
// 7. SPEECH-TO-TEXT (VOICE INPUT)
// =============================================================================
function initVoiceInput() {
  const voiceBtn = document.getElementById('btn-voice-input');
  if (!voiceBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.title = 'Trình duyệt chưa hỗ trợ nhận diện giọng nói';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'vi-VN';
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceBtn.addEventListener('click', () => {
    if (STATE.isListening) {
      recognition.stop();
      return;
    }

    try {
      recognition.start();
      STATE.isListening = true;
      voiceBtn.classList.add('listening');
      voiceBtn.title = 'Đang lắng nghe bạn nói...';
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
    }
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById('chat-input');
    if (input) {
      input.value = transcript;
      handleSendMessage();
    }
  };

  recognition.onend = () => {
    STATE.isListening = false;
    voiceBtn.classList.remove('listening');
    voiceBtn.title = 'Nói câu hỏi của em bằng giọng nói';
  };

  recognition.onerror = () => {
    STATE.isListening = false;
    voiceBtn.classList.remove('listening');
  };
}

// =============================================================================
// 8. SAFETY QUIZ GAME (ĐỐ VUI AN TOÀN)
// =============================================================================
const QUIZ_QUESTIONS = [
  {
    q: "Khi thấy bạn không may rơi xuống nước sâu, việc em nên làm ĐẦU TIÊN là gì?",
    options: [
      "Nhảy ngay xuống nước để kéo bạn lên",
      "Hô thật to gọi người lớn và tìm vật nổi ném cho bạn",
      "Bỏ chạy về nhà không nói với ai",
      "Đứng im xem bạn bơi thế nào"
    ],
    correct: 1,
    explain: "Chính xác! Trẻ em tuyệt đối không tự nhảy xuống nước cứu bạn vì rất dễ bị kéo chìm theo. Hãy hô to và ném vật nổi!"
  },
  {
    q: "Khi xảy ra cháy do chập điện, em có được dùng nước để dội vào dập lửa không?",
    options: [
      "Được, cứ lấy nước dội thật nhiều cho nhanh tắt",
      "Tuyệt đối KHÔNG, vì nước dẫn điện gây nguy cơ điện giật tử vong",
      "Dùng nước nóng thì được, nước lạnh thì không",
      "Dội nước rồi mới rút phích cắm"
    ],
    correct: 1,
    explain: "Rất giỏi! Nước dẫn điện, dội nước vào đám cháy điện cực kỳ nguy hiểm. Phải ngắt cầu dao và gọi 114!"
  },
  {
    q: "Số điện thoại khẩn cấp nào sau đây dùng để gọi CỨU HỎA và CỨU NẠN CỨU HỘ?",
    options: [
      "113",
      "115",
      "114",
      "111"
    ],
    correct: 2,
    explain: "Đúng rồi! 114 là số cứu hỏa; 113 là công an; 115 là cấp cứu y tế; 111 là bảo vệ trẻ em!"
  },
  {
    q: "Khi đi qua đường lớn có xe cộ, quy tắc an toàn đúng nhất là gì?",
    options: [
      "Chạy thật nhanh sang đường không cần nhìn",
      "Đi đúng vạch kẻ đường, nhìn trái - phải - trái, giơ tay cao và đi cùng người lớn",
      "Vừa đi vừa cúi đầu bấm điện thoại",
      "Đi bất cứ chỗ nào mình thích"
    ],
    correct: 1,
    explain: "Tuyệt vời! Luôn đi trên vạch kẻ dành cho người đi bộ, quan sát kỹ và đi cùng người lớn để an toàn tuyệt đối!"
  },
  {
    q: "Khi một bạn nhỏ bị hóc dị vật hoặc nghẹn kẹo khó thở, ta tuyệt đối KHÔNG NÊN làm gì?",
    options: [
      "Dùng tay móc sâu bừa bãi vào cổ họng bạn",
      "Khuyến khích bạn ho mạnh nếu bạn còn ho được",
      "Báo ngay cho người lớn để làm thủ thuật vỗ lưng / ép bụng",
      "Gọi số 115 đưa đi cấp cứu"
    ],
    correct: 0,
    explain: "Chính xác! Dùng tay móc họng bừa bãi có thể vô tình đẩy dị vật vào sâu khí quản hơn, gây nghẹt thở hoàn toàn!"
  }
];

let quizIndex = 0;
let quizScore = 0;

function openQuiz() {
  quizIndex = 0;
  quizScore = 0;
  document.getElementById('quiz-container').style.display = 'block';
  document.getElementById('quiz-result-container').style.display = 'none';
  renderQuizQuestion();
  openModal('quiz-modal');
}

function renderQuizQuestion() {
  const q = QUIZ_QUESTIONS[quizIndex];
  document.getElementById('quiz-step-indicator').textContent = `Câu ${quizIndex + 1} / ${QUIZ_QUESTIONS.length}`;
  document.getElementById('quiz-question-text').textContent = q.q;

  const optContainer = document.getElementById('quiz-options-list');
  optContainer.innerHTML = '';

  const feedback = document.getElementById('quiz-feedback-box');
  feedback.style.display = 'none';

  const nextBtn = document.getElementById('quiz-next-btn');
  nextBtn.style.display = 'none';

  q.options.forEach((optText, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.textContent = `${String.fromCharCode(65 + idx)}. ${optText}`;
    btn.onclick = () => selectQuizOption(idx, btn);
    optContainer.appendChild(btn);
  });
}

function selectQuizOption(chosenIdx, clickedBtn) {
  const q = QUIZ_QUESTIONS[quizIndex];
  const allBtns = document.querySelectorAll('.quiz-opt-btn');
  allBtns.forEach(b => b.disabled = true);

  const feedback = document.getElementById('quiz-feedback-box');
  const nextBtn = document.getElementById('quiz-next-btn');

  if (chosenIdx === q.correct) {
    quizScore++;
    clickedBtn.classList.add('correct');
    feedback.className = 'quiz-feedback';
    feedback.style.display = 'block';
    feedback.style.background = '#dcfce7';
    feedback.style.color = '#15803d';
    feedback.innerHTML = `🎉 <b>Chính xác!</b> ${q.explain}`;
    playTingSound();
  } else {
    clickedBtn.classList.add('wrong');
    allBtns[q.correct].classList.add('correct');
    feedback.className = 'quiz-feedback';
    feedback.style.display = 'block';
    feedback.style.background = '#fee2e2';
    feedback.style.color = '#b91c1c';
    feedback.innerHTML = `❌ <b>Chưa đúng rồi!</b> ${q.explain}`;
  }

  nextBtn.style.display = 'flex';
  nextBtn.onclick = () => {
    quizIndex++;
    if (quizIndex < QUIZ_QUESTIONS.length) {
      renderQuizQuestion();
    } else {
      showQuizResult();
    }
  };
}

function showQuizResult() {
  document.getElementById('quiz-container').style.display = 'none';
  const resContainer = document.getElementById('quiz-result-container');
  resContainer.style.display = 'block';

  document.getElementById('quiz-score-text').textContent =
    `Em đã trả lời đúng ${quizScore} / ${QUIZ_QUESTIONS.length} câu hỏi!`;

  playTingSound();
}

function restartQuiz() {
  openQuiz();
}

// =============================================================================
// 9. PROFILE & USER PREFERENCES
// =============================================================================
function openProfileModal() {
  const nameInput = document.getElementById('input-child-name');
  if (nameInput) nameInput.value = STATE.userName;

  const choices = document.querySelectorAll('.avatar-choice');
  choices.forEach(c => {
    if (c.dataset.avatar === STATE.userAvatar) {
      c.classList.add('selected');
    } else {
      c.classList.remove('selected');
    }
  });

  openModal('profile-modal');
}

function selectAvatar(element) {
  document.querySelectorAll('.avatar-choice').forEach(c => c.classList.remove('selected'));
  element.classList.add('selected');
}

function saveProfile() {
  const nameInput = document.getElementById('input-child-name');
  const selectedAvatar = document.querySelector('.avatar-choice.selected');

  if (nameInput && nameInput.value.trim()) {
    STATE.userName = nameInput.value.trim();
    localStorage.setItem('endy_child_name', STATE.userName);
  }

  if (selectedAvatar && selectedAvatar.dataset.avatar) {
    STATE.userAvatar = selectedAvatar.dataset.avatar;
    localStorage.setItem('endy_child_avatar', STATE.userAvatar);
  }

  const display = document.getElementById('user-name-display');
  if (display) display.textContent = STATE.userName;

  const avatarDisplay = document.getElementById('user-avatar-display');
  if (avatarDisplay) avatarDisplay.src = STATE.userAvatar;

  closeModal('profile-modal');
  playTingSound();
}

// =============================================================================
// 10. MODAL HELPERS
// =============================================================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
});

// =============================================================================
// 11. INITIALIZATION & EVENT LISTENERS
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Update Initial Profile
  const nameDisplay = document.getElementById('user-name-display');
  if (nameDisplay) nameDisplay.textContent = STATE.userName;
  const avatarDisplay = document.getElementById('user-avatar-display');
  if (avatarDisplay) avatarDisplay.src = STATE.userAvatar;

  // Music volume slider
  const volumeSlider = document.getElementById('cover-volume');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      STATE.musicVolume = parseFloat(e.target.value);
      if (bgMusic) bgMusic.volume = STATE.musicVolume;
    });
  }

  // Cover enter button
  const btnEnterChat = document.getElementById('btn-enter-chat');
  if (btnEnterChat) {
    btnEnterChat.addEventListener('click', (e) => {
      e.stopPropagation();
      showScreen('app-screen');
    });
  }

  // Cover stage/poster click enters chat
  const coverStageClick = document.getElementById('cover-stage-click');
  if (coverStageClick) {
    coverStageClick.addEventListener('click', () => {
      showScreen('app-screen');
    });
  }

  // Mascot hero click on cover also enters chat
  const mascotHeroClick = document.getElementById('mascot-hero-click');
  if (mascotHeroClick) {
    mascotHeroClick.addEventListener('click', (e) => {
      e.stopPropagation();
      showScreen('app-screen');
    });
  }

  // Back to cover button
  const btnBackCover = document.getElementById('btn-back-cover');
  if (btnBackCover) {
    btnBackCover.addEventListener('click', () => {
      showScreen('cover-screen');
    });
  }

  const logoBackCover = document.getElementById('logo-back-cover');
  if (logoBackCover) {
    logoBackCover.addEventListener('click', () => {
      showScreen('cover-screen');
    });
  }

  // Cover music toggle
  const coverMusicToggle = document.getElementById('cover-music-toggle');
  if (coverMusicToggle) {
    coverMusicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // App music toggle
  const appMusicToggle = document.getElementById('app-music-toggle');
  if (appMusicToggle) {
    appMusicToggle.addEventListener('click', () => toggleMusic());
  }

  // Send message events
  const btnSend = document.getElementById('btn-send-msg');
  if (btnSend) {
    btnSend.addEventListener('click', handleSendMessage);
  }

  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSendMessage();
    });
  }

  // Clear chat
  const btnClear = document.getElementById('btn-clear-chat');
  if (btnClear) {
    btnClear.addEventListener('click', clearChat);
  }

  // Category buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectCategory(btn.dataset.category);
    });
  });

  // Modals buttons
  const btnQuiz = document.getElementById('btn-open-quiz');
  if (btnQuiz) btnQuiz.addEventListener('click', openQuiz);

  const btnProfile = document.getElementById('btn-profile');
  if (btnProfile) btnProfile.addEventListener('click', openProfileModal);

  const btnTips = document.getElementById('btn-open-tips');
  if (btnTips) btnTips.addEventListener('click', () => openModal('tips-modal'));

  // Init Voice Input
  initVoiceInput();

  // Try auto-playing music immediately & fallback on first click
  toggleMusic(true);
  enableAutoplayOnFirstInteraction();

  // Init Visitor Counter
  initVisitorCounter();

  // Play subtle entrance chime after brief delay
  setTimeout(() => {
    playTingSound();
  }, 1000);
});

// =============================================================================
// 12. BẢO VỆ AN TOÀN TRẺ EM: CHẶN CHUỘT PHẢI & PHÍM F12 / DEVTOOLS (SILENT LOCK)
// =============================================================================
function initSecurityProtection() {
  // 1. Chặn chuột phải hoàn toàn (Không hiện thông báo làm phiền)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // 2. Chặn các phím tắt F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + Shift + I (DevTools), Ctrl + Shift + J (Console), Ctrl + Shift + C (Inspect)
    if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + U (View Source)
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + S (Save Page)
    if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true });
}

initSecurityProtection();

// =============================================================================
// 13. TỔNG HỢP SỐ LƯỢT TRUY CẬP TỰ ĐỘNG (AUTOMATIC VISITOR COUNTER)
// =============================================================================
function initVisitorCounter() {
  const BASE_VISITS = 1286;
  const STORAGE_KEY = 'endy_total_visits';
  const SESSION_KEY = 'endy_session_counted';

  let currentCount = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  if (isNaN(currentCount) || currentCount < BASE_VISITS) {
    currentCount = BASE_VISITS;
  }

  // Tăng lượt truy cập khi có phiên người dùng mới
  if (!sessionStorage.getItem(SESSION_KEY)) {
    currentCount += 1;
    localStorage.setItem(STORAGE_KEY, currentCount.toString());
    sessionStorage.setItem(SESSION_KEY, 'true');
  }

  // Định dạng số hiển thị tiếng Việt (vd: 1.287)
  const formattedCount = currentCount.toLocaleString('vi-VN');

  // Cập nhật tất cả các vị trí hiển thị lượt truy cập
  document.querySelectorAll('.visitor-count-value').forEach(el => {
    el.textContent = formattedCount;
  });
}
