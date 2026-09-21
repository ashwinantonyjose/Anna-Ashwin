// Global active photos array & lightbox index
window.activePhotos = window.activePhotos || [];
window.currentLightboxIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Ensure CONFIG is loaded
  if (typeof CONFIG === 'undefined') {
    console.error('CONFIG object is missing! Make sure js/config.js is included before js/script.js');
    return;
  }

  // Initialize activePhotos from CONFIG
  window.activePhotos = [...CONFIG.photos];

  // Initialize Page Modules
  initBrandAndNames();
  initRelationshipCounter();
  initHeroSection();
  initAboutSection();
  initGalleryMasonry();
  initLightbox();
  initSessionUploader();
  initMobileNav();
});

/* --------------------------------------------------------------------
   1. BRAND & NAMES INJECTOR
   -------------------------------------------------------------------- */
function initBrandAndNames() {
  const partner1 = CONFIG.partner1Name || 'Ashwin';
  const partner2 = CONFIG.partner2Name || 'Anna';

  // Update Brand Logos & Names
  document.querySelectorAll('.brand-names').forEach(el => {
    el.innerHTML = `${partner1} <span class="ampersand">&amp;</span> ${partner2}`;
  });

  // Update Hero Title
  const heroTitleNamesEl = document.getElementById('heroTitleNames');
  if (heroTitleNamesEl) {
    heroTitleNamesEl.textContent = `${partner1} & ${partner2}`;
  }

  // Update Page Title
  document.title = `${partner1} & ${partner2} — Our Journey`;
}

/* --------------------------------------------------------------------
   2. HERO SECTION INJECTOR
   -------------------------------------------------------------------- */
function initHeroSection() {
  // Hero Image
  const heroImgEl = document.getElementById('heroImage');
  if (heroImgEl && CONFIG.heroPhoto) {
    heroImgEl.src = CONFIG.heroPhoto;
    heroImgEl.alt = `${CONFIG.partner1Name} & ${CONFIG.partner2Name}`;
  }

  // Hero Subtitle / Date
  const heroSubtitleEl = document.getElementById('heroSubtitle');
  if (heroSubtitleEl) {
    heroSubtitleEl.textContent = CONFIG.heroSubtitle || `Together since ${CONFIG.startDateFormatted}`;
  }

  // Hero Names
  const heroTitleNamesEl = document.getElementById('heroTitleNames');
  if (heroTitleNamesEl) {
    heroTitleNamesEl.textContent = `${CONFIG.partner1Name} & ${CONFIG.partner2Name}`;
  }
}

/* --------------------------------------------------------------------
   3. DYNAMIC RELATIONSHIP DURATION COUNTER
   -------------------------------------------------------------------- */
function initRelationshipCounter() {
  const startDate = new Date(CONFIG.startDateISO);

  function updateCounter() {
    const now = new Date();

    // If start date is in the future, display milestone announcement
    if (now < startDate) {
      const humanEl = document.getElementById('durationHuman');
      if (humanEl) humanEl.textContent = `Starting on ${CONFIG.startDateFormatted}`;
      return;
    }

    // 1. Calculate Human Readable Months & Days
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalMonths = (years * 12) + months;
    
    // Format human text (e.g., "7 Months, 1 Day" or "1 Year, 2 Months, 5 Days")
    let humanStr = "";
    if (years > 0) {
      humanStr += `${years} Year${years > 1 ? 's' : ''}, `;
    }
    humanStr += `${totalMonths % 12 || totalMonths} Month${totalMonths !== 1 ? 's' : ''}, ${days} Day${days !== 1 ? 's' : ''}`;

    const humanEl = document.getElementById('durationHuman');
    if (humanEl) {
      humanEl.textContent = `Together for ${humanStr}`;
    }

    // 2. Real-time Live Ticker (Days, Hours, Minutes, Seconds)
    const diffMs = now - startDate;
    const totalDaysVal = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hoursVal = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minsVal = Math.floor((diffMs / (1000 * 60)) % 60);
    const secsVal = Math.floor((diffMs / 1000) % 60);

    const tickerDays = document.getElementById('tickerDays');
    const tickerHours = document.getElementById('tickerHours');
    const tickerMins = document.getElementById('tickerMins');
    const tickerSecs = document.getElementById('tickerSecs');

    if (tickerDays) tickerDays.textContent = totalDaysVal;
    if (tickerHours) tickerHours.textContent = String(hoursVal).padStart(2, '0');
    if (tickerMins) tickerMins.textContent = String(minsVal).padStart(2, '0');
    if (tickerSecs) tickerSecs.textContent = String(secsVal).padStart(2, '0');
  }

  updateCounter();
  setInterval(updateCounter, 1000);
}

