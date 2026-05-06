const SUPPORTED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/flac', 'audio/aac', 'audio/ogg'];
const SUPPORTED_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.flac', '.aac', '.ogg'];

// Handles extracting files from a modern FileSystemDirectoryHandle
export async function extractFilesFromHandle(directoryHandle) {
  const files = [];
  
  async function scanDirectory(dirHandle) {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        if (SUPPORTED_AUDIO_TYPES.includes(file.type) || SUPPORTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) {
          files.push(file);
        }
      } else if (entry.kind === 'directory') {
        await scanDirectory(entry);
      }
    }
  }

  await scanDirectory(directoryHandle);
  return files;
}

// Handles extracting files from drag-and-drop DataTransferItems
export async function extractFilesFromDrop(items) {
  const files = [];
  const queue = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry();
      if (entry) queue.push(entry);
    }
  }

  async function readEntry(entry) {
    if (entry.isFile) {
      return new Promise((resolve) => {
        entry.file((file) => {
          if (SUPPORTED_AUDIO_TYPES.includes(file.type) || SUPPORTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) {
            files.push(file);
          }
          resolve();
        });
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      return new Promise((resolve) => {
        dirReader.readEntries(async (entries) => {
          for (let i = 0; i < entries.length; i++) {
            await readEntry(entries[i]);
          }
          resolve();
        });
      });
    }
  }

  for (const entry of queue) {
    await readEntry(entry);
  }

  return files;
}