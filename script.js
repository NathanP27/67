const requiredTaps = 7;
let tapCount = 0;

const body = document.body;
const intro = document.getElementById('intro');
const mineCard = document.getElementById('mineCard');
const progressText = document.getElementById('progressText');
const firstLetterSection = document.getElementById('letterOne');
const topSlideshow = document.getElementById('topSlideshow');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const slides = [
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80'
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function adaptiveHeight(frame, image) {
  if (!image.naturalWidth || !image.naturalHeight) {
    return 280;
  }

  const ratio = image.naturalWidth / image.naturalHeight;
  const width = frame.clientWidth || 640;
  const maxHeight = window.innerWidth < 640 ? 380 : 480;
  const minHeight = window.innerWidth < 640 ? 180 : 220;

  return clamp(width / ratio, minHeight, maxHeight);
}

function createSlideshow(container, imageList, intervalMs = 3000) {
  if (!container || imageList.length === 0) {
    return null;
  }

  let active = 0;

  const frame = document.createElement('div');
  frame.className = 'slide-frame';

  const image = document.createElement('img');
  image.className = 'slide-media';
  image.alt = 'Photo placeholder';
  image.loading = 'lazy';

  frame.appendChild(image);
  container.appendChild(frame);

  const dotWrap = document.createElement('div');
  dotWrap.className = 'slide-dots';

  const dots = imageList.map(() => {
    const dot = document.createElement('span');
    dotWrap.appendChild(dot);
    return dot;
  });

  container.appendChild(dotWrap);

  function showSlide(index) {
    active = index;
    image.classList.add('fading');

    setTimeout(() => {
      image.src = imageList[active];
    }, 120);

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === active);
    });
  }

  image.addEventListener('load', () => {
    frame.style.height = `${adaptiveHeight(frame, image)}px`;
    image.classList.remove('fading');
  });

  showSlide(0);

  const timer = setInterval(() => {
    showSlide((active + 1) % imageList.length);
  }, intervalMs);

  return {
    refresh() {
      frame.style.height = `${adaptiveHeight(frame, image)}px`;
    },
    destroy() {
      clearInterval(timer);
    }
  };
}

function revealScrollPanels() {
  const panels = Array.from(document.querySelectorAll('.reveal-on-scroll'));

  if (!('IntersectionObserver' in window)) {
    panels.forEach((panel) => panel.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    {
      threshold: 0.22
    }
  );

  panels.forEach((panel) => observer.observe(panel));
}

function updateTapProgress() {
  progressText.textContent = `${tapCount} / ${requiredTaps} taps`;
  const peekPercent = `${(tapCount / requiredTaps) * 72}%`;
  mineCard.style.setProperty('--peek', peekPercent);
}

function unlockLetter() {
  intro.classList.add('unlocked');

  const unlockDelay = prefersReducedMotion ? 0 : 780;
  const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

  setTimeout(() => {
    body.classList.remove('locked');
    firstLetterSection.scrollIntoView({
      behavior: scrollBehavior,
      block: 'start'
    });
  }, unlockDelay);
}

mineCard.addEventListener('click', () => {
  if (tapCount >= requiredTaps) {
    return;
  }

  tapCount += 1;
  updateTapProgress();

  mineCard.classList.remove('tapped');
  void mineCard.offsetWidth;
  mineCard.classList.add('tapped');

  if (tapCount === requiredTaps) {
    unlockLetter();
  }
});

const slideshow = createSlideshow(topSlideshow, slides, 2800);

window.addEventListener('resize', () => {
  if (slideshow) {
    slideshow.refresh();
  }
});

revealScrollPanels();
updateTapProgress();

window.addEventListener('pagehide', () => {
  if (slideshow) {
    slideshow.destroy();
  }
});
