const openEnvelopeBtn = document.getElementById('openEnvelope');
const intro = document.getElementById('intro');
const letterExperience = document.getElementById('letterExperience');
const finale = document.getElementById('finale');
const revealFinaleBtn = document.getElementById('revealFinale');
const typewriterEl = document.getElementById('typewriter');
const counterEl = document.getElementById('counter');
const popupDialog = document.getElementById('popupDialog');
const popupContent = document.getElementById('popupContent');
const closePopup = document.getElementById('closePopup');

const startDate = new Date('2024-01-01T00:00:00');
const letterText =
  "My love, every day with you feels like magic wrapped in calm. You make the ordinary feel golden, and every laugh with you is my favorite song. Thank you for being my safe place and my biggest adventure.";

const popups = {
  memory: {
    title: 'Our Little Memory Box 📸',
    body: `<ul>
      <li>The first time you smiled at me and my brain forgot all words.</li>
      <li>That walk where we talked for hours and time disappeared.</li>
      <li>Every random laugh attack we had over absolutely nothing.</li>
    </ul>`
  },
  promises: {
    title: 'Promises I Keep 🤍',
    body: `<ol>
      <li>I’ll keep choosing you — in simple days and hard days.</li>
      <li>I’ll listen deeply and love loudly.</li>
      <li>I’ll keep building our little universe, one memory at a time.</li>
    </ol>`
  },
  future: {
    title: 'A Tiny Peek at Our Future 🌙',
    body: `<p>
      Cozy nights, messy kitchen dancing, silly selfies, tiny trips, big dreams,
      and a forever where your hand is always in mine.
    </p>`
  }
};

function typeLetter(text) {
  let i = 0;
  const timer = setInterval(() => {
    typewriterEl.textContent += text[i];
    i += 1;
    if (i >= text.length) {
      clearInterval(timer);
    }
  }, 28);
}

function updateCounter() {
  const now = new Date();
  const diff = now - startDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  counterEl.textContent = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds of loving you.`;
}

function openLetterExperience() {
  openEnvelopeBtn.classList.add('open');

  setTimeout(() => {
    intro.classList.remove('active');
    letterExperience.classList.add('active');
    intro.setAttribute('aria-hidden', 'true');
    letterExperience.setAttribute('aria-hidden', 'false');

    if (!typewriterEl.textContent) {
      typeLetter(letterText);
    }
  }, 900);
}

function showPopup(key) {
  const chosen = popups[key];
  if (!chosen) {
    return;
  }

  popupContent.innerHTML = `<h3>${chosen.title}</h3>${chosen.body}`;
  popupDialog.showModal();
}

openEnvelopeBtn.addEventListener('click', openLetterExperience);

revealFinaleBtn.addEventListener('click', () => {
  letterExperience.classList.remove('active');
  finale.classList.add('active');
  letterExperience.setAttribute('aria-hidden', 'true');
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
