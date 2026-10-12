// Interactive Controller for Romantic Proposal Website

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const bgCanvas = document.getElementById('bgCanvas');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const cardElement = document.getElementById('cardElement');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const noWrapper = document.getElementById('noWrapper');
  const dodgeToast = document.getElementById('dodgeToast');
  const proposalStage = document.getElementById('proposalStage');
  const celebrationStage = document.getElementById('celebrationStage');
  const musicBtn = document.getElementById('musicBtn');
  const editBtn = document.getElementById('editBtn');
  const replayBtn = document.getElementById('replayBtn');
  const shareBtn = document.getElementById('shareBtn');
  const confettiAgainBtn = document.getElementById('confettiAgainBtn');
  const copiedToast = document.getElementById('copiedToast');

  // Personalization Elements
  const recipientDisplay = document.getElementById('recipientDisplay');
  const letterRecipient = document.getElementById('letterRecipient');
  const letterSender = document.getElementById('letterSender');
  const certNames = document.getElementById('certNames');
  const certDate = document.getElementById('certDate');
  const proposalMessage = document.getElementById('proposalMessage');

  // Modal Elements
  const modal = document.getElementById('personalizeModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const personalizeForm = document.getElementById('personalizeForm');
  const inputRecipient = document.getElementById('inputRecipient');
  const inputSender = document.getElementById('inputSender');
  const inputMessage = document.getElementById('inputMessage');

  // Theme Dots
  const themeDots = document.querySelectorAll('.theme-dot');

  // Initialize Particles Engine
  if (window.romanticParticles) {
    window.romanticParticles.init();
  }

  // Set today's date formatted nicely on the Certificate
  const today = new Date();
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  if (certDate) {
    certDate.textContent = `Dated: ${today.toLocaleDateString(undefined, dateOptions)} & Forever 💕`;
  }

  // Pleading texts array for NO button dodges
  const pleadMessages = [
    "Are you sure? 🥺",
    "Think about it again! 💭",
    "Don't break my heart! 💔",
    "Wait, I'll buy you chocolates! 🍫",
    "Look how bright YES is! ✨",
    "Unlimited hugs & cuddles guaranteed! 🫂",
    "Pretty please with a cherry on top? 🍒",
    "You really can't say no! 😉",
    "I promise you infinite love! 💖",
    "The YES button looks so irresistible! 🥰"
  ];
  let dodgeCount = 0;
  let yesScale = 1;

  // URL Parameters & State Loading
  function loadPersonalization() {
    const urlParams = new URLSearchParams(window.location.search);
    const to = urlParams.get('to') || localStorage.getItem('proposal_to') || 'My Love';
    const from = urlParams.get('from') || localStorage.getItem('proposal_from') || 'Ishan';
    const msg = urlParams.get('msg') || localStorage.getItem('proposal_msg') || 
      'I promise to make you the happiest girl in the world, cherish every laugh, and stay by your side through everything. Will you give me a chance?';

    recipientDisplay.textContent = to;
    letterRecipient.textContent = to;
    letterSender.textContent = from;
    certNames.textContent = `${from} & ${to}`;
    proposalMessage.textContent = msg;

    inputRecipient.value = to;
    inputSender.value = from;
    inputMessage.value = msg;
  }

  loadPersonalization();

  // 3D Card Tilt Effect on Mouse Move
  if (cardElement && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      const rect = cardElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      const rotateY = deltaX * 8; // degrees
      const rotateX = -deltaY * 8;

      cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    cardElement.addEventListener('mouseleave', () => {
      cardElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // Audio Music Toggle
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (window.romanticAudio) {
        window.romanticAudio.toggleBgm((isPlaying) => {
          if (isPlaying) {
            musicBtn.classList.add('playing');
          } else {
            musicBtn.classList.remove('playing');
          }
        });
      }
    });
  }

  // Theme Switcher
  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-set-theme');
      document.body.setAttribute('data-theme', theme);
      themeDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      if (window.romanticAudio) window.romanticAudio.playChime(659.25, 0.3);
    });
  });

  // RUNAWAY "NO" BUTTON DODGE MECHANICS
  function dodgeNoButton() {
    dodgeCount++;

    // Play dodge sound
    if (window.romanticAudio) {
      window.romanticAudio.playDodge();
    }

    // Dynamic toast message
    const msg = pleadMessages[(dodgeCount - 1) % pleadMessages.length];
    dodgeToast.textContent = msg;
    dodgeToast.classList.add('visible');

    // Calculate safe boundaries relative to the actions-arena container
    const arena = document.getElementById('actionsArena');
    const arenaRect = arena.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;

    // Maximum movement area (keep button fully inside arena with padding)
    const padding = 20;
    const maxX = Math.max(0, (arenaRect.width - btnWidth) / 2 - padding);
    const maxY = Math.max(0, (arenaRect.height - btnHeight) / 2 - padding);

    // Use smoother random distribution - avoid edges
    const randX = (Math.random() - 0.5) * 2 * maxX * 0.85;
    const randY = (Math.random() - 0.5) * 2 * maxY * 0.85;

    // Ensure minimum movement so it actually dodges
    const minMove = 50;
    const finalX = Math.abs(randX) < minMove ? (randX < 0 ? -minMove : minMove) : randX;
    const finalY = Math.abs(randY) < minMove * 0.6 ? (randY < 0 ? -minMove * 0.6 : minMove * 0.6) : randY;

    // Clamp to boundaries
    const clampedX = Math.max(-maxX, Math.min(maxX, finalX));
    const clampedY = Math.max(-maxY, Math.min(maxY, finalY));

    // Smooth transition with bouncy easing
    noBtn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    noBtn.style.transform = `translate(${clampedX}px, ${clampedY}px) scale(0.95)`;

    // YES button subtly grows and becomes more attractive
    if (yesScale < 1.45) {
      yesScale += 0.06;
      yesBtn.style.transform = `scale(${yesScale})`;
    }

    // Hide toast after 2.5s
    clearTimeout(dodgeNoButton.toastTimer);
    dodgeNoButton.toastTimer = setTimeout(() => {
      dodgeToast.classList.remove('visible');
    }, 2500);
  }

  // Attach dodge triggers: mouseover, touchstart, and click
  if (noBtn) {
    noBtn.addEventListener('mouseenter', dodgeNoButton);
    noBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgeNoButton();
    }, { passive: false });
    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dodgeNoButton();
    });
  }

  // YES BUTTON CLICK (Grand Celebration)
  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      // 1. Play romantic sound fanfare
      if (window.romanticAudio) {
        window.romanticAudio.playCelebration();
        // Also start background ambient lullaby if not already playing
        if (!window.romanticAudio.isPlayingBgm) {
          window.romanticAudio.toggleBgm((isPlaying) => {
            if (isPlaying && musicBtn) musicBtn.classList.add('playing');
          });
        }
      }

      // 2. Trigger spectacular confetti, rose petals & heart burst
      const btnRect = yesBtn.getBoundingClientRect();
      const originX = btnRect.left + btnRect.width / 2;
      const originY = btnRect.top + btnRect.height / 2;
      if (window.romanticParticles) {
        window.romanticParticles.triggerCelebration(originX, originY);
      }

      // 3. Smooth transition to celebration stage
      proposalStage.style.opacity = '0';
      proposalStage.style.transform = 'scale(0.95)';
      proposalStage.style.transition = 'all 0.5s ease';

      setTimeout(() => {
        proposalStage.style.display = 'none';
        celebrationStage.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 450);
    });

    yesBtn.addEventListener('mouseenter', () => {
      if (window.romanticAudio) window.romanticAudio.playChime(783.99, 0.4);
    });
  }

  // CELEBRATION TABS
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetContent = document.getElementById(`tab-${targetTab}`);
      if (targetContent) targetContent.classList.add('active');

      if (window.romanticAudio) window.romanticAudio.playChime(659.25, 0.25);
    });
  });

  // CONFETTI AGAIN BUTTON
  if (confettiAgainBtn) {
    confettiAgainBtn.addEventListener('click', () => {
      if (window.romanticParticles) {
        window.romanticParticles.triggerCelebration(window.innerWidth / 2, window.innerHeight * 0.4);
      }
      if (window.romanticAudio) {
        window.romanticAudio.playCelebration();
      }
    });
  }

  // REPLAY PROPOSAL BUTTON
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      celebrationStage.style.display = 'none';
      proposalStage.style.display = 'block';
      proposalStage.style.opacity = '1';
      proposalStage.style.transform = 'scale(1)';

      // Reset NO button position and YES button scale
      noBtn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      noBtn.style.transform = 'translate(0px, 0px) scale(1)';
      yesScale = 1;
      yesBtn.style.transform = 'scale(1)';
      dodgeToast.classList.remove('visible');
      dodgeCount = 0;

      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.romanticAudio) window.romanticAudio.playChime(523.25, 0.4);
    });
  }

  // SHARE LINK BUTTON
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        showToast("Personalized proposal link copied! 💖 Share it with your special someone.");
      }).catch(() => {
        showToast("Link: " + url);
      });
    });
  }

  // PERSONALIZATION MODAL
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      modal.classList.add('open');
      if (window.romanticAudio) window.romanticAudio.playChime(587.33, 0.3);
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  personalizeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const to = inputRecipient.value.trim() || 'My Love';
    const from = inputSender.value.trim() || 'Ishan';
    const msg = inputMessage.value.trim() || 'I promise to make you the happiest girl in the world, cherish every laugh, and stay by your side through everything. Will you give me a chance?';

    localStorage.setItem('proposal_to', to);
    localStorage.setItem('proposal_from', from);
    localStorage.setItem('proposal_msg', msg);

    recipientDisplay.textContent = to;
    letterRecipient.textContent = to;
    letterSender.textContent = from;
    certNames.textContent = `${from} & ${to}`;
    proposalMessage.textContent = msg;

    // Update query params in URL without reloading
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('to', to);
    newUrl.searchParams.set('from', from);
    newUrl.searchParams.set('msg', msg);
    window.history.replaceState({}, '', newUrl);

    modal.classList.remove('open');

    // Copy to clipboard
    navigator.clipboard.writeText(newUrl.toString()).then(() => {
      showToast("Updated & personalized link copied to clipboard! ✨");
    }).catch(() => {
      showToast("Proposal updated with your custom details! 💕");
    });
  });

  function showToast(text) {
    copiedToast.textContent = text;
    copiedToast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      copiedToast.classList.remove('show');
    }, 3200);
  }
});

// Redeem Love Coupon function (called inline or via listener)
function redeemCoupon(el) {
  if (el.classList.contains('redeemed')) return;
  el.classList.add('redeemed');
  const status = el.querySelector('.coupon-status');
  if (status) {
    status.innerHTML = "✅ Redeemed with Love! ❤️";
  }
  if (window.romanticAudio) {
    window.romanticAudio.playChime(880, 0.35);
  }
}
