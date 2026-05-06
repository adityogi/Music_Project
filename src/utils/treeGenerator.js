export function downloadFolderStructure(files, rootName = "Apple Music Library") {
  if (!files || files.length === 0) return;

  const tree = {};

  // 1. Build a nested object mapping the paths
  files.forEach(file => {
    const path = file.customPath || file.webkitRelativePath || file.name;
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
      
      // If it's a folder (not null), traverse deeper
      if (node[key] !== null) {
        printTree(node[key], prefix + (isLast ? "    " : "│   "));
      }
    });
  }

  printTree(tree);

  // 3. Generate a downloadable blob file
  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  
  // Format filename like: Library_Structure_10-24-2023.txt
  const dateStr = new Date().toISOString().split('T')[0];
  a.download = `Library_Structure_${dateStr}.txt`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}