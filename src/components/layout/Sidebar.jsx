import React, { useRef } from 'react';
import { Home, LayoutGrid, Mic2, FolderOpen, Music, Search } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { parseLocalFolder } from '../../utils/musicParser';

export default function Sidebar() {
  const { currentView, setView, setLibrary } = usePlayerStore();
  const fileInputRef = useRef(null);

  const handleFolderSelect = async (e) => {
    if (!e.target.files.length) return;
    const { songs, albums } = await parseLocalFolder(e.target.files);
    setLibrary(songs, albums);
    setView('library');
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
    <aside className="w-60 bg-apple-panel border-r border-apple-border flex flex-col py-4 shrink-0">
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1.5 text-apple-muted" size={16} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-apple-bg border border-apple-border rounded px-8 py-1 text-sm text-white placeholder-apple-muted focus:outline-none focus:border-apple-red transition"
          />
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 pb-2 text-xs font-semibold text-apple-muted mt-4">Apple Music</div>
        <NavItem icon={Home} label="Home" viewId="home" active={currentView === 'home'} />
        <NavItem icon={LayoutGrid} label="Browse" viewId="browse" active={currentView === 'browse'} />
        <NavItem icon={Mic2} label="Radio" viewId="radio" active={currentView === 'radio'} />

        <div className="px-3 pb-2 text-xs font-semibold text-apple-muted mt-8">Library</div>
        <NavItem icon={Music} label="Local Albums" viewId="library" active={currentView === 'library' || currentView === 'album'} />
        
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-md text-sm font-medium transition text-apple-muted hover:bg-apple-border/30 mt-2"
        >
          <FolderOpen size={18} className="text-apple-muted" />
          <span>Open Folder...</span>
        </button>
        <input 
          type="file" ref={fileInputRef} onChange={handleFolderSelect} 
          webkitdirectory="true" directory="true" multiple className="hidden" 
        />
      </nav>
    </aside>
  );
}