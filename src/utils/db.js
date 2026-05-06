import { get, set } from 'idb-keyval';

const DIRECTORY_KEY = 'apple-music-directory-handle';

// Save the secure folder handle to IndexedDB
export async function saveDirectoryHandle(handle) {
  try {
    await set(DIRECTORY_KEY, handle);
    return true;
  } catch (error) {
    console.error('Failed to save directory handle:', error);
    return false;
  }
}

// Retrieve the handle on app load
export async function getDirectoryHandle() {
  try {
    return await get(DIRECTORY_KEY);
  } catch (error) {
    console.error('Failed to get directory handle:', error);
    return null;
  }
}

// Verify we still have permission to read the folder
export async function verifyPermission(fileHandle, readWrite = false) {
  const options = { mode: readWrite ? 'readwrite' : 'read' };
  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return true;
  }
  if ((await fileHandle.requestPermission(options)) === 'granted') {
    return true;
  }
  return false;
}