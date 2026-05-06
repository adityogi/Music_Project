import React, { useRef } from 'react';
import { Home, LayoutGrid, Mic2, FolderOpen, Music, Search, Plus, ListMusic, Settings, HelpCircle } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { getDirectoryHandle, saveDirectoryHandle } from '../../utils/db';
import { extractFilesFromHandle } from '../../utils/dropReader';
import { parseLocalFolder } from '../../utils/musicParser';

export default function Sidebar() {
  const { currentView, setView, setLibrary, searchQuery, setSearchQuery, playlists, createPlaylist } = usePlayerStore();
  const fallbackInputRef = useRef(null);

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
      className={`w-full flex items-center gap-4 py-2 px-5 transition-colors rounded-xl group relative ${
        active 
          ? 'text-white font-semibold bg-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/5' 
          : 'text-on-surface-variant/80 hover:bg-white/5'
      }`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-container rounded-r-full" />}
      <Icon size={20} className={active ? 'text-primary-container' : 'group-hover:text-white transition-colors'} />
      <span className={active ? '' : 'group-hover:text-white transition-colors'}>{label}</span>
    </button>
  );

  return (
    <aside className="w-[sidebar-width] h-[calc(100vh-88px)] fixed left-0 top-0 bg-surface-container-high/70 backdrop-blur-3xl border-r border-white/5 flex flex-col py-margin-safe px-4 z-50 overflow-y-auto hide-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      
      {/* Profile Header */}
      <div className="mb-8 px-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-lg border border-white/10 shadow-lg">A</div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">APPLE MUSIC</h2>
          <p className="text-on-surface-variant/80 text-[10px] uppercase font-semibold tracking-widest">Premium Account</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6 px-2">
        <div className="relative flex items-center w-full h-10 rounded-xl bg-white/5 border border-white/5 focus-within:border-white/20 transition-colors">
          <Search className="absolute left-3 text-on-surface-variant/80" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full bg-transparent border-none text-white text-sm pl-10 pr-3 focus:ring-0 placeholder:text-on-surface-variant/60 outline-none" 
          />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-1 text-sm px-2">
        <span className="text-[10px] font-semibold text-on-surface-variant/60 px-3 mb-1 mt-2 uppercase tracking-widest">Menu</span>
        <NavItem icon={Home} label="Home" viewId="home" active={currentView === 'home'} />
        <NavItem icon={LayoutGrid} label="Browse" viewId="browse" active={currentView === 'browse'} />
        <NavItem icon={Mic2} label="Radio" viewId="radio" active={currentView === 'radio'} />

        <span className="text-[10px] font-semibold text-on-surface-variant/60 px-3 mb-1 mt-6 uppercase tracking-widest">Library</span>
        <NavItem icon={Music} label="Local Albums" viewId="library" active={currentView === 'library' || currentView === 'album'} />
        
        {/* Playlists */}
        <div className="flex items-center justify-between px-3 pb-2 mt-6 group cursor-pointer" onClick={handleNewPlaylist}>
            <span className="text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-widest">Playlists</span>
            <Plus size={14} className="text-on-surface-variant/60 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {playlists && playlists.map(playlist => (
            <NavItem key={playlist.id} icon={ListMusic} label={playlist.name} viewId={`playlist-${playlist.id}`} active={currentView === `playlist-${playlist.id}`} />
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto pt-6 flex flex-col gap-2">
        <button onClick={handleOpenFolder} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white text-sm border border-white/5">
          <FolderOpen size={18} /> Open Folder
        </button>
        <div className="flex justify-between px-4 pt-4">
          <button className="text-on-surface-variant/60 hover:text-white transition-colors"><Settings size={20} /></button>
          <button className="text-on-surface-variant/60 hover:text-white transition-colors"><HelpCircle size={20} /></button>
        </div>
      </div>
      <input type="file" ref={fallbackInputRef} onChange={handleFallbackSelect} webkitdirectory="true" directory="true" multiple className="hidden" />
    </aside>
  );
}