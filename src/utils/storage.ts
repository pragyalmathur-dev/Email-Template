import { NewsletterDocument } from '../types/newsletter';

const DB_NAME = 'EditoMailDB';
const DB_VERSION = 1;
const STORE_NAME = 'newsletters';
const ACTIVE_DOC_KEY = 'active_newsletter';
const BACKUP_LOCALSTORAGE_KEY = 'editomail_newsletter_draft_backup';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Saves document into IndexedDB (supports 100MB+ without quota errors)
 * and writes a lightweight fallback copy to LocalStorage if possible.
 */
export async function saveNewsletterToStorage(doc: NewsletterDocument): Promise<void> {
  // 1. Save to IndexedDB
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const putRequest = store.put(doc, ACTIVE_DOC_KEY);

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    });
  } catch (err) {
    console.warn('Failed to save to IndexedDB, falling back to LocalStorage:', err);
  }

  // 2. Fallback to LocalStorage
  try {
    const serialized = JSON.stringify(doc);
    localStorage.setItem(BACKUP_LOCALSTORAGE_KEY, serialized);
  } catch {
    // If local storage is full (quota exceeded due to base64 images), ignore since IndexedDB handles it
  }
}

/**
 * Loads the saved newsletter document across page refreshes.
 * First checks IndexedDB, then falls back to LocalStorage.
 */
export async function loadNewsletterFromStorage(): Promise<NewsletterDocument | null> {
  // 1. Try IndexedDB first
  try {
    const db = await openDatabase();
    const result = await new Promise<NewsletterDocument | null>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(ACTIVE_DOC_KEY);

      getRequest.onsuccess = () => {
        resolve(getRequest.result || null);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });

    if (result && (result.rawHtmlContent || (result.blocks && result.blocks.length > 0))) {
      return result;
    }
  } catch (err) {
    console.warn('Could not read from IndexedDB, checking LocalStorage fallback:', err);
  }

  // 2. Try LocalStorage fallback
  try {
    const raw = localStorage.getItem(BACKUP_LOCALSTORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.rawHtmlContent || (parsed.blocks && parsed.blocks.length > 0))) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Clears saved newsletter from storage
 */
export async function clearNewsletterStorage(): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const delRequest = store.delete(ACTIVE_DOC_KEY);
      delRequest.onsuccess = () => resolve();
      delRequest.onerror = () => reject(delRequest.error);
    });
  } catch {
    // ignore
  }

  try {
    localStorage.removeItem(BACKUP_LOCALSTORAGE_KEY);
  } catch {
    // ignore
  }
}
