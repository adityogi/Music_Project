import React, { useState, useRef, useEffect } from 'react';
import { FolderDown, Palette, Search, RefreshCw, Mic2, SlidersHorizontal, ListMusic } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import PlayerBar from './components/layout/PlayerBar';
import QueueDrawer from './components/layout/QueueDrawer';
import HomeView from './views/HomeView';
import LibraryView from './views/LibraryView';
import AlbumDetailView from './views/AlbumDetailView';
import PlaylistView from './views/PlaylistView';
import AmbientBackground from './components/layout/AmbientBackground';
import LyricsOverlay from './components/layout/LyricsOverlay';
import EqualizerModal from './components/layout/EqualizerModal';
import ContextMenu from './components/ui/ContextMenu';
import ThemeModal from './components/layout/ThemeModal';
import { usePlayerStore } from './store/usePlayerStore';
import { extractFilesFromDrop } from './utils/dropReader';
import { parseLocalFolder } from './utils/musicParser';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  const { currentView, setLibrary, setView, toggleTheme, currentTheme, isSidebarCollapsed, searchQuery, setSearchQuery, toggleLyrics, toggleEq, toggleQueue } = usePlayerStore();
  
  useKeyboardShortcuts();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.types && e.dataTransfer.types.includes('Files')) { dragCounter.current += 1; setIsDragging(true); } };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.types && e.dataTransfer.types.includes('Files')) { dragCounter.current -= 1; if (dragCounter.current === 0) setIsDragging(false); } };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

  const handleDrop = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false); dragCounter.current = 0;
    if (!e.dataTransfer.items || e.dataTransfer.items.length === 0) return;
    setIsProcessing(true);
    try {
      const rawFiles = await extractFilesFromDrop(e.dataTransfer.items);
      const { songs, albums } = await parseLocalFolder(rawFiles);
      setLibrary(songs, albums);
      setView('library');
    } catch (error) { console.error("Failed to parse dropped files:", error); } 
    finally { setIsProcessing(false); }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== '' && currentView !== 'library') setView('library');
  };

  return (
    <div className="w-full h-screen flex flex-col relative z-0" onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <AmbientBackground />

      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 right-0 h-[72px] bg-surface/80 backdrop-blur-xl flex justify-between items-center px-8 z-40 border-b border-white/5 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-[calc(100%-80px)]' : 'w-[calc(100%-260px)]'}`}>
        
        {/* Title */}
        <div className="flex items-center gap-4 min-w-[150px]">
          <h1 className="text-xl font-bold text-white tracking-tight">Apple Music Pro</h1>
        </div>

        {/* Center Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative flex items-center w-full h-10 rounded-full bg-surface-container border border-white/5 focus-within:border-white/20 focus-within:bg-white/5 transition-colors">
            <Search className="absolute left-4 text-on-surface-variant/60" size={18} />
            <input 
              type="text" 
              placeholder="Search local library..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-full bg-transparent border-none text-white text-sm pl-12 pr-4 focus:ring-0 placeholder:text-on-surface-variant/40 outline-none" 
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-container text-primary-container hover:bg-primary-container/10 transition-colors text-xs font-bold tracking-widest uppercase">
            <RefreshCw size={14} /> Sync Library
          </button>
          
          <div className="hidden md:flex items-center gap-2 text-on-surface-variant/80 border-r border-white/10 pr-4 mr-2">
            <button onClick={toggleLyrics} className="p-2 hover:text-white transition-colors rounded-full hover:bg-white/5"><Mic2 size={18} /></button>
            <button onClick={toggleEq} className="p-2 hover:text-white transition-colors rounded-full hover:bg-white/5"><SlidersHorizontal size={18} /></button>
            <button onClick={toggleQueue} className="p-2 hover:text-white transition-colors rounded-full hover:bg-white/5"><ListMusic size={18} /></button>
          </div>

          <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-on-surface-variant hover:text-white group">
            <Palette size={14} />
            <span className="text-xs font-semibold">Theme</span>
          </button>
          
          <button className="bg-primary-container text-white text-xs font-bold tracking-widest uppercase px-6 py-2 rounded-full hover:bg-primary-container/90 transition-colors shadow-lg shadow-primary-container/20">
            Subscribe
          </button>
        </div>
      </nav>

      {/* Main Layout Wrapper */}
      <div className="flex flex-1 h-[calc(100vh-88px)] w-full relative z-10 pt-[72px]">
        <Sidebar />
        {/* Main Content Area */}
        <main className={`flex-1 h-full overflow-y-auto custom-scrollbar px-8 pb-32 relative z-10 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-[260px]'}`}>
          {(() => {
            // 1. Map Home, Browse, and Radio to the HomeView (since it has your discovery content)
            if (['home', 'browse', 'radio'].includes(currentView)) {
              return <HomeView />;
            }
            
            // 2. Standard Library
            if (currentView === 'library') {
              return <LibraryView />;
            }
            
            // 3. Album View with a safety fallback
            if (currentView === 'album') {
              const { selectedAlbum } = usePlayerStore.getState();
              // If refreshed and album data is lost, fallback to Library
              if (!selectedAlbum) return <LibraryView />; 
              return <AlbumDetailView />;
            }
            
            // 4. Playlists
            if (currentView.startsWith('playlist-')) {
              return <PlaylistView playlistId={currentView.split('-')[1]} />;
            }

            // 5. Ultimate Fallback (prevents blank screens if view is completely unknown)
            return <HomeView />;
          })()}
        </main>
      </div>

      <QueueDrawer />
      <LyricsOverlay />
      <EqualizerModal />
      <ContextMenu />
      <ThemeModal />
      <PlayerBar />

      {isDragging && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md border-4 border-dashed border-primary-container m-4 rounded-2xl flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200">
          <div className="bg-primary-container/20 p-8 rounded-full mb-6"><FolderDown size={80} className="text-primary-container" /></div>
          <h2 className="text-4xl font-bold text-white mb-2">Drop Music Here</h2>
        </div>
      )}

      {isProcessing && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-primary-container rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-white">Scanning Library...</h2>
        </div>
      )}
    </div>
  );
}