import React, { useRef } from 'react';
import { Home, LayoutGrid, Mic2, FolderOpen, Music, Search } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { parseLocalFolder } from '../../utils/musicParser';
import { extractFilesFromHandle } from '../../utils/dropReader';
import { saveDirectoryHandle } from '../../utils/db';

export default function Sidebar() {
  const { currentView, setView, setLibrary } = usePlayerStore();
  const fallbackInputRef = useRef(null);

  const handleOpenFolder = async () => {
    try {
      // 1. Check if the browser supports the modern File System Access API (Chrome/Edge)
      if ('showDirectoryPicker' in window) {
        const dirHandle = await window.showDirectoryPicker();
        await saveDirectoryHandle(dirHandle); // Save for tomorrow
        const rawFiles = await extractFilesFromHandle(dirHandle);
        const { songs, albums } = await parseLocalFolder(rawFiles);
        setLibrary(songs, albums);
        setView('library');
      } else {
        // 2. If it's Safari/Firefox, fallback to the traditional hidden input click
        console.warn("Modern File API not supported. Using fallback.");
        fallbackInputRef.current?.click();
      }
    } catch (err) {
      // If the user hits "Cancel" on the native picker, do nothing. 
      // Otherwise, log the error so we can debug it.
      if (err.name !== 'AbortError') {
        console.error("Error opening folder:", err);
        alert(`Folder access error: ${err.message}`);
      }
    }
  };

  // 3. This handles the fallback for Safari/Firefox
  const handleFallbackSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Convert FileList to Array
    const fileArray = Array.from(files);
    const { songs, albums } = await parseLocalFolder(fileArray);
    
    setLibrary(songs, albums);
    setView('library');
    
    // Reset the input so you can select the same folder again if needed
    e.target.value = '';
  };

  const NavItem = ({ icon: Icon, label, viewId, active }) => (
    <button 
      onClick={() => setView(viewId)}
      className={`w-full flex items-center space-x-3 px-3 py-1.5 rounded-md text-sm font-medium transition ${active ? 'bg-apple-border/50 text-white' : 'text-apple-muted hover:bg-apple-border/30'}`}
    >
      <Icon size={18} className={active ? 'text-white' : 'text-apple-red'} />
      <span>{label}</span>
    </button>
  );

  return (
    <aside className="w-60 bg-apple-panel border-r border-apple-border flex flex-col py-4 shrink-0 h-full">
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1.5 text-apple-muted" size={16} />
          <input type="text" placeholder="Search" className="w-full bg-apple-bg border border-apple-border rounded px-8 py-1 text-sm text-white placeholder-apple-muted focus:outline-none focus:border-apple-red transition" />
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 pb-2 text-xs font-semibold text-apple-muted mt-4">Apple Music</div>
        <NavItem icon={Home} label="Home" viewId="home" active={currentView === 'home'} />
        <NavItem icon={LayoutGrid} label="Browse" viewId="browse" active={currentView === 'browse'} />
        <NavItem icon={Mic2} label="Radio" viewId="radio" active={currentView === 'radio'} />

        <div className="px-3 pb-2 text-xs font-semibold text-apple-muted mt-8">Library</div>
        <NavItem icon={Music} label="Local Albums" viewId="library" active={currentView === 'library' || currentView === 'album'} />
        
        {/* The Action Button */}
        <button 
          onClick={handleOpenFolder} 
          className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-md text-sm font-medium transition text-apple-muted hover:bg-apple-border/30 mt-2"
        >
          <FolderOpen size={18} className="text-apple-muted" />
          <span>Open Folder...</span>
        </button>

        {/* The Hidden Fallback Input */}
        <input 
          type="file" 
          ref={fallbackInputRef} 
          onChange={handleFallbackSelect} 
          webkitdirectory="true" 
          directory="true" 
          multiple 
          className="hidden" 
        />
      </nav>
    </aside>
  );
}