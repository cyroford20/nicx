const letterCard = document.getElementById("letterCard");
const openLetterBtn = document.getElementById("openLetter");
const fireworksBtn = document.getElementById("fireworksBtn");
const confettiLayer = document.getElementById("confettiLayer");

const slideshow = document.getElementById("photoSlideshow");
const slideImage = document.getElementById("slideImage");
const slideTitle = document.getElementById("slideTitle");
const slideCounter = document.getElementById("slideCounter");
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");
const thumbs = Array.from(document.querySelectorAll(".thumb"));

let currentSlide = 0;
let slideTimer;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (openLetterBtn && letterCard) {
  openLetterBtn.setAttribute("aria-expanded", "false");

  openLetterBtn.addEventListener("click", () => {
    if (!letterCard.classList.contains("visible")) {
      letterCard.classList.add("visible");
      openLetterBtn.setAttribute("aria-expanded", "true");
      openLetterBtn.textContent = "Letter Opened";
    }
  });
}

if (fireworksBtn) {
  fireworksBtn.addEventListener("click", () => {
    launchConfetti();
  });
}

if (thumbs.length && slideshow && slideImage && slideTitle && slideCounter && prevSlideBtn && nextSlideBtn) {
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      showSlide(index);
      restartSlideshow();
    });
  });

  prevSlideBtn.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    restartSlideshow();
  });

  nextSlideBtn.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    restartSlideshow();
  });

  slideshow.addEventListener("mouseenter", stopSlideshow);
  slideshow.addEventListener("mouseleave", startSlideshow);
  slideshow.addEventListener("focusin", stopSlideshow);
  slideshow.addEventListener("focusout", startSlideshow);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  });

  showSlide(0, false);
  startSlideshow();
}

function showSlide(index, animate = true) {
  currentSlide = (index + thumbs.length) % thumbs.length;
  const selectedThumb = thumbs[currentSlide];
  const setContent = () => {
    slideImage.src = selectedThumb.dataset.src;
    slideImage.alt = selectedThumb.dataset.alt;
    slideTitle.textContent = selectedThumb.dataset.alt;
    slideCounter.textContent = `${String(currentSlide + 1).padStart(2, "0")} / ${thumbs.length}`;

    thumbs.forEach((thumb) => thumb.classList.remove("is-active"));
    selectedThumb.classList.add("is-active");
  };

  if (!animate || reduceMotion) {
    setContent();
    return;
  }

  slideImage.classList.add("is-changing");
  window.setTimeout(() => {
    setContent();
    window.requestAnimationFrame(() => {
      slideImage.classList.remove("is-changing");
    });
  }, 160);
}

function startSlideshow() {
  if (reduceMotion || !thumbs.length) {
    return;
  }

  stopSlideshow();
  slideTimer = window.setInterval(() => {
    showSlide(currentSlide + 1);
  }, 4200);
}

function stopSlideshow() {
  window.clearInterval(slideTimer);
}

function restartSlideshow() {
  stopSlideshow();
  startSlideshow();
}

function launchConfetti() {
  if (!confettiLayer) {
    return;
  }

  const colors = ["#31c9ff", "#1874ff", "#bdeeff", "#7c5cff", "#ff9dbb", "#f6c45c"];

  for (let i = 0; i < 120; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 240}px`);
    piece.style.animationDuration = `${5 + Math.random() * 4}s`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    confettiLayer.appendChild(piece);

    setTimeout(() => piece.remove(), 9000);
  }
}



