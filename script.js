document.addEventListener('DOMContentLoaded', () => {
  // --- DOM References ---
  const liveDateStr = document.getElementById('liveDateStr');
  const liveClock = document.getElementById('liveClock');
  const selectedDateBadge = document.getElementById('selectedDateBadge');
  const dynamicGreeting = document.getElementById('dynamicGreeting');
  const timeSubMessage = document.getElementById('timeSubMessage');
  const dynamicStatusText = document.getElementById('dynamicStatusText');
  const speechBubbleText = document.getElementById('speechBubbleText');
  const mainCharacterImg = document.getElementById('mainCharacterImg');
  
  const dailyLoveNoteText = document.getElementById('dailyLoveNoteText');
  const dailyLetterPreview = document.getElementById('dailyLetterPreview');
  
  const calendarToggleBtn = document.getElementById('calendarToggleBtn');
  const calendarDropdown = document.getElementById('calendarDropdown');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const calMonthYearTitle = document.getElementById('calMonthYearTitle');
  const calDaysGrid = document.getElementById('calDaysGrid');
  const calTodayBtn = document.getElementById('calTodayBtn');
  
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const bgAudio = document.getElementById('bgAudio');
  const audioIcon = document.getElementById('audioIcon');
  const audioLabel = document.getElementById('audioLabel');

  const openLetterBtn = document.getElementById('openLetterBtn');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const letterModal = document.getElementById('letterModal');
  const modalLetterTitle = document.getElementById('modalLetterTitle');
  const modalLetterDate = document.getElementById('modalLetterDate');
  const modalLetterBody = document.getElementById('modalLetterBody');
  const toastContainer = document.getElementById('toastContainer');
  const bloomingBgHeart = document.getElementById('bloomingBgHeart');

  // --- App State (Real Date vs Temporarily Displayed Date) ---
  const realToday = new Date();
  let displayedDate = new Date(realToday.getFullYear(), realToday.getMonth(), realToday.getDate());
  let calViewMonth = realToday.getMonth();
  let calViewYear = realToday.getFullYear();

  // --- Interactive Character Tap Cycle State for Morning/Hydration/Special Day Flip ---
  const characterCycleImages = ['images/night.png', 'images/morning.png', 'images/us.png'];
  let currentCycleIndex = 0;
  let isInteractiveCycleMode = false;
  let isSpecialDayFlipMode = false;
  let morningLoopInterval = null; // 2-second auto timer for 7am-8:30am loop

  // --- Temporary Override State for Feeling Buttons (15-second timer) ---
  let feelingOverrideTimeout = null;
  let sadToggleState = false; // false -> hug.png, true -> morning.png
  let surpriseCycleIndex = 0; // 0: kitkat, 1: play, 2: pizza, 3: love
  const surpriseImages = ['images/kitkat.png', 'images/play.png', 'images/pizza.png', 'images/love.png'];

  // Helper to sync speech bubble based on current character image
  function updateSpeechBubbleForImage(imageSrc) {
    if (imageSrc.includes('first.png')) {
      speechBubbleText.textContent = "Remember our first photo together hubbu..? 💖";
    } else {
      speechBubbleText.textContent = "No matter what, I'm always here for you puppu.💖";
    }
  }

  mainCharacterImg.style.cursor = 'pointer';
  mainCharacterImg.addEventListener('click', () => {
    if (feelingOverrideTimeout) return;

    if (isSpecialDayFlipMode) {
      const dDay = displayedDate.getDate();
      const dMonth = displayedDate.getMonth() + 1;
      const primarySpecialImg = (dDay === 30 && dMonth === 3) ? 'images/birthday.png' : 'images/anniversary.png';
      
      if (mainCharacterImg.src.includes(primarySpecialImg) || mainCharacterImg.src.includes('birthday.png') || mainCharacterImg.src.includes('anniversary.png')) {
        mainCharacterImg.src = 'images/first.png';
        updateSpeechBubbleForImage('images/first.png');
        showToast("💖 Our first photo together!");
      } else {
        mainCharacterImg.src = primarySpecialImg;
        updateSpeechBubbleForImage(primarySpecialImg);
      }
    } else if (isInteractiveCycleMode) {
      currentCycleIndex = (currentCycleIndex + 1) % characterCycleImages.length;
      mainCharacterImg.src = characterCycleImages[currentCycleIndex];
      updateSpeechBubbleForImage(characterCycleImages[currentCycleIndex]);
      showToast("💖 Tap again to see next!");
    }
  });

  // --- Background Music Handling ---
  let isPlaying = false;
  
  musicToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      bgAudio.pause();
      audioIcon.textContent = '🎵';
      audioLabel.textContent = 'Play Music';
    } else {
      bgAudio.play().catch(() => {});
      audioIcon.textContent = '⏸';
      audioLabel.textContent = 'Pause Music';
    }
    isPlaying = !isPlaying;
  });

  // --- Blooming Background Heart Touch/Click Interactive Reaction ---
  bloomingBgHeart.addEventListener('click', () => {
    showToast("💖 My heart blooms only for you, hububu!");
    bloomingBgHeart.style.transform = 'translate(-50%, -50%) scale(1.18)';
    setTimeout(() => {
      bloomingBgHeart.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 400);
  });

  // --- Floating Background Hearts Generation ---
  function initFloatingHearts() {
    const container = document.getElementById('floatingHeartsContainer');
    const heartSymbols = ['💖', '💗', '💕', '🌸', '✨'];
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDuration = `${6 + Math.random() * 8}s`;
      heart.style.animationDelay = `${Math.random() * 5}s`;
      heart.style.fontSize = `${0.8 + Math.random() * 0.8}rem`;
      
      heart.addEventListener('click', () => {
        showToast("💖 I love you so much!");
        heart.style.transform = 'scale(1.6) rotate(15deg)';
        setTimeout(() => {
          heart.style.transform = 'scale(1) rotate(0deg)';
        }, 350);
      });

      container.appendChild(heart);
    }
  }

  // --- Interactive Heart Touch / Click Glow Handler ---
  function initInteractiveHearts() {
    const allHearts = document.querySelectorAll('.heart-icon, .status-heart, .card-icon, .sd-icon');
    allHearts.forEach(heart => {
      ['click', 'touchstart'].forEach(eventType => {
        heart.addEventListener(eventType, (e) => {
          e.preventDefault();
          heart.classList.add('touch-glow');
          setTimeout(() => {
            heart.classList.remove('touch-glow');
          }, 600);
        });
      });
    });
  }

  // --- Helper to apply temporary 15-second image override ---
  function triggerTemporaryImage(imagePath, speechText) {
    if (feelingOverrideTimeout) {
      clearTimeout(feelingOverrideTimeout);
    }
    mainCharacterImg.src = imagePath;
    speechBubbleText.textContent = speechText;

    feelingOverrideTimeout = setTimeout(() => {
      feelingOverrideTimeout = null;
      updateClockAndGreeting(); // Revert back to normal timing routine image & speech
    }, 15000);
  }

  // --- Real-Time Clock & Precise Time-based Routine Messages & Image Assignment ---
  function updateClockAndGreeting() {
    if (feelingOverrideTimeout) return;

    const now = new Date();
    
    const optionsDate = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    liveDateStr.textContent = now.toLocaleDateString('en-GB', optionsDate);
    
    liveClock.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    let greeting = "";
    let subtext = "";
    let statusText = "";
    let targetImage = "images/main-character.png";
    let enableCycle = false;
    let specialFlip = false;
    let isMorningLoopActive = false;

    const inRange = (startH, startM, endH, endM) => {
      const start = startH * 60 + startM;
      const end = endH * 60 + endM;
      return totalMinutes >= start && totalMinutes <= end;
    };

    const dDay = displayedDate.getDate();
    const dMonth = displayedDate.getMonth() + 1;

    let normalGreeting = "";
    let normalSubtext = "";
    let normalStatus = "";

    if (inRange(22, 45, 23, 59) || inRange(0, 0, 6, 30)) {
      normalGreeting = `Goodie Nightieee, My Hubbuuu 🌙`;
      normalSubtext = `Goodie goodie nightiee my muduuu, ivttu yardu turn..? baa malko illi, I love you my hubbuuu`;
      normalStatus = `Time to wind down and rest your sweet head. 💤`;
      targetImage = "images/night.png";
    } else if (inRange(6, 31, 6, 59)) {
      normalGreeting = `Goodie goodie morning my Muddu 💕`;
      normalSubtext = `Edyaa janaa hogi neeru kudi kandha i love you my babie`;
      normalStatus = `Good morning sunshine! Tap my picture to flip cards. ☀️`;
      enableCycle = true;
    } else if (inRange(7, 0, 8, 30)) {
      normalGreeting = `Goodie morning, My Muddu 💕`;
      normalSubtext = `Rise and shine, my love! Enjoy this sweet morning loop.`;
      normalStatus = `Tap my picture or wait to watch the card loop! ☀️`;
      isMorningLoopActive = true;
    } else if (inRange(8, 31, 11, 0)) {
      normalGreeting = `Goodie morning, Breakfast Time! 🍳`;
      normalSubtext = `Eat your breakfast well, my muddu kandha!`;
      normalStatus = `Start your morning with delicious food and energy! 🥞`;
      targetImage = "images/food.png";
    } else if (inRange(13, 0, 15, 0)) {
      // 1:00 PM to 3:00 PM Lunch Time window
      normalGreeting = `Lunch Time, My Muddu 🍛`;
      normalSubtext = `Have a wonderful lunch and eat completely!`;
      normalStatus = `Take a nice lunch break and refuel yourself. 🍲`;
      targetImage = "images/food.png";
    } else if (inRange(11, 1, 12, 59) || inRange(15, 1, 16, 45)) {
      normalGreeting = `Stay Hydrated, My Hububu 💧`;
      normalSubtext = `Drink plenty of water right now, kandha!`;
      normalStatus = `Sip water and keep yourself fresh and hydrated! ✨`;
      targetImage = "images/us.png";
    } else if (inRange(16, 46, 19, 0)) {
      normalGreeting = `Time to have some fun snacks kandha... 💕`;
      normalSubtext = `Take a break and relax a bit!`;
      normalStatus = `Enjoy some evening snacks and relax. ☕`;
      targetImage = "images/food.png";
    } else if (inRange(19, 1, 20, 30)) {
      normalGreeting = `Evening Hydration, My Muddu 💧`;
      normalSubtext = `Drink some water and stay fresh!`;
      normalStatus = `Keep sipping water into the evening. ✨`;
      targetImage = "images/us.png";
    } else if (inRange(20, 31, 22, 44)) {
      normalGreeting = `Dinner Time, My Hubbu 🍽️`;
      normalSubtext = `Eat your dinner peacefully and take care!`;
      normalStatus = `Enjoy your dinner time, my love! ❤️`;
      targetImage = "images/food.png";
    } else {
      normalGreeting = `Goodie morning, Mudduu 💕`;
      normalSubtext = `I hope your day is as amazing as your smile. ✨`;
      normalStatus = `It's a beautiful day! Wishing you happiness Kandhaa.☀️`;
      enableCycle = true;
    }

    if (dDay === 30 && dMonth === 3) {
      targetImage = "images/birthday.png";
      specialFlip = true;
      greeting = `<span style="font-size: 1.1rem; display: block; margin-bottom: 6px; color: var(--accent-pink);">Happie happie birthday my muduuuuuu, I love u a lott & a lot, im so lucky to have you and be with you on your birthday here 🎉</span>${normalGreeting}`;
      subtext = normalSubtext;
      statusText = normalStatus;
    } else if (dDay === 29 && dMonth === 5) {
      targetImage = "images/anniversary.png";
      specialFlip = true;
      greeting = `<span style="font-size: 1.1rem; display: block; margin-bottom: 6px; color: var(--accent-pink);">Happie happie anniversary, i can't wait to spend more and more years loving you and being with u yaan ninna mast preethi malthondulle yenna mokeda kandane muwahhhh 💕</span>${normalGreeting}`;
      subtext = normalSubtext;
      statusText = normalStatus;
    } else {
      greeting = normalGreeting.replace(/, /, ', <br><span class="highlight-pink">') + '</span>';
      subtext = normalSubtext;
      statusText = normalStatus;
    }

    dynamicGreeting.innerHTML = greeting;
    timeSubMessage.textContent = subtext;
    dynamicStatusText.textContent = statusText;

    isInteractiveCycleMode = enableCycle || isMorningLoopActive;
    isSpecialDayFlipMode = specialFlip;

    // Handle 2-second auto timer loop for 7am-8:30am window
    if (isMorningLoopActive) {
      if (!morningLoopInterval) {
        morningLoopInterval = setInterval(() => {
          currentCycleIndex = (currentCycleIndex + 1) % characterCycleImages.length;
          mainCharacterImg.src = characterCycleImages[currentCycleIndex];
          updateSpeechBubbleForImage(characterCycleImages[currentCycleIndex]);
        }, 2000);
      }
    } else {
      if (morningLoopInterval) {
        clearInterval(morningLoopInterval);
        morningLoopInterval = null;
      }
    }

    if (!feelingOverrideTimeout) {
      if (!isMorningLoopActive && !enableCycle && !specialFlip) {
        mainCharacterImg.src = targetImage;
        updateSpeechBubbleForImage(targetImage);
      } else if (specialFlip) {
        if (!mainCharacterImg.src.includes('birthday.png') && !mainCharacterImg.src.includes('anniversary.png') && !mainCharacterImg.src.includes('first.png')) {
          mainCharacterImg.src = targetImage;
        }
        updateSpeechBubbleForImage(mainCharacterImg.src);
      } else if (!isMorningLoopActive) {
        if (!mainCharacterImg.src.includes('night.png') && !mainCharacterImg.src.includes('morning.png') && !mainCharacterImg.src.includes('us.png')) {
          mainCharacterImg.src = characterCycleImages[currentCycleIndex];
        }
        updateSpeechBubbleForImage(mainCharacterImg.src);
      } else {
        if (morningLoopInterval && !mainCharacterImg.src.includes('night.png') && !mainCharacterImg.src.includes('morning.png') && !mainCharacterImg.src.includes('us.png')) {
          mainCharacterImg.src = characterCycleImages[currentCycleIndex];
        }
      }
    }
  }

  // --- Dynamic Content Engine (2026-2040 support) ---
  function getDailyContent(targetDate) {
    const day = targetDate.getDate();
    const month = targetDate.getMonth() + 1;
    const year = targetDate.getFullYear();

    if (day === 30 && month === 3) {
      return {
        type: 'birthday',
        note: `Happy Birthday my mudduu Kandhaaa❤️🎂 Today is all about celebrating the most wonderful human in my world!`,
        letterPreview: `Happy Birthday my dearest muddu! I thank my stars every day that you were born...`,
        letterFull: `My love\n\nHappy Birthday my mudduu marii! 🎂❤️️\n\nToday is the most special day of the year because it's the day you entered this world. I am so grateful to be by your side celebrating another year of your beautiful life.\n\nYou bring so much laughter, warmth, and peace into my life. I hope all your dreams come true this year, and I promise to support you and stand by you through every single step.\n\nAlways yours,\nYour Wifey 💖`,
        status: `Happy Birthday my mudduu kandhaaa! 🎂 Special Audio active!`
      };
    }

    if (day === 29 && month === 5) {
      const annivYear = year - 2025;
      const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };
      const yearStr = getOrdinal(annivYear > 0 ? annivYear : 1);

      return {
        type: 'anniversary',
        note: `Happie ${yearStr} Anniversary hubububu❤️ Looking back at our journey makes my heart swell with love!`,
        letterPreview: `Happie ${yearStr} Anniversary my love! Every moment with you feels like a dream...`,
        letterFull: `My sweet kandha,\n\nHappie ${yearStr} Anniversary my muddu kandha! ❤️\n\nIt feels like yesterday when our journey began, and yet I cannot imagine my life without you. Thank you for every hug, every smile, and every sweet moment we've shared.\n\nHere is to forever and ever together.\n\nForever yours,\nYour Wifey 💕`,
        status: `Happie ${yearStr} Anniversary my Hubbu! ❤️`
      };
    }

    const notePool = [
      `Janaaa Marii, my most peaceful place is the space you make for me.`,
      `muduuu, even my grocery lists have secret little 'I miss you' notes now.`,
      `mushi motoo, you are the poem I never planned to write but couldn't stop.`,
      `Cutie, don't forget how loved you are today. Come back to this letter when you do.`,
      `I picked you today. Same as yesterday. Same as tomorrow.`,
      `My star-boy, one more day of loving you completely.`,
      `Your smile is literally my favorite notification in the entire world.`,
      `Just a gentle reminder: you are doing amazing and I am super proud of you.`
    ];

    const letterPool = [
      `My dearest love,\n\nI was just sitting here thinking about how effortlessly you make my world brighter. Even on ordinary days, just knowing you exist makes everything feel lighter.\n\nTake care of yourself today, eat well, and remember that I'm cheering for you always.\n\nLove, Your Wifey ❤`,
      `My sweet Nishu,\n\nEvery day with you feels like a soft blessing. I love the little things—the way you listen, your warmth, and how you make me feel safe.\n\nNo matter how busy today gets, know my heart is right there with you.\n\nAlways & Forever 💕`,
      `My muddu mari,\n\nI just wanted to drop a little note to remind you that you are my favorite person. Thank you for being my strength, my laughter, and my safest home.\n\nCan't wait until I get to hug you next!\n\nAll my love 💋`
    ];

    const seed = (year * 365) + (month * 31) + day;
    const selectedNote = notePool[seed % notePool.length];
    const selectedLetter = letterPool[seed % letterPool.length];

    return {
      type: 'normal',
      note: selectedNote,
      letterPreview: selectedLetter.slice(0, 75) + "...",
      letterFull: selectedLetter,
      status: `One day more of loving you completely. ☀️`
    };
  }

  // --- Render Selected Content to View ---
  function updateDisplayedContent(targetDate) {
    const formattedBadge = `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}/${targetDate.getFullYear()}`;
    selectedDateBadge.textContent = formattedBadge;

    const content = getDailyContent(targetDate);

    dailyLoveNoteText.textContent = `"${content.note}"`;
    dailyLetterPreview.textContent = content.letterPreview;

    const dDay = targetDate.getDate();
    const dMonth = targetDate.getMonth() + 1;

    if (dDay === 30 && dMonth === 3) {
      bgAudio.src = 'audio/birthday.mp3';
      mainCharacterImg.src = 'images/birthday.png';
      updateSpeechBubbleForImage('images/birthday.png');
    } else if (dDay === 29 && dMonth === 5) {
      bgAudio.src = 'audio/anniversary.mp3';
      mainCharacterImg.src = 'images/anniversary.png';
      updateSpeechBubbleForImage('images/anniversary.png');
    } else {
      bgAudio.src = 'audio/background.mp3';
      updateClockAndGreeting();
    }

    if (isPlaying) {
      bgAudio.play().catch(() => {});
    }

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    modalLetterDate.textContent = targetDate.toLocaleDateString('en-GB', options);
    modalLetterBody.textContent = content.letterFull;
  }

  // --- Calendar Renderer ---
  function renderCalendar(month, year) {
    calDaysGrid.innerHTML = '';
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    calMonthYearTitle.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startOffset; i++) {
      const emptyCell = document.createElement('div');
      calDaysGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell';
      cell.textContent = day;

      const isRealToday = (day === realToday.getDate() && month === realToday.getMonth() && year === realToday.getFullYear());
      const isTempSelected = (day === displayedDate.getDate() && month === displayedDate.getMonth() && year === displayedDate.getFullYear());

      if (isRealToday) cell.classList.add('active-real-today');
      if (isTempSelected) cell.classList.add('selected-temp');

      cell.addEventListener('click', () => {
        displayedDate = new Date(year, month, day);
        updateDisplayedContent(displayedDate);
        renderCalendar(calViewMonth, calViewYear);
        calendarDropdown.classList.add('hidden');
      });

      calDaysGrid.appendChild(cell);
    }
  }

  // --- Calendar Event Listeners ---
  calendarToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!calendarDropdown.contains(e.target) && !calendarToggleBtn.contains(e.target)) {
      calendarDropdown.classList.add('hidden');
    }
  });

  prevMonthBtn.addEventListener('click', () => {
    calViewMonth--;
    if (calViewMonth < 0) {
      calViewMonth = 11;
      calViewYear--;
    }
    renderCalendar(calViewMonth, calViewYear);
  });

  nextMonthBtn.addEventListener('click', () => {
    if (calViewYear >= 2040 && calViewMonth >= 11) return;
    calViewMonth++;
    if (calViewMonth > 11) {
      calViewMonth = 0;
      calViewYear++;
    }
    renderCalendar(calViewMonth, calViewYear);
  });

  calTodayBtn.addEventListener('click', () => {
    displayedDate = new Date(realToday.getFullYear(), realToday.getMonth(), realToday.getDate());
    calViewMonth = realToday.getMonth();
    calViewYear = realToday.getFullYear();
    updateDisplayedContent(displayedDate);
    renderCalendar(calViewMonth, calViewYear);
    calendarDropdown.classList.add('hidden');
  });

  // --- Interactive Feelings Popup & Specific Image Override Mappings (15s timer) ---
  const feelingActions = {
    sad: () => {
      if (!sadToggleState) {
        triggerTemporaryImage('images/hug.png', "Don't be sad my muddu! Here's a big hug 🤗");
        showToast("🤗 Sending you a warm hug!");
      } else {
        triggerTemporaryImage('images/morning.png', "Cheer up my sunshine! ☀️");
        showToast("☀️ Smile for me!");
      }
      sadToggleState = !sadToggleState;
    },
    miss: () => {
      triggerTemporaryImage('images/us.png', "I miss you so much more, my muddu! 🥺❤️");
      showToast("🥺 I miss you!");
    },
    happy: () => {
      triggerTemporaryImage('images/morning.png', "Your happiness makes me happy toooo 🥰");
      showToast("🥰 Yay! Love seeing you smile!");
    },
    hug: () => {
      triggerTemporaryImage('images/hug.png', "Biggggg virtual hug coming your way my hubbu 🤗❤️");
      showToast("🤗 Virtual Hug!");
    },
    kiss: () => {
      triggerTemporaryImage('images/kiss.png', "Mwaaaaaah 💋❤️ One thousand kisses!");
      showToast("💋 Kiss Attack!");
    },
    surprise: () => {
      const currentImage = surpriseImages[surpriseCycleIndex];
      const surpriseSpeeches = [
        "Surprise! A sweet KitKat treat for you! 🍫",
        "Let's play together, my love! 🎮",
        "Your favorite pizza time! 🍕",
        "Endless love wrapped just for you! 💕"
      ];
      triggerTemporaryImage(currentImage, surpriseSpeeches[surpriseCycleIndex]);
      showToast(`🎁 Surprise card unlocked!`);
      
      surpriseCycleIndex = (surpriseCycleIndex + 1) % surpriseImages.length;
    }
  };

  document.querySelectorAll('.feeling-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (feelingActions[action]) {
        feelingActions[action]();
      }
    });
  });

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = msg;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3200);
  }

  // --- Read Letter Modal Handlers ---
  openLetterBtn.addEventListener('click', () => {
    letterModal.classList.remove('hidden');
  });

  closeLetterBtn.addEventListener('click', () => {
    letterModal.classList.add('hidden');
  });

  letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) {
      letterModal.classList.add('hidden');
    }
  });

  // --- Initialize Web App ---
  initFloatingHearts();
  initInteractiveHearts();
  updateClockAndGreeting();
  setInterval(updateClockAndGreeting, 1000);
  updateDisplayedContent(realToday);
  renderCalendar(calViewMonth, calViewYear);
});