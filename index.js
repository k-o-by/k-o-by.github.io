document.addEventListener("DOMContentLoaded", () => {
  // 1. Update total image count
  const imageCountEl = document.getElementById("image-count");
  if (imageCountEl) {
    imageCountEl.textContent = document.querySelectorAll("img").length;
  }

  // 2. Disable image dragging & context menu
  document.querySelectorAll("img").forEach((el) => {
    el.setAttribute("draggable", "false");
    el.setAttribute("oncontextmenu", "return false;");
  });

  // 3. Tab switching + localStorage persistence
  const buttons = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  function openTab(targetTab) {
    const targetButton = document.querySelector(`.tab-btn[data-target="${targetTab}"]`);
    const targetContent = document.getElementById(targetTab);

    if (targetButton && targetContent) {
      buttons.forEach((btn) => btn.classList.remove("active"));
      contents.forEach((content) => content.classList.remove("active"));

      targetButton.classList.add("active");
      targetContent.classList.add("active");

      localStorage.setItem("activeTab", targetTab);
      document.documentElement.setAttribute("data-active-tab", targetTab);
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-target");
      openTab(targetTab);
    });
  });

  // Restore saved tab immediately (defaults to tab1 on first visit)
  const initialTab =
    document.documentElement.getAttribute("data-active-tab") ||
    localStorage.getItem("activeTab") ||
    "tab1";

  openTab(initialTab);

  // 4. Horizontal scroll arrows
  const nav = document.getElementById("scrollNav");
  const leftBtn = document.getElementById("scrollLeft");
  const rightBtn = document.getElementById("scrollRight");

  function updateArrows() {
    if (!nav || !leftBtn || !rightBtn) return;

    const hasOverflow = nav.scrollWidth > nav.clientWidth;

    if (!hasOverflow) {
      leftBtn.style.display = "none";
      rightBtn.style.display = "none";
      return;
    }

    leftBtn.style.display = nav.scrollLeft > 5 ? "flex" : "none";

    const maxScroll = nav.scrollWidth - nav.clientWidth;
    rightBtn.style.display = nav.scrollLeft < maxScroll - 5 ? "flex" : "none";
  }

  if (nav && leftBtn && rightBtn) {
    leftBtn.addEventListener("click", () => {
      nav.scrollBy({ left: -200, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      nav.scrollBy({ left: 200, behavior: "smooth" });
    });

    nav.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    window.addEventListener("load", updateArrows);
    updateArrows(); // Run immediately once DOM is ready
  }
});

// AUDIO
const playIconContainer = document.getElementById('play-icon');
const audioPlayerContainer = document.getElementById('audio-player-container');
const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');
const muteIconContainer = document.getElementById('mute-icon');
const audio = document.querySelector('audio');
const durationContainer = document.getElementById('duration');
const currentTimeContainer = document.getElementById('current-time');
const outputContainer = document.getElementById('volume-output');

let playState = 'play';
let muteState = 'unmute';

playIconContainer.addEventListener('click', () => {
  if (playState === 'play') {
    audio.play();
    playState = 'pause';
  } else {
    audio.pause();
    playState = 'play';
  }
});

muteIconContainer.addEventListener('click', () => {
  if (muteState === 'unmute') {
    audio.muted = true;
    muteState = 'mute';
  } else {
    audio.muted = false;
    muteState = 'unmute';
  }
});

const showRangeProgress = (rangeInput) => {
  if (rangeInput === seekSlider) {
    audioPlayerContainer.style.setProperty('--seek-before-width', `${(rangeInput.value / rangeInput.max) * 100}%`);
  } else {
    audioPlayerContainer.style.setProperty('--volume-before-width', `${(rangeInput.value / rangeInput.max) * 100}%`);
  }
};

const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

const displayDuration = () => {
  durationContainer.textContent = calculateTime(audio.duration);
};

const setSliderMax = () => {
  seekSlider.max = Math.floor(audio.duration);
};

const displayBufferedAmount = () => {
  if (audio.buffered.length > 0) {
    const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
    audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
  }
};

const whilePlaying = () => {
  seekSlider.value = Math.floor(audio.currentTime);
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  showRangeProgress(seekSlider);
};

if (audio.readyState > 0) {
  displayDuration();
  setSliderMax();
  displayBufferedAmount();
} else {
  audio.addEventListener('loadedmetadata', () => {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
  });
}

audio.addEventListener('progress', displayBufferedAmount);
audio.addEventListener('timeupdate', whilePlaying);
audio.addEventListener('ended', () => {
  playState = 'play';
});

seekSlider.addEventListener('input', (e) => {
  showRangeProgress(e.target);
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
});

seekSlider.addEventListener('change', () => {
  audio.currentTime = seekSlider.value;
});

if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    if (outputContainer) outputContainer.textContent = value;
    audio.volume = value / 100;
    showRangeProgress(e.target);
  });
}
