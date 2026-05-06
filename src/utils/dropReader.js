const SUPPORTED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/flac', 'audio/aac', 'audio/ogg'];
const SUPPORTED_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.flac', '.aac', '.ogg'];

// Handles extracting files from a modern FileSystemDirectoryHandle (Folder button)
export async function extractFilesFromHandle(directoryHandle, currentPath = "") {
  const files = [];
  
  async function scanDirectory(dirHandle, path) {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        // Track the path for our text structure generator
        Object.defineProperty(file, 'customPath', { value: path + file.name });

        if (SUPPORTED_AUDIO_TYPES.includes(file.type) || SUPPORTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) {
          files.push(file);
        }
      } else if (entry.kind === 'directory') {
        await scanDirectory(entry, path + entry.name + '/');
      }
    }
  }

  await scanDirectory(directoryHandle, currentPath);
  return files;
}

// Handles extracting files from drag-and-drop (Bypasses the 100 file limit!)
export async function extractFilesFromDrop(items) {
  const files = [];
  const queue = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry();
      if (entry) queue.push({ entry, path: '' });
    }
  }

  async function readEntry(entry, currentPath) {
    if (entry.isFile) {
      return new Promise((resolve) => {
        entry.file((file) => {
          // Track the path for our text structure generator
          Object.defineProperty(file, 'customPath', { value: currentPath + file.name });
          
          if (SUPPORTED_AUDIO_TYPES.includes(file.type) || SUPPORTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) {
            files.push(file);
          }
          resolve();
        });
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const newPath = currentPath + entry.name + '/';
      
      return new Promise((resolve) => {
        // RECURSIVE BATCH LOOP: Bypasses the 100 file limit
        const readBatch = () => {
          dirReader.readEntries(async (entries) => {
            if (entries.length === 0) {
              resolve(); // No more files in this folder
            } else {
              for (let i = 0; i < entries.length; i++) {
                await readEntry(entries[i], newPath);
              }
              readBatch(); // Call again to grab the NEXT 100 files
            }
          });
        };
        readBatch();
      });
    }
  }

  for (const { entry, path } of queue) {
    await readEntry(entry, path);
  }

  return files;
}