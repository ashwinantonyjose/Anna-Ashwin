/**
 * ====================================================================
 * MEMORY & GALLERY CONTROLLER (gallery.js)
 * ====================================================================
 */

let allCombinedPhotos = [];
let activeFilter = 'all';
let selectedFiles = [];
let editingMemoryId = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Load and merge memories
  await loadAndRenderGallery();

  // Init UI Components
  initAddMemoryModal();
  initFilterTabs();
});

/**
 * Load memories from CONFIG.photos + IndexedDB
 */
async function loadAndRenderGallery() {
  const staticPhotos = (typeof CONFIG !== 'undefined' && Array.isArray(CONFIG.photos)) ? CONFIG.photos : [];
  
  let dbMemories = [];
  try {
    dbMemories = await MemoryDB.getAllMemories();
  } catch (e) {
    console.error('Error fetching memories from IndexedDB', e);
  }

  // Format static photos into memory cards structure
  const formattedStatic = staticPhotos.map(p => ({
    id: `static_${p.id}`,
    isStatic: true,
    title: p.place || 'Our Memory',
    place: p.place || 'Special Location',
    date: p.date || '20 February 2026',
    time: p.time || '12:00 PM',
    caption: p.caption || '',
    image: p.image,
    images: [p.image],
    createdBy: 'Ashwin & Anna',
    createdAt: new Date(2026, 1, 20).toISOString()
  }));

  // Combine IndexedDB memories (which appear first as newest) with static photos
  allCombinedPhotos = [...dbMemories, ...formattedStatic];

  // Update window.activePhotos so Lightbox references the exact combined list
  window.activePhotos = allCombinedPhotos;

  renderFilteredGallery();
}

/**
 * Render gallery based on active filter ('all' vs 'my')
 */
function renderFilteredGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;

  galleryGrid.innerHTML = '';

  let photosToDisplay = allCombinedPhotos;

  if (activeFilter === 'my') {
    // Show user created custom memories from IndexedDB
    photosToDisplay = allCombinedPhotos.filter(p => !p.isStatic);
  }

  if (photosToDisplay.length === 0) {
    galleryGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--color-text-muted);">
        <p style="font-size: 1.2rem; font-family: var(--font-serif);">No memories found in this view.</p>
        <button onclick="openAddMemoryModal()" class="btn btn-primary" style="margin-top: 1rem;">+ Add a Memory</button>
      </div>
    `;
    return;
  }

  photosToDisplay.forEach((memory, index) => {
    const card = document.createElement('div');
    card.className = 'gallery-item fade-in';
    card.setAttribute('data-index', index);

    // Main image path
    const mainImg = memory.image || (memory.images && memory.images[0]) || '';

    // Controls for custom IndexedDB memories (Edit / Delete)
    const controlsHtml = !memory.isStatic ? `
      <div class="memory-card-controls" onclick="event.stopPropagation()">
        <button class="card-control-btn" title="Edit Memory" onclick="editMemory('${memory.id}')">✏️</button>
        <button class="card-control-btn" title="Delete Memory" onclick="confirmDeleteMemory('${memory.id}')">🗑️</button>
      </div>
    ` : '';

    card.innerHTML = `
      ${controlsHtml}
      <img src="${mainImg}" alt="${memory.title || 'Memory'}" loading="lazy">
      <div class="gallery-item-overlay">
        <div class="memory-card-header">
          <div class="memory-card-title">${memory.title || 'Our Memory'}</div>
        </div>
        <div class="memory-details-pills">
          <span class="detail-pill">📍 ${memory.place}</span>
          <span class="detail-pill">📅 ${memory.date}</span>
          <span class="detail-pill">🕐 ${memory.time || ''}</span>
        </div>
        ${memory.caption ? `<div class="item-caption">“${memory.caption}”</div>` : ''}
      </div>
    `;

    // Click to open Lightbox
    card.addEventListener('click', () => {
      if (typeof openLightbox === 'function') {
        openLightbox(index);
      }
    });

    galleryGrid.appendChild(card);
  });
}

/**
 * Filter Tabs Controller
 */
function initFilterTabs() {
  const allBtn = document.getElementById('filterAllBtn');
  const myBtn = document.getElementById('filterMyBtn');

  if (allBtn) {
    allBtn.addEventListener('click', () => {
      activeFilter = 'all';
      allBtn.classList.add('active');
      if (myBtn) myBtn.classList.remove('active');
      renderFilteredGallery();
    });
  }

  if (myBtn) {
    myBtn.addEventListener('click', () => {
      activeFilter = 'my';
      myBtn.classList.add('active');
      if (allBtn) allBtn.classList.remove('active');
      renderFilteredGallery();
    });
  }
}

/**
 * Add / Edit Memory Modal Initialization
 */
function initAddMemoryModal() {
  const modal = document.getElementById('addMemoryModal');
  const openBtn = document.getElementById('openAddMemoryBtn');
  const closeBtn = document.getElementById('closeAddMemoryBtn');
  const cancelBtn = document.getElementById('cancelMemoryBtn');
  const memoryForm = document.getElementById('memoryForm');
  const fileInput = document.getElementById('memoryFileInput');
  const dropzone = document.getElementById('memoryDropzone');

  if (!modal) return;

  if (openBtn) {
    openBtn.addEventListener('click', () => openAddMemoryModal());
  }

  if (closeBtn) closeBtn.addEventListener('click', () => closeModal());
  if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal());

  // File Selection
  if (fileInput) {
    fileInput.addEventListener('change', (e) => handleSelectedFiles(e.target.files));
  }

  // Drag & Drop
  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--color-accent)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'var(--color-card-border)';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--color-card-border)';
      handleSelectedFiles(e.dataTransfer.files);
    });
  }

  // Form Submit (Save Memory)
  if (memoryForm) {
    memoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleSaveMemory();
    });
  }
}

function openAddMemoryModal(editingRecord = null) {
  const modal = document.getElementById('addMemoryModal');
  if (!modal) return;

  editingMemoryId = editingRecord ? editingRecord.id : null;
  selectedFiles = [];

  const titleInput = document.getElementById('memoryTitleInput');
  const placeInput = document.getElementById('memoryPlaceInput');
  const dateInput = document.getElementById('memoryDateInput');
  const timeInput = document.getElementById('memoryTimeInput');
  const captionInput = document.getElementById('memoryCaptionInput');
  const modalTitle = document.getElementById('modalTitleHeader');

  if (modalTitle) {
    modalTitle.textContent = editingRecord ? 'Edit Memory ♡' : 'Create a New Memory ♡';
  }

  if (editingRecord) {
    if (titleInput) titleInput.value = editingRecord.title;
    if (placeInput) placeInput.value = editingRecord.place;
    if (dateInput) dateInput.value = editingRecord.date;
    if (timeInput) timeInput.value = editingRecord.time;
    if (captionInput) captionInput.value = editingRecord.caption;
  } else {
    if (titleInput) titleInput.value = '';
    if (placeInput) placeInput.value = '';
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    if (timeInput) timeInput.value = '05:30 PM';
    if (captionInput) captionInput.value = '';
  }

  renderThumbnails([]);
  modal.showModal();
}

function closeModal() {
  const modal = document.getElementById('addMemoryModal');
  if (modal) modal.close();
  editingMemoryId = null;
  selectedFiles = [];
}

/**
 * Thumbnails Preview Renderer
 */
function handleSelectedFiles(files) {
  if (!files || files.length === 0) return;

  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      selectedFiles.push(file);
    }
  });

  renderThumbnails(selectedFiles);
}

function renderThumbnails(filesArray) {
  const grid = document.getElementById('uploadThumbnailsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  filesArray.forEach((file, index) => {
    const objectUrl = URL.createObjectURL(file);
    const item = document.createElement('div');
    item.className = 'thumb-preview-item';
    item.innerHTML = `
      <img src="${objectUrl}" alt="Thumbnail">
      <button type="button" class="thumb-remove-btn" onclick="removeThumbnail(${index})">✕</button>
    `;
    grid.appendChild(item);
  });
}

function removeThumbnail(index) {
  selectedFiles.splice(index, 1);
  renderThumbnails(selectedFiles);
}

/**
 * Save Memory to IndexedDB
 */
async function handleSaveMemory() {
  const titleInput = document.getElementById('memoryTitleInput');
  const placeInput = document.getElementById('memoryPlaceInput');
  const dateInput = document.getElementById('memoryDateInput');
  const timeInput = document.getElementById('memoryTimeInput');
  const captionInput = document.getElementById('memoryCaptionInput');

  // Convert selected file images to base64
  const imageBase64List = [];
  for (const file of selectedFiles) {
    try {
      const dataUrl = await MemoryDB.fileToDataURL(file);
      imageBase64List.push(dataUrl);
    } catch (e) {
      console.error('Error converting file to base64', e);
    }
  }

  // If editing an existing memory and no new image uploaded, keep existing image
  let finalImage = imageBase64List[0] || '';
  if (editingMemoryId && !finalImage) {
    const existing = allCombinedPhotos.find(p => p.id === editingMemoryId);
    if (existing) finalImage = existing.image;
  }

  if (!finalImage && !editingMemoryId) {
    alert('Please select at least one photo for your memory ♡');
    return;
  }

  const memoryObj = {
    id: editingMemoryId || undefined,
    title: titleInput ? titleInput.value : 'Our Memory',
    place: placeInput ? placeInput.value : 'Kochi',
    date: dateInput ? dateInput.value : new Date().toLocaleDateString('en-GB'),
    time: timeInput ? timeInput.value : '05:30 PM',
    caption: captionInput ? captionInput.value : '',
    image: finalImage,
    images: imageBase64List.length > 0 ? imageBase64List : [finalImage],
    createdBy: 'Ashwin & Anna',
    createdAt: new Date().toISOString()
  };

  try {
    await MemoryDB.saveMemory(memoryObj);
    showToast('Memory added successfully ♡');
    closeModal();
    await loadAndRenderGallery();
  } catch (e) {
    console.error('Error saving memory', e);
    alert('Failed to save memory to IndexedDB.');
  }
}

/**
 * Confirm and Delete Custom Memory
 */
async function confirmDeleteMemory(id) {
  if (confirm('Are you sure you want to delete this memory?')) {
    try {
      await MemoryDB.deleteMemory(id);
      showToast('Memory deleted ♡');
      await loadAndRenderGallery();
    } catch (e) {
      console.error('Error deleting memory', e);
    }
  }
}

/**
 * Edit Custom Memory
 */
function editMemory(id) {
  const record = allCombinedPhotos.find(p => p.id === id);
  if (record) {
    openAddMemoryModal(record);
  }
}

/**
 * Toast Notification Helper
 */
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
