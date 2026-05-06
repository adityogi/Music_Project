export function downloadFolderStructure(library, rootName = "Local Music Library") {
  if (!library || library.length === 0) {
    alert("Please load some music into your library first!");
    return;
  }

  const tree = {};

  // 1. Build a nested object mapping the paths
  library.forEach(song => {
    let path = "Unknown Track";
    if (song.file) {
      // Safely grab the custom path (drag & drop), webkit path (folder select), or fallback to metadata
      path = song.file.customPath || song.file.webkitRelativePath || `${song.artist || 'Unknown'}/${song.album || 'Unknown'}/${song.file.name || song.title}`;
    }
    
    // Strip any leading slashes and split into folders
    path = path.replace(/^\/+/, '');
    const parts = path.split('/');
    
    let current = tree;
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = (index === parts.length - 1) ? null : {};
      }
      current = current[part];
    });
  });

  let textContent = `${rootName}\n========================\n\n`;

  // 2. Recursively convert the object into an ASCII tree string
  function printTree(node, prefix = "") {
    const keys = Object.keys(node).sort();
    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;
      textContent += prefix + (isLast ? "└── " : "├── ") + key + "\n";
      
      if (node[key] !== null) {
        printTree(node[key], prefix + (isLast ? "    " : "│   "));
      }
    });
  }

  printTree(tree);

  // 3. Generate a downloadable text file
  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  
  const dateStr = new Date().toISOString().split('T')[0];
  a.download = `Library_Structure_${dateStr}.txt`;
  
  document.body.appendChild(a);
  a.click(); // This will now work perfectly because it's tied to a user click!
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}