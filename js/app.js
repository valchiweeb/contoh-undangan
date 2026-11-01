// App State & Configuration
const CONFIG = {
  // YouTube Video ID extracted from https://music.youtube.com/watch?v=DIFlwV7WQx8
  youtubeId: 'DIFlwV7WQx8',
  songTitle: 'Lamentation - Ginger Tunes',
  targetDate: new Date('2026-11-14T09:00:00+07:00').getTime(),
  sampleWishes: [
    {
      name: 'Aditya & Rania',
      status: 'Hadir',
      message: 'Selamat berbahagia Arga & Nadia! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Lancar sampai hari H.',
      time: '2 jam lalu'
    },
    {
      name: 'Bima Satria',
      status: 'Hadir',
      message: 'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fii khoir. Turut senang melihat kebahagiaan kalian berdua.',
      time: '5 jam lalu'
    },
    {
      name: 'Citra Lestari',
      status: 'Hadir',
      message: 'Happy wedding Nadia sayang! Cantik banget undangannya, sangat elegan dan adem dilihat. See you di hari bahagia kalian!',
      time: '1 hari lalu'
    }
  ]
};

// Audio Engine State
let audioEl = null;
let ytPlayer = null;
let isAudioPlaying = false;
let isYtReady = false;
let userHasInteracted = false;

// 1. Audio Engine Initialization
function initAudioEngine() {
  audioEl = document.getElementById('wedding-audio');

  if (audioEl) {
    audioEl.volume = 0.85;

    audioEl.addEventListener('play', () => {
      setMusicUI(true);
    });

    audioEl.addEventListener('pause', () => {
      setMusicUI(false);
    });

    audioEl.addEventListener('ended', () => {
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {});
    });
  }

  // Also initialize YouTube player as secondary/backup engine
  initYouTubePlayer();

  // Attempt instant autoplay on page load (allowed by some browser configurations)
  tryAutoplayOnLoad();
}

// Attempt autoplay immediately, or listen for the first user touch/click anywhere
function tryAutoplayOnLoad() {
  const tryPlay = () => {
    playMusic().then(() => {
      removeInteractionListeners();
    }).catch(() => {
      // Browser Autoplay Policy blocked unmuted audio before user interaction.
      // We wait for the click on "Buka Undangan" or any touch on screen.
    });
  };

  function onFirstInteraction() {
    if (!userHasInteracted) {
      userHasInteracted = true;
      tryPlay();
    }
  }

  function removeInteractionListeners() {
    document.removeEventListener('click', onFirstInteraction);
    document.removeEventListener('touchstart', onFirstInteraction);
    document.removeEventListener('keydown', onFirstInteraction);
  }

  // Listen once for any interaction
  document.addEventListener('click', onFirstInteraction, { once: true });
  document.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
  document.addEventListener('keydown', onFirstInteraction, { once: true });

  // Initial attempt
  setTimeout(tryPlay, 300);
}

// Core Play Function
async function playMusic() {
  // Strategy 1: HTML5 Native Audio (Instant, reliable, works offline and on file:///)
  if (audioEl) {
    try {
      await audioEl.play();
      isAudioPlaying = true;
      setMusicUI(true);
      return Promise.resolve();
    } catch (err) {
      // HTML5 play blocked or failed, try YouTube fallback below
    }
  }

  // Strategy 2: YouTube Iframe API fallback
  if (isYtReady && ytPlayer && ytPlayer.playVideo) {
    try {
      ytPlayer.playVideo();
      isAudioPlaying = true;
      setMusicUI(true);
      return Promise.resolve();
    } catch (ytErr) {
      console.warn('YouTube fallback play notice:', ytErr);
    }
  }

  return Promise.reject(new Error('Autoplay blocked by browser policy'));
}

// Core Pause Function
function pauseMusic() {
  if (audioEl && !audioEl.paused) {
    audioEl.pause();
  }
  if (isYtReady && ytPlayer && ytPlayer.pauseVideo) {
    try {
      ytPlayer.pauseVideo();
    } catch (e) {}
  }
  isAudioPlaying = false;
  setMusicUI(false);
}

// Toggle Music handler (for Floating Vinyl button)
function toggleMusic() {
  if (isAudioPlaying) {
    pauseMusic();
    showToast('Musik dijeda');
  } else {
    playMusic().then(() => {
      showToast('♫ ' + CONFIG.songTitle);
    }).catch(() => {
      showToast('Tekan tombol untuk memutar musik');
    });
  }
}

