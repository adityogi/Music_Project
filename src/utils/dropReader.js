export const extractFilesFromDrop = async (dataTransferItems) => {
  const files = [];
  const entries = [];

  // Grab the root items dropped into the window
  for (let i = 0; i < dataTransferItems.length; i++) {
    const item = dataTransferItems[i];
    if (item.kind === 'file') {
      entries.push(item.webkitGetAsEntry());
    }
  }

  // Recursive function to dig through directories
  const traverseEntry = async (entry, path = '') => {
    if (!entry) return;

    if (entry.isFile) {
      const file = await new Promise((resolve) => entry.file(resolve));
      
      // Polyfill webkitRelativePath so our existing musicParser doesn't break
      // We manually attach the folder path structure to the file object
      Object.defineProperty(file, 'webkitRelativePath', {
        value: entry.fullPath.replace(/^\//, ''), // Remove leading slash
        writable: false
      });
      
      files.push(file);
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      
      // Read all entries in this directory
      const dirEntries = await new Promise((resolve) => {
        dirReader.readEntries(resolve);
      });
      
      // Recursively traverse them
      for (const e of dirEntries) {
        await traverseEntry(e, `${path}${entry.name}/`);
      }
    }
  };

  // Start the traversal for all dropped items
  for (const entry of entries) {
    await traverseEntry(entry);
  }

  return files;
};

// Add these to the bottom of src/utils/dropReader.js

export const extractFilesFromHandle = async (dirHandle) => {
  const files = [];
  
  const traverse = async (handle, path = '') => {
    // The modern File System Access API uses async iterators
    for await (const entry of handle.values()) {
      if (entry.kind === 'file') {
        // Only extract actual audio files to keep memory usage low
        if (/\.(mp3|wav|m4a|flac)$/i.test(entry.name)) {
            const file = await entry.getFile();
            // Polyfill the path so our ID3 parser knows the Artist/Album folder names
            Object.defineProperty(file, 'webkitRelativePath', {
              value: `${path}${file.name}`,
              writable: false
            });
            files.push(file);
        }
      } else if (entry.kind === 'directory') {
        await traverse(entry, `${path}${entry.name}/`);
      }
    }
  };

  await traverse(dirHandle);
  return files;
};

export const verifyPermission = async (fileHandle) => {
  // Browsers require us to verify we still have permission to read the folder
  if ((await fileHandle.queryPermission({ mode: 'read' })) === 'granted') {
    return true;
  }
  if ((await fileHandle.requestPermission({ mode: 'read' })) === 'granted') {
    return true;
  }
  return false;
};