/* ==========================================================================
   PERSONAL DASHBOARD - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const userNameEl = document.getElementById('userName');
  const userTaglineEl = document.getElementById('userTagline');
  const editNameBtn = document.getElementById('editNameBtn');

  const clockHoursEl = document.getElementById('clockHours');
  const clockMinutesEl = document.getElementById('clockMinutes');
  const clockSecondsEl = document.getElementById('clockSeconds');
  const clockPeriodEl = document.getElementById('clockPeriod');
  const fullDateEl = document.getElementById('fullDate');
  const timeZoneOffsetEl = document.getElementById('timeZoneOffset');
  const formatToggleBtn = document.getElementById('formatToggleBtn');
  const formatLabel = document.getElementById('formatLabel');

  const greetingBadge = document.getElementById('greetingBadge');
  const greetingIcon = document.getElementById('greetingIcon');
  const greetingText = document.getElementById('greetingText');

  const themeBtns = document.querySelectorAll('.theme-btn');

  // Focus Widget Elements
  const focusInput = document.getElementById('focusInput');
  const addFocusBtn = document.getElementById('addFocusBtn');
  const focusList = document.getElementById('focusList');
  const focusCount = document.getElementById('focusCount');

  // Quote Widget Elements
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const refreshQuoteBtn = document.getElementById('refreshQuoteBtn');
  const copyQuoteBtn = document.getElementById('copyQuoteBtn');

  // World Clock Elements
  const timeNY = document.getElementById('timeNY');
  const timeLondon = document.getElementById('timeLondon');
  const timeTokyo = document.getElementById('timeTokyo');

  // --- State Variables ---
  let is24HourFormat = localStorage.getItem('is_24_hour') === 'true';
  let focusTasks = JSON.parse(localStorage.getItem('focus_tasks') || '[]');

  // Curated Quotes
  const quotes = [
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { text: "Optimism is an essential ingredient for innovation.", author: "Robert Iger" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Knowledge is power, but enthusiasm pulls the switch.", author: "Ivern Ball" }
  ];

  // --- 1. User Profile Persistence & Edit ---
  let savedName = localStorage.getItem('user_name');
  if (!savedName || savedName === 'Alex Developer' || savedName === 'user') {
    savedName = '周聖儒';
    localStorage.setItem('user_name', '周聖儒');
  }
  const savedTagline = localStorage.getItem('user_tagline');
  userNameEl.textContent = savedName;
  if (savedTagline) userTaglineEl.textContent = savedTagline;

  function saveProfile() {
    localStorage.setItem('user_name', userNameEl.textContent.trim() || 'Alex Developer');
    localStorage.setItem('user_tagline', userTaglineEl.textContent.trim() || 'Welcome to your personal command center');
  }

  editNameBtn.addEventListener('click', () => {
    userNameEl.focus();
    // Select all text in element
    const range = document.createRange();
    range.selectNodeContents(userNameEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });

  [userNameEl, userTaglineEl].forEach(el => {
    el.addEventListener('blur', saveProfile);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        el.blur();
      }
    });
  });

  // --- 2. Live Clock & Date Update ---
  function updateClock() {
    const now = new Date();

    // Hours, Minutes, Seconds
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    let period = '';

    if (!is24HourFormat) {
      period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
    }
    const formattedHours = String(hours).padStart(2, '0');

    clockHoursEl.textContent = formattedHours;
    clockMinutesEl.textContent = minutes;
    clockSecondsEl.textContent = seconds;

    if (is24HourFormat) {
      clockPeriodEl.style.display = 'none';
    } else {
      clockPeriodEl.style.display = 'inline-block';
      clockPeriodEl.textContent = period;
    }

    // Date display
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    fullDateEl.textContent = now.toLocaleDateString('en-US', options);

    // Timezone Offset Calculation
    const offsetMinutes = -now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const remMinutes = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const formattedOffset = `UTC${sign}${String(offsetHours).padStart(2, '0')}:${String(remMinutes).padStart(2, '0')}`;
    timeZoneOffsetEl.textContent = formattedOffset;

    // Greeting Update
    updateGreeting(now.getHours());

    // Update World Clocks
    updateWorldClocks(now);
  }

  function updateGreeting(hour) {
    if (hour >= 5 && hour < 12) {
      greetingIcon.textContent = '🌅';
      greetingText.textContent = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      greetingIcon.textContent = '☀️';
      greetingText.textContent = 'Good Afternoon';
    } else if (hour >= 17 && hour < 22) {
      greetingIcon.textContent = '🌆';
      greetingText.textContent = 'Good Evening';
    } else {
      greetingIcon.textContent = '🌙';
      greetingText.textContent = 'Good Night';
    }
  }

  // 12h / 24h Toggle Button
  function updateFormatLabel() {
    formatLabel.textContent = is24HourFormat ? '24H' : '12H';
  }
  updateFormatLabel();

  formatToggleBtn.addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    localStorage.setItem('is_24_hour', is24HourFormat);
    updateFormatLabel();
    updateClock();
  });

  // --- 3. World Clocks ---
  function updateWorldClocks(now) {
    const timeOptions = { hour12: !is24HourFormat, hour: '2-digit', minute: '2-digit' };
    timeNY.textContent = now.toLocaleTimeString('en-US', { ...timeOptions, timeZone: 'America/New_York' });
    timeLondon.textContent = now.toLocaleTimeString('en-GB', { ...timeOptions, timeZone: 'Europe/London' });
    timeTokyo.textContent = now.toLocaleTimeString('ja-JP', { ...timeOptions, timeZone: 'Asia/Tokyo' });
  }

  // --- 4. Theme Switcher ---
  const savedTheme = localStorage.getItem('app_theme') || 'aurora';
  setTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      setTheme(theme);
    });
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);

    themeBtns.forEach(btn => {
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- 5. Today's Focus Checklist ---
  function renderFocusList() {
    focusList.innerHTML = '';
    let completedNum = 0;

    focusTasks.forEach((task, index) => {
      if (task.completed) completedNum++;

      const li = document.createElement('li');
      li.className = `focus-item ${task.completed ? 'completed' : ''}`;

      li.innerHTML = `
        <div style="display:flex; align-items:center;">
          <input type="checkbox" class="focus-item-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
          <span>${escapeHtml(task.text)}</span>
        </div>
        <button class="delete-task-btn" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
      `;

      focusList.appendChild(li);
    });

    focusCount.textContent = `${completedNum}/${focusTasks.length} Done`;
    localStorage.setItem('focus_tasks', JSON.stringify(focusTasks));
  }

  function addFocusTask() {
    const text = focusInput.value.trim();
    if (!text) return;
    focusTasks.push({ text, completed: false });
    focusInput.value = '';
    renderFocusList();
  }

  addFocusBtn.addEventListener('click', addFocusTask);
  focusInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addFocusTask();
  });

  focusList.addEventListener('click', (e) => {
    const target = e.target.closest('.focus-item-checkbox') || e.target.closest('.delete-task-btn');
    if (!target) return;

    const index = parseInt(target.getAttribute('data-index'), 10);
    if (target.classList.contains('focus-item-checkbox')) {
      focusTasks[index].completed = target.checked;
    } else if (target.classList.contains('delete-task-btn')) {
      focusTasks.splice(index, 1);
    }
    renderFocusList();
  });

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  renderFocusList();

  // --- 6. Quote Generator ---
  function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const q = quotes[randomIndex];
    quoteText.textContent = `"${q.text}"`;
    quoteAuthor.textContent = `— ${q.author}`;
  }

  refreshQuoteBtn.addEventListener('click', getRandomQuote);

  copyQuoteBtn.addEventListener('click', () => {
    const textToCopy = `${quoteText.textContent} ${quoteAuthor.textContent}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalText = copyQuoteBtn.innerHTML;
      copyQuoteBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      setTimeout(() => {
        copyQuoteBtn.innerHTML = originalText;
      }, 2000);
    });
  });

  // --- Initialize Loop ---
  updateClock();
  setInterval(updateClock, 1000);
});
