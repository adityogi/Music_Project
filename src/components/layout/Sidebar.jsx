import React, { useRef } from 'react';
import { Home, LayoutGrid, Mic2, FolderOpen, Music, Search, Plus, ListMusic, Settings, HelpCircle, Menu } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { getDirectoryHandle, saveDirectoryHandle } from '../../utils/db';
import { extractFilesFromHandle } from '../../utils/dropReader';
import { parseLocalFolder } from '../../utils/musicParser';

export default function Sidebar() {
  const { currentView, setView, setLibrary, searchQuery, setSearchQuery, playlists, createPlaylist, isSidebarCollapsed, toggleSidebar } = usePlayerStore();
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

  // NEW: Automatically switch to library view when searching
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() !== '' && currentView !== 'library') {
      setView('library');
    }
  };

  const handleSearchClick = () => {
    if (isSidebarCollapsed) toggleSidebar();
  };

  const NavItem = ({ icon: Icon, label, viewId, active }) => (
    <button 
      onClick={() => setView(viewId)}
      title={isSidebarCollapsed ? label : ''}
      className={`w-full flex items-center py-3 transition-all rounded-xl group relative ${
        active 
          ? 'text-white font-semibold bg-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/5' 
          : 'text-on-surface-variant/80 hover:bg-white/5'
      } ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-4 px-4'}`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-container rounded-r-full" />}
      <Icon size={20} className={active ? 'text-primary-container' : 'group-hover:text-white transition-colors'} />
      {!isSidebarCollapsed && <span className="truncate group-hover:text-white transition-colors">{label}</span>}
    </button>
  );

  return (
    <aside className={`h-[calc(100vh-88px)] fixed left-0 top-0 bg-surface-container-high/70 backdrop-blur-3xl border-r border-white/5 flex flex-col py-6 z-50 overflow-y-auto hide-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20 px-3' : 'w-[260px] px-4'}`}>
      
      {/* Top Toggle & Title */}
      <div className={`flex items-center mb-6 ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
        {!isSidebarCollapsed && <h2 className="text-sm font-bold text-white tracking-widest uppercase truncate">Apple Music</h2>}
        <button onClick={toggleSidebar} className="text-on-surface-variant hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10">
          <Menu size={20} />
        </button>
      </div>

      {/* Profile Header */}
      {!isSidebarCollapsed && (
        <div className="mb-8 px-2 flex items-center gap-3 animate-in fade-in duration-300">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-lg border border-white/10 shadow-lg shrink-0">A</div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white tracking-tight truncate">Premium User</h2>
            <p className="text-on-surface-variant/80 text-[10px] uppercase font-semibold tracking-widest truncate">Manage Account</p>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className={`mb-6 ${isSidebarCollapsed ? 'px-0' : 'px-2'}`}>
        <div 
          onClick={handleSearchClick}
          className={`relative flex items-center h-10 rounded-xl bg-white/5 border border-white/5 focus-within:border-white/20 transition-all ${isSidebarCollapsed ? 'justify-center cursor-pointer hover:bg-white/10' : 'w-full'}`}
        >
          <Search className={`${isSidebarCollapsed ? '' : 'absolute left-3'} text-on-surface-variant/80`} size={isSidebarCollapsed ? 20 : 18} />
          {!isSidebarCollapsed && (
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-full bg-transparent border-none text-white text-sm pl-10 pr-3 focus:ring-0 placeholder:text-on-surface-variant/60 outline-none" 
            />
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-1 text-sm px-1">
        {!isSidebarCollapsed && <span className="text-[10px] font-semibold text-on-surface-variant/60 px-3 mb-1 mt-2 uppercase tracking-widest animate-in fade-in">Menu</span>}
        <NavItem icon={Home} label="Home" viewId="home" active={currentView === 'home'} />
        <NavItem icon={LayoutGrid} label="Browse" viewId="browse" active={currentView === 'browse'} />
        <NavItem icon={Mic2} label="Radio" viewId="radio" active={currentView === 'radio'} />

        {!isSidebarCollapsed && <span className="text-[10px] font-semibold text-on-surface-variant/60 px-3 mb-1 mt-6 uppercase tracking-widest animate-in fade-in">Library</span>}
        {isSidebarCollapsed && <div className="h-6" />}
        <NavItem icon={Music} label="Local Albums" viewId="library" active={currentView === 'library' || currentView === 'album'} />
        
        {/* Playlists */}
        <div className={`flex items-center pb-2 mt-6 group cursor-pointer ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-3'}`} onClick={handleNewPlaylist}>
            {!isSidebarCollapsed && <span className="text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-widest">Playlists</span>}
            <Plus size={isSidebarCollapsed ? 20 : 14} className="text-on-surface-variant/60 group-hover:text-white transition-colors" title="New Playlist" />
        </div>
        {playlists && playlists.map(playlist => (
            <NavItem key={playlist.id} icon={ListMusic} label={playlist.name} viewId={`playlist-${playlist.id}`} active={currentView === `playlist-${playlist.id}`} />
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto pt-6 flex flex-col gap-2">
        <button 
          onClick={handleOpenFolder} 
          title={isSidebarCollapsed ? "Open Folder" : ""} 
          className={`w-full flex items-center justify-center py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white text-sm border border-white/5 ${isSidebarCollapsed ? 'px-0' : 'gap-2'}`}
        >
          <FolderOpen size={isSidebarCollapsed ? 20 : 18} /> 
          {!isSidebarCollapsed && <span>Open Folder</span>}
        </button>
        <div className={`flex items-center pt-4 ${isSidebarCollapsed ? 'flex-col gap-4 justify-center' : 'justify-between px-2'}`}>
          <button title="Settings" className="text-on-surface-variant/60 hover:text-white transition-colors"><Settings size={20} /></button>
          <button title="Help" className="text-on-surface-variant/60 hover:text-white transition-colors"><HelpCircle size={20} /></button>
        </div>
      </div>
      <input type="file" ref={fallbackInputRef} onChange={handleFallbackSelect} webkitdirectory="true" directory="true" multiple className="hidden" />
    </aside>
  );
}