const openGiftBtn = document.getElementById('openGift');
const intro = document.getElementById('intro');
const letterExperience = document.getElementById('letterExperience');
const letterSlideshowEl = document.getElementById('letterSlideshow');
const finale = document.getElementById('finale');
const revealFinaleBtn = document.getElementById('revealFinale');
const typewriterEl = document.getElementById('typewriter');
const counterEl = document.getElementById('counter');
const popupDialog = document.getElementById('popupDialog');
const popupContent = document.getElementById('popupContent');
const closePopup = document.getElementById('closePopup');

const startDate = new Date('2024-01-01T00:00:00');
const transitionMs = 650;
const giftOpenMs = 650;

// Replace these with your real photos (local paths or hosted URLs)
const photoSlides = [
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'
];

const letterText =
  'My love, you make my world feel warm, soft, and full of little miracles. Every day with you feels brighter, calmer, and sweeter. Thank you for being my heart’s happiest place.';

const popups = {
  memory: {
    title: 'Memory Mini-Box 📸',
    body: `<ul>
      <li>The look you gave me that made everything else disappear.</li>
      <li>Our random conversations that somehow turned into core memories.</li>
      <li>The way we laugh until nothing stressful feels heavy anymore.</li>
    </ul>`
  },
  promises: {
    title: 'Little Love Promises 🤍',
    body: `<ol>
      <li>I’ll keep loving you in all the tiny everyday ways.</li>
      <li>I’ll keep listening, learning, and showing up for us.</li>
      <li>I’ll keep protecting our peace, joy, and silly moments.</li>
    </ol>`
  },
  future: {
    title: 'Our Soft Future 🌙',
    body: `<p>
      More hand-holding, more goofy photos, more inside jokes,
      and a forever that feels like home because it’s with you.
    </p>`
  }
};

function clamp(number, min, max) {
  return Math.min(max, Math.max(min, number));
}

function getAdaptiveHeight(frame, imgElement) {
  if (!imgElement.naturalWidth || !imgElement.naturalHeight) {
    return 280;
  }

  const ratio = imgElement.naturalWidth / imgElement.naturalHeight;
  const frameWidth = frame.clientWidth || 560;
  const maxHeight = window.innerWidth < 640 ? 360 : 430;
  const minHeight = window.innerWidth < 640 ? 180 : 220;

  return clamp(frameWidth / ratio, minHeight, maxHeight);
}

function createSlideshow(container, slides, options = {}) {
  if (!container || slides.length === 0) {
    return null;
  }

  const intervalMs = options.intervalMs || 3200;
  const showDots = options.showDots ?? true;
  let index = 0;

  const frame = document.createElement('div');
  frame.className = 'slide-frame-media';

  const img = document.createElement('img');
  img.className = 'slide-media';
  img.alt = options.alt || 'Our photo memory';
  img.loading = 'lazy';

  frame.appendChild(img);
  container.appendChild(frame);

  let dots = [];
  if (showDots) {
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'slide-dots';
    dots = slides.map(() => {
      const dot = document.createElement('span');
      dotsWrap.appendChild(dot);
      return dot;
    });
    container.appendChild(dotsWrap);
  }

  function setActiveSlide(nextIndex) {
    index = nextIndex;
    img.classList.add('is-fading');

    setTimeout(() => {
      img.src = slides[index];
    }, 120);

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
    });
  }

  img.addEventListener('load', () => {
    const targetHeight = getAdaptiveHeight(frame, img);
    frame.style.height = `${targetHeight}px`;
    img.classList.remove('is-fading');
  });

  setActiveSlide(0);

  const ticker = setInterval(() => {
    const next = (index + 1) % slides.length;
    setActiveSlide(next);
  }, intervalMs);

  return {
    refresh() {
      const targetHeight = getAdaptiveHeight(frame, img);
      frame.style.height = `${targetHeight}px`;
    },
    destroy() {
      clearInterval(ticker);
    }
  };
}

function typeLetter(text) {
  let i = 0;
  typewriterEl.textContent = '';

  const timer = setInterval(() => {
    typewriterEl.textContent += text[i];
    i += 1;

    if (i >= text.length) {
      clearInterval(timer);
    }
  }, 26);
}

function updateCounter() {
  const now = new Date();
  const diff = now - startDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  counterEl.textContent = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

function openLetterExperience() {
  openGiftBtn.classList.add('open');

  setTimeout(() => {
    intro.classList.remove('active');
    intro.setAttribute('aria-hidden', 'true');
  }, giftOpenMs);

  setTimeout(() => {
    letterExperience.classList.add('active');
    letterExperience.setAttribute('aria-hidden', 'false');

    if (!typewriterEl.textContent) {
      typeLetter(letterText);
    }
  }, giftOpenMs + transitionMs);
}

function showPopup(key) {
  const chosen = popups[key];
  if (!chosen) {
    return;
  }

  popupContent.innerHTML = `
    <div id="popupSlideshow" class="popup-slideshow" aria-label="Photo slideshow"></div>
    <h3>${chosen.title}</h3>
    ${chosen.body}
  `;

  createSlideshow(document.getElementById('popupSlideshow'), photoSlides, {
    intervalMs: 2800,
    alt: 'Photo memory for popup'
  });

  popupDialog.showModal();
}

const topSlideshow = createSlideshow(letterSlideshowEl, photoSlides, {
  intervalMs: 2600,
  alt: 'Top slideshow memory'
});

window.addEventListener('resize', () => {
  if (topSlideshow) {
    topSlideshow.refresh();
  }
});

openGiftBtn.addEventListener('click', openLetterExperience);

revealFinaleBtn.addEventListener('click', () => {
  letterExperience.classList.remove('active');
  letterExperience.setAttribute('aria-hidden', 'true');
  finale.classList.add('active');
  finale.setAttribute('aria-hidden', 'false');
});

Array.from(document.querySelectorAll('[data-popup]')).forEach((btn) => {
  btn.addEventListener('click', () => showPopup(btn.dataset.popup));
});

closePopup.addEventListener('click', () => popupDialog.close());

popupDialog.addEventListener('click', (event) => {
  const rect = popupDialog.getBoundingClientRect();
  const clickedInDialog =
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width;

  if (!clickedInDialog) {
    popupDialog.close();
  }
});

setInterval(updateCounter, 1000);
updateCounter();
