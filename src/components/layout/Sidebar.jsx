import React, { useRef } from 'react';
import { Home, LayoutGrid, Mic2, FolderOpen, Music, Search, Plus, ListMusic } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { getDirectoryHandle, saveDirectoryHandle } from '../../utils/db';
import { verifyPermission, extractFilesFromHandle } from '../../utils/dropReader';
import { parseLocalFolder } from '../../utils/musicParser';

export default function Sidebar() {
  const { currentView, setView, setLibrary, searchQuery, setSearchQuery, playlists, createPlaylist } = usePlayerStore();
  const fallbackInputRef = useRef(null);

  // --- THE MISSING FOLDER LOGIC ---
  const handleOpenFolder = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        const handle = await window.showDirectoryPicker();
        await saveDirectoryHandle(handle);
        const rawFiles = await extractFilesFromHandle(handle);
        const { songs, albums } = await parseLocalFolder(rawFiles);
        setLibrary(songs, albums);
        setView('library');
      } else {
        fallbackInputRef.current.click();
      }
    } catch (err) {
      console.error("User cancelled or browser blocked folder access:", err);
    }
  };

  const handleFallbackSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const { songs, albums } = await parseLocalFolder(files);
      setLibrary(songs, albums);
      setView('library');
    }
  };

  const handleNewPlaylist = () => {
    const name = prompt("Enter playlist name:");
    if (name) createPlaylist(name);
  };

  const NavItem = ({ icon: Icon, label, viewId, active }) => (
    <button 
      onClick={() => setView(viewId)}
      className={`w-full flex items-center space-x-3 px-3 py-1.5 rounded-md text-sm font-medium transition ${active ? 'bg-apple-border/50 text-white' : 'text-apple-muted hover:bg-apple-border/30'}`}
    >
      <Icon size={18} className={active ? 'text-white' : 'text-apple-red'} />
      <span className="truncate">{label}</span>
    </button>
  );

  return (
    <aside className="w-60 bg-apple-panel border-r border-apple-border flex flex-col py-4 shrink-0 h-full relative z-20">
      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1.5 text-apple-muted" size={16} />
          <input 
            type="text" 
            placeholder="Search Library" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-apple-bg border border-apple-border rounded px-8 py-1 text-sm text-white placeholder-apple-muted focus:outline-none focus:border-apple-red transition" 
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1 hide-scrollbar">
        <div className="px-3 pb-2 text-xs font-semibold text-apple-muted mt-4 uppercase tracking-tighter">Apple Music</div>
        <NavItem icon={Home} label="Home" viewId="home" active={currentView === 'home'} />
        <NavItem icon={LayoutGrid} label="Browse" viewId="browse" active={currentView === 'browse'} />
        <NavItem icon={Mic2} label="Radio" viewId="radio" active={currentView === 'radio'} />

        <div className="px-3 pb-2 text-xs font-semibold text-apple-muted mt-8 uppercase tracking-tighter">Library</div>
        <NavItem icon={Music} label="Local Albums" viewId="library" active={currentView === 'library' || currentView === 'album'} />
        
        {/* Playlists Section */}
        <div className="flex items-center justify-between px-3 pb-2 mt-8 group cursor-pointer" onClick={handleNewPlaylist}>
            <div className="text-xs font-semibold text-apple-muted uppercase tracking-tighter">Playlists</div>
            <Plus size={14} className="text-apple-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {playlists && playlists.map(playlist => (
            <NavItem key={playlist.id} icon={ListMusic} label={playlist.name} viewId={`playlist-${playlist.id}`} active={currentView === `playlist-${playlist.id}`} />
        ))}

        <button 
          onClick={handleOpenFolder} 
          className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-md text-sm font-medium transition text-apple-muted hover:bg-apple-border/30 mt-6"
        >
          <FolderOpen size={18} className="text-apple-muted" />
          <span>Open Folder...</span>
        </button>

        <input type="file" ref={fallbackInputRef} onChange={handleFallbackSelect} webkitdirectory="true" directory="true" multiple className="hidden" />
      </nav>
    </aside>
  );
}