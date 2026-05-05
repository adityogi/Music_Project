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