/* --------------------------------------------------------------------
   4. ABOUT SECTION INJECTOR
   -------------------------------------------------------------------- */
function initAboutSection() {
  const aboutData = CONFIG.about;
  if (!aboutData) return;

  // Set Journey Start Date
  const journeyDateEl = document.getElementById('journeyDate');
  if (journeyDateEl) journeyDateEl.textContent = aboutData.journeyStart || CONFIG.startDateFormatted;

  // How We Met
  const metEl = document.getElementById('aboutHowWeMet');
  if (metEl) metEl.textContent = aboutData.howWeMet;

  // How It Started
  const startedEl = document.getElementById('aboutHowItStarted');
  if (startedEl) startedEl.textContent = aboutData.howItStarted;

  // Our Story
  const storyEl = document.getElementById('aboutOurStory');
  if (storyEl) storyEl.textContent = aboutData.ourStory;

  // Special Memories
  const momentsEl = document.getElementById('aboutSpecialMoments');
  if (momentsEl) momentsEl.textContent = aboutData.specialMoments;

  // Things We Love List
  const loveListEl = document.getElementById('aboutThingsWeLove');
  if (loveListEl && Array.isArray(aboutData.thingsWeLove)) {
    loveListEl.innerHTML = aboutData.thingsWeLove
      .map(item => `<li>${item}</li>`)
      .join('');
  }

  // Personal Message
  const messageEl = document.getElementById('aboutPersonalMessage');
  if (messageEl) messageEl.textContent = aboutData.personalMessage;
}

/* --------------------------------------------------------------------
   5. PHOTO GALLERY MASONRY RENDERER
   -------------------------------------------------------------------- */
function initGalleryMasonry() {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;

  const photosToRender = (Array.isArray(window.activePhotos) && window.activePhotos.length > 0) 
    ? window.activePhotos 
    : (typeof CONFIG !== 'undefined' && CONFIG.photos ? CONFIG.photos : []);
    
  renderGallery(photosToRender);
}

function renderGallery(photosToRender) {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;

  galleryGrid.innerHTML = '';

  photosToRender.forEach((photo, index) => {
    const card = document.createElement('div');
    card.className = 'gallery-item fade-in';
    card.setAttribute('data-index', index);

    card.innerHTML = `
      <img src="${photo.image}" alt="${photo.caption || 'Memory'}" loading="lazy">
      <div class="gallery-item-overlay">
        <div class="item-meta-top">
          <span>${photo.date}</span>
          <span class="dot">•</span>
          <span>${photo.place}</span>
        </div>
        <div class="item-caption">${photo.caption}</div>
      </div>
    `;

    // Lightbox Click Listener
    card.addEventListener('click', () => {
      openLightbox(index);
    });

    galleryGrid.appendChild(card);
  });
}

/* --------------------------------------------------------------------
   6. LIGHTBOX MODAL CONTROLLER
   -------------------------------------------------------------------- */
