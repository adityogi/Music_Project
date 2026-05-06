import React, { useRef } from 'react';
import { Home, LayoutGrid, Mic2, FolderOpen, Music, Plus, ListMusic, Settings, HelpCircle, Menu, Disc3, Clock, User, Podcast } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { getDirectoryHandle, saveDirectoryHandle } from '../../utils/db';
import { extractFilesFromHandle } from '../../utils/dropReader';
import { parseLocalFolder } from '../../utils/musicParser';

export default function Sidebar() {
  const { currentView, setView, setLibrary, playlists, createPlaylist, isSidebarCollapsed, toggleSidebar } = usePlayerStore();
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
      } else { fallbackInputRef.current.click(); }
    } catch (err) { console.error("User cancelled or browser blocked folder access:", err); }
  };

  const handleFallbackSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const { songs, albums } = await parseLocalFolder(files);
      setLibrary(songs, albums);
      setView('library');
    }
  };

  const NavItem = ({ icon: Icon, label, viewId, active }) => (
    <button 
      onClick={() => setView(viewId)}
      title={isSidebarCollapsed ? label : ''}
      className={`w-full flex items-center py-2.5 transition-all rounded-lg group relative ${
        active 
          ? 'text-white font-medium bg-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/5' 
          : 'text-on-surface-variant/80 hover:text-white hover:bg-white/5'
      } ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-4 px-4'}`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-container rounded-r-full" />}
      <Icon size={18} className={active ? 'text-primary-container' : 'transition-colors'} />
      {!isSidebarCollapsed && <span className="text-sm truncate">{label}</span>}
    </button>
  );

  return (
    <aside className={`h-[calc(100vh-88px)] fixed left-0 top-0 bg-surface-container-high/40 backdrop-blur-3xl border-r border-white/5 flex flex-col py-6 z-50 overflow-y-auto hide-scrollbar transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20 px-3' : 'w-[260px] px-3'}`}>
      
      {/* Top Toggle */}
      <div className={`flex items-center mb-6 ${isSidebarCollapsed ? 'justify-center' : 'justify-end pr-2'}`}>
        <button onClick={toggleSidebar} className="text-on-surface-variant hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10">
          <Menu size={20} />
        </button>
      </div>

      {/* Local Player Badge */}
      <div className={`mb-8 flex items-center gap-3 px-3 animate-in fade-in duration-300 ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}>
        <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container border border-primary-container/30 shrink-0">
          <Music size={18} className="fill-current" />
        </div>
        {!isSidebarCollapsed && (
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white tracking-tight truncate">LOCAL PLAYER</h2>
            <p className="text-on-surface-variant/60 text-[10px] uppercase font-semibold tracking-widest truncate">Desktop Pro</p>
          </div>
        )}
      </div>

      <div className={`px-2 mb-6 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
        <button onClick={handleOpenFolder} className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors text-on-surface-variant hover:text-white text-sm">
          <FolderOpen size={18} /> Open Folder
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-1">
        {!isSidebarCollapsed && <span className="text-[10px] font-bold text-on-surface-variant/40 px-3 mb-1 mt-2 uppercase tracking-[0.15em]">Menu</span>}
        <NavItem icon={Home} label="Home" viewId="home" active={currentView === 'home'} />
        <NavItem icon={LayoutGrid} label="Discover" viewId="browse" active={currentView === 'browse'} />
        <NavItem icon={Mic2} label="Radio" viewId="radio" active={currentView === 'radio'} />
        <NavItem icon={Podcast} label="Podcasts" viewId="podcasts" active={currentView === 'podcasts'} />

        {!isSidebarCollapsed && <span className="text-[10px] font-bold text-on-surface-variant/40 px-3 mb-1 mt-6 uppercase tracking-[0.15em]">Library</span>}
        {isSidebarCollapsed && <div className="h-6" />}
        <NavItem icon={Clock} label="Recently Added" viewId="recent" active={currentView === 'recent'} />
        <NavItem icon={User} label="Artists" viewId="artists" active={currentView === 'artists'} />
        <NavItem icon={Disc3} label="Albums" viewId="albums" active={currentView === 'albums'} />
        <NavItem icon={Music} label="Songs" viewId="library" active={currentView === 'library'} />
        
        {/* Playlists */}
        {!isSidebarCollapsed && <span className="text-[10px] font-bold text-on-surface-variant/40 px-3 mb-1 mt-6 uppercase tracking-[0.15em]">Playlists</span>}
        <div className={`flex items-center pb-2 mt-2 group cursor-pointer ${isSidebarCollapsed ? 'justify-center' : 'px-3'}`} onClick={handleNewPlaylist}>
            <button className={`flex items-center gap-3 text-on-surface-variant hover:text-white transition-colors text-sm w-full ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <Plus size={isSidebarCollapsed ? 20 : 16} />
              {!isSidebarCollapsed && <span>New Playlist</span>}
            </button>
        </div>
        {playlists && playlists.map(playlist => (
            <NavItem key={playlist.id} icon={ListMusic} label={playlist.name} viewId={`playlist-${playlist.id}`} active={currentView === `playlist-${playlist.id}`} />
        ))}
      </nav>

      {/* Footer Settings */}
      <div className={`flex items-center pt-4 mt-auto border-t border-white/5 ${isSidebarCollapsed ? 'flex-col gap-4 justify-center' : 'justify-between px-4'}`}>
        <button title="Settings" className="text-on-surface-variant/50 hover:text-white transition-colors"><Settings size={18} /></button>
        <button title="Help" className="text-on-surface-variant/50 hover:text-white transition-colors"><HelpCircle size={18} /></button>
      </div>
      <input type="file" ref={fallbackInputRef} onChange={handleFallbackSelect} webkitdirectory="true" directory="true" multiple className="hidden" />
    </aside>
  );
}