// Update UI (Vinyl spinning & sound wave animation)
function setMusicUI(playing) {
  isAudioPlaying = playing;
  const musicDisc = document.getElementById('music-disc');
  const soundWave = document.getElementById('sound-wave');

  if (playing) {
    if (musicDisc) musicDisc.classList.remove('paused');
    if (soundWave) soundWave.classList.add('audio-playing');
  } else {
    if (musicDisc) musicDisc.classList.add('paused');
    if (soundWave) soundWave.classList.remove('audio-playing');
  }
}

// 2. YouTube Iframe API Setup (Secondary Backup)
function initYouTubePlayer() {
  if (window.YT && window.YT.Player) {
    onYouTubeIframeAPIReady();
  } else {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-player', {
    height: '100',
    width: '100',
    videoId: CONFIG.youtubeId,
    playerVars: {
      playsinline: 1,
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      rel: 0,
      loop: 1,
      playlist: CONFIG.youtubeId
    },
    events: {
      onReady: () => { isYtReady = true; },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          setMusicUI(true);
        } else if (event.data === YT.PlayerState.PAUSED) {
          if (!audioEl || audioEl.paused) setMusicUI(false);
        }
      }
    }
  });
};

// 3. Gate Opening (Buka Undangan)
function openInvitation() {
  userHasInteracted = true;
  const gate = document.getElementById('gate-screen');
  const musicToggle = document.getElementById('music-toggle');

  // Trigger Music Playback directly on click
  playMusic().catch(() => {});

  // Animate gate slide up
  if (gate) {
    gate.classList.add('unlocked');
  }

  // Restore page scroll
  document.body.style.overflow = 'auto';

  // Show floating music toggle
  if (musicToggle) {
    musicToggle.classList.remove('hidden');
    setTimeout(() => {
      musicToggle.style.opacity = '1';
    }, 350);
  }

  // Show toast informing user the song is playing
  setTimeout(() => {
    showToast('♫ Memutar: ' + CONFIG.songTitle);
  }, 800);

  // Initialize scroll observer animations
  initScrollAnimations();
}

// 4. Guest Personalization (URL Query Param: ?to=Nama+Tamu)
function parseGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guest = urlParams.get('to') || urlParams.get('u') || urlParams.get('nama');
  const guestDisplay = document.getElementById('guest-name');
  
  if (guestDisplay) {
    if (guest && guest.trim() !== '') {
      guestDisplay.textContent = decodeURIComponent(guest.replace(/\+/g, ' '));
    } else {
      guestDisplay.textContent = 'Tamu Undangan';
    }
  }
}

// 5. Countdown Timer
function startCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = CONFIG.targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// 6. RSVP & Wishes List
function initWishes() {
  const stored = localStorage.getItem('undangan_wishes');
  let wishes = stored !== null ? JSON.parse(stored) : [...CONFIG.sampleWishes];
  renderWishes(wishes);

  const form = document.getElementById('rsvp-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value.trim();
      const attendance = document.getElementById('rsvp-status').value;
      const count = document.getElementById('rsvp-count').value;
      const message = document.getElementById('rsvp-message').value.trim();

      if (!name || !message) {
        showToast('Mohon isi nama dan pesan Anda.');
        return;
      }

      const newWish = {
        name,
        status: attendance,
        count,
        message,
        time: 'Baru saja'
      };

      const currentStored = localStorage.getItem('undangan_wishes');
      let currentWishes = currentStored !== null ? JSON.parse(currentStored) : [...CONFIG.sampleWishes];
      currentWishes.unshift(newWish);
      localStorage.setItem('undangan_wishes', JSON.stringify(currentWishes));
      renderWishes(currentWishes);

      form.reset();
      showToast('Terima kasih atas doa & konfirmasinya!');
    });
  }
}