function initLightbox() {
  const dialog = document.getElementById('lightboxDialog');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  if (!dialog) return;

  // Light-dismiss fallback for unsupported browsers
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        closeLightbox();
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox(1));

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (!dialog.open) return;
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'Escape') closeLightbox();
  });

  // Touch Swipe Gesture Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  dialog.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  dialog.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance < 0) {
        navigateLightbox(1);  // Swipe Left -> Next
      } else {
        navigateLightbox(-1); // Swipe Right -> Prev
      }
    }
  }
}

function openLightbox(index) {
  const dialog = document.getElementById('lightboxDialog');
  if (!dialog) return;

  currentLightboxIndex = index;
  updateLightboxContent();

  dialog.showModal();
  document.body.style.overflow = 'hidden'; // Lock background scrolling
}

function closeLightbox() {
  const dialog = document.getElementById('lightboxDialog');
  if (!dialog) return;

  dialog.close();
  document.body.style.overflow = '';
}

function getActivePhotosList() {
  if (Array.isArray(window.activePhotos) && window.activePhotos.length > 0) {
    return window.activePhotos;
  }
  if (typeof CONFIG !== 'undefined' && Array.isArray(CONFIG.photos)) {
    return CONFIG.photos;
  }
  return [];
}

function navigateLightbox(direction) {
  const photos = getActivePhotosList();
  if (photos.length === 0) return;

  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) {
    currentLightboxIndex = photos.length - 1;
  } else if (currentLightboxIndex >= photos.length) {
    currentLightboxIndex = 0;
  }
  updateLightboxContent();
}

function updateLightboxContent() {
  const photos = getActivePhotosList();
  const photo = photos[currentLightboxIndex];
  if (!photo) return;

  const imgEl = document.getElementById('lightboxImg');
  const dateEl = document.getElementById('lightboxDate');
  const placeEl = document.getElementById('lightboxPlace');
  const captionEl = document.getElementById('lightboxCaption');
  const counterEl = document.getElementById('lightboxCounter');

  if (imgEl) {
    imgEl.style.opacity = '0';
    setTimeout(() => {
      imgEl.src = photo.image;
      imgEl.alt = photo.caption || 'Photo';
      imgEl.style.opacity = '1';
    }, 150);
  }

  if (dateEl) dateEl.textContent = photo.date;
  if (placeEl) placeEl.textContent = photo.place;
  if (captionEl) captionEl.textContent = photo.caption;
  if (counterEl) counterEl.textContent = `${currentLightboxIndex + 1} of ${photos.length}`;
}

/* --------------------------------------------------------------------
   7. FRONT-END SESSION PHOTO PREVIEW / UPLOADER
   -------------------------------------------------------------------- */
function initSessionUploader() {
  const fileInput = document.getElementById('sessionFileInput');
  const dropzone = document.getElementById('uploadDropzone');

  if (!fileInput || !dropzone) return;

  // File Picker Selection
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });

  // Drag & Drop Handling
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag-over');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  });
}

function handleFiles(files) {
  if (!files || files.length === 0) return;

  const newPhotoEntries = [];
  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  Array.from(files).forEach((file, idx) => {
    if (!file.type.startsWith('image/')) return;

    const objectUrl = URL.createObjectURL(file);
    newPhotoEntries.push({
      id: Date.now() + idx,
      image: objectUrl,
      date: todayFormatted,
      place: "Uploaded Session Photo",
      caption: file.name.replace(/\.[^/.]+$/, ""),
      aspect: "portrait"
    });
  });

  if (newPhotoEntries.length > 0) {
    activePhotos = [...newPhotoEntries, ...activePhotos];
    renderGallery(activePhotos);

    // Provide friendly visual indicator
    const dropzoneDesc = document.querySelector('.upload-desc');
    if (dropzoneDesc) {
      dropzoneDesc.textContent = `✨ Added ${newPhotoEntries.length} new photo(s) to your current session preview!`;
      dropzoneDesc.style.color = 'var(--color-accent)';
      dropzoneDesc.style.fontWeight = '600';
    }
  }
}

/* --------------------------------------------------------------------
   8. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close menu when clicking outside or link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });
}
