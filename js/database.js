/**
 * ====================================================================
 * INDEXEDDB STORAGE ENGINE (database.js)
 * ====================================================================
 * Provides permanent client-side IndexedDB database storage for
 * user-uploaded photos, memory titles, locations, dates, times, and captions.
 */

const DB_NAME = 'AshwinAnnaMemoriesDB';
const DB_VERSION = 1;
const STORE_NAME = 'memories';

const MemoryDB = {
  dbPromise: null,

  init() {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('createdBy', 'createdBy', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };
    });

    return this.dbPromise;
  },

  /**
   * Get all custom memories stored in IndexedDB
   */
  async getAllMemories() {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        // Return memories sorted newest first by createdAt
        const memories = request.result || [];
        memories.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        resolve(memories);
      };

      request.onerror = (e) => reject(e.target.error);
    });
  },

  /**
   * Save a new memory
   */
  async saveMemory(memoryObj) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const record = {
        id: memoryObj.id || `mem_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        title: memoryObj.title || 'Special Memory',
        place: memoryObj.place || 'Our Special Location',
        date: memoryObj.date || new Date().toISOString().split('T')[0],
        time: memoryObj.time || '12:00 PM',
        caption: memoryObj.caption || '',
        image: memoryObj.image || '',
        images: memoryObj.images || [memoryObj.image],
        createdBy: memoryObj.createdBy || 'Ashwin & Anna',
        createdAt: memoryObj.createdAt || new Date().toISOString()
      };

      const request = store.put(record);

      request.onsuccess = () => resolve(record);
      request.onerror = (e) => reject(e.target.error);
    });
  },

  /**
   * Delete a memory by ID
   */
  async deleteMemory(id) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  },

  /**
   * Convert File object to Base64 DataURL for permanent storage
   */
  fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
};

if (typeof window !== 'undefined') {
  window.MemoryDB = MemoryDB;
}