function renderWishes(wishes) {
  const container = document.getElementById('wishes-list');
  if (!container) return;

  if (wishes.length === 0) {
    container.innerHTML = `
      <div class="text-center py-6">
        <p class="text-xs text-stone-400 font-light mb-2">Belum ada ucapan.</p>
        <button 
          type="button" 
          onclick="resetToDefaultWishes()"
          class="text-[11px] text-stone-500 hover:text-stone-800 underline transition"
        >
          Muat ulang ucapan contoh
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = wishes.map((w, index) => `
    <div class="p-3.5 rounded-xl bg-white border border-stone-200/70 text-left transition hover:border-stone-300 shadow-2xs relative group">
      <div class="flex items-center justify-between mb-1.5">
        <h4 class="font-medium text-stone-800 text-xs">${escapeHTML(w.name)}</h4>
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] px-2 py-0.5 rounded-full font-medium ${
            w.status === 'Hadir' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' 
              : w.status === 'Tidak Hadir'
              ? 'bg-stone-100 text-stone-600 border border-stone-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200/80'
          }">${escapeHTML(w.status || 'Hadir')}</span>
          <button 
            type="button" 
            onclick="deleteWish(${index})"
            class="text-stone-300 hover:text-red-500 transition p-0.5 ml-1"
            title="Hapus ucapan ini"
          >
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
      <p class="text-xs text-stone-600 leading-relaxed font-light">${escapeHTML(w.message)}</p>
      <span class="block text-[10px] text-stone-400 mt-2 font-mono">${escapeHTML(w.time || 'Terkirim')}</span>
    </div>
  `).join('') + `
    <div class="text-center pt-3 flex items-center justify-center gap-4">
      <button 
        type="button" 
        onclick="clearAllWishes()" 
        class="text-[10px] text-stone-400 hover:text-red-500 transition tracking-wider uppercase font-sans hover:underline"
      >
        Hapus Semua Komentar
      </button>
      <span class="text-stone-300 text-xs">&bull;</span>
      <button 
        type="button" 
        onclick="resetToDefaultWishes()" 
        class="text-[10px] text-stone-400 hover:text-stone-700 transition tracking-wider uppercase font-sans hover:underline"
      >
        Reset ke Contoh Awal
      </button>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Global functions for deleting & managing wishes
window.deleteWish = function(index) {
  const stored = localStorage.getItem('undangan_wishes');
  let wishes = stored ? JSON.parse(stored) : [...CONFIG.sampleWishes];
  if (index >= 0 && index < wishes.length) {
    wishes.splice(index, 1);
    localStorage.setItem('undangan_wishes', JSON.stringify(wishes));
    renderWishes(wishes);
    showToast('Komentar berhasil dihapus');
  }
};

window.clearAllWishes = function() {
  if (confirm('Apakah Anda yakin ingin menghapus semua komentar/ucapan?')) {
    localStorage.setItem('undangan_wishes', JSON.stringify([]));
    renderWishes([]);
    showToast('Semua komentar telah dibersihkan');
  }
};

window.resetToDefaultWishes = function() {
  localStorage.setItem('undangan_wishes', JSON.stringify(CONFIG.sampleWishes));
  renderWishes(CONFIG.sampleWishes);
  showToast('Komentar dikembalikan ke contoh awal');
};

function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// 7. Copy to Clipboard
function copyText(text, label) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} disalin ke clipboard`);
    }).catch(() => fallbackCopy(text, label));
  } else {
    fallbackCopy(text, label);
  }
}

function fallbackCopy(text, label) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`${label} disalin ke clipboard`);
  } catch (err) {
    showToast('Gagal menyalin teks');
  }
  document.body.removeChild(textArea);
}

// 8. Toast Notification
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// 9. Scroll Reveal Animations (Clean & non-jarring)
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));
}

// 10. Calendar .ics generation
function saveToCalendar() {
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Wedding of Arga & Nadia//ID',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'DTSTART:20261114T020000Z',
    'DTEND:20261114T070000Z',
    'SUMMARY:The Wedding of Arga & Nadia',
    'DESCRIPTION:Pernikahan Arga & Nadia. Mohon kehadiran dan doa restu.',
    'LOCATION:Plataran Menteng, Jl. HOS. Cokroaminoto No.42, Gondangdia, Menteng, Jakarta Pusat',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'wedding-arga-nadia.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Jadwal disimpan ke kalender');
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden';

  parseGuestName();
  initAudioEngine();
  startCountdown();
  initWishes();

  const openBtn = document.getElementById('btn-open-invitation');
  if (openBtn) {
    openBtn.addEventListener('click', openInvitation);
  }

  const musicToggleBtn = document.getElementById('music-toggle');
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', toggleMusic);
  }
});
