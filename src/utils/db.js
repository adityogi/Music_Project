import { get, set } from 'idb-keyval';

export const saveDirectoryHandle = async (handle) => {
  await set('apple-music-folder-handle', handle);
};

export const getDirectoryHandle = async () => {
  return await get('apple-music-folder-handle');
};