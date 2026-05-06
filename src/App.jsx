import React, { useState, useRef, useEffect } from 'react';
import { FolderDown, Palette } from 'lucide-react';
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
import { downloadFolderStructure } from './utils/treeGenerator';

export default function App() {
  const { currentView, setLibrary, setView, toggleTheme, currentTheme, isSidebarCollapsed } = usePlayerStore();
  
  useKeyboardShortcuts();

  // Apply Theme to Document HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });
  const dragCounter = useRef(0);

  const handleDragEnter = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.types && e.dataTransfer.types.includes('Files')) {
      dragCounter.current += 1; setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.types && e.dataTransfer.types.includes('Files')) {
      dragCounter.current -= 1;
      if (dragCounter.current === 0) setIsDragging(false);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

  const handleDrop = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false); dragCounter.current = 0;
    if (!e.dataTransfer.items || e.dataTransfer.items.length === 0) return;
    
    setIsProcessing(true);
    setScanProgress({ current: 0, total: 0 });
    
    try {
      // 1. Read all files (Now safely handles > 100 files!)
      const rawFiles = await extractFilesFromDrop(e.dataTransfer.items);
      
      // 2. Generate and automatically download the folder structure tree
      downloadFolderStructure(rawFiles, "Supermix Library");
      
      // 3. Parse Metadata for the UI
      const { songs, albums } = await parseLocalFolder(rawFiles, (current, total) => {
        setScanProgress({ current, total });
      });
      
      setLibrary(songs, albums);
      setView('library');
    } catch (error) {
      console.error("Failed to parse dropped files:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="w-full h-screen flex flex-col relative z-0"
      onDragEnter={handleDragEnter} onDragOver={handleDragOver}
      onDragLeave={handleDragLeave} onDrop={handleDrop}
    >
      <AmbientBackground />

      {/* Top Navigation Bar - Adjusts width based on sidebar state */}
      <nav className={`fixed top-0 right-0 h-16 bg-surface/50 backdrop-blur-xl flex justify-between items-center px-8 z-40 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-[calc(100%-80px)]' : 'w-[calc(100%-260px)]'}`}>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Apple Music Pro</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all text-on-surface-variant hover:text-white group"
          >
            <Palette size={18} />
            <span className="text-sm font-semibold hidden md:inline">Theme</span>
          </button>
          <button className="bg-primary-container text-white text-sm font-bold px-6 py-2 rounded-full hover:bg-primary-container/90 transition-colors shadow-lg shadow-primary-container/20">
            Subscribe
          </button>
        </div>
      </nav>

      {/* Main Layout Wrapper */}
      <div className="flex flex-1 h-[calc(100vh-88px)] w-full relative z-10 pt-16">
        <Sidebar />
        
        {/* Main Content Area - Adjusts margin based on sidebar state & robust routing */}
        <main className={`flex-1 h-full overflow-y-auto custom-scrollbar px-8 pb-32 relative z-10 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-[260px]'}`}>
          {(() => {
            // Safety check: If currentView is lost, default to home
            if (!currentView) return <HomeView />;

            if (['home', 'browse', 'radio'].includes(currentView)) {
              return <HomeView />;
            }
            if (currentView === 'library') {
              return <LibraryView />;
            }
            if (currentView === 'album') {
              const { selectedAlbum } = usePlayerStore.getState();
              if (!selectedAlbum) return <LibraryView />; 
              return <AlbumDetailView />;
            }
            // Safety check: Ensure it's a string before calling startsWith
            if (typeof currentView === 'string' && currentView.startsWith('playlist-')) {
              return <PlaylistView playlistId={currentView.split('-')[1]} />;
            }

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

      {/* Drag & Drop Overlays */}
      {isDragging && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md border-4 border-dashed border-primary-container m-4 rounded-2xl flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200">
          <div className="bg-primary-container/20 p-8 rounded-full mb-6"><FolderDown size={80} className="text-primary-container" /></div>
          <h2 className="text-4xl font-bold text-white mb-2">Drop Music Here</h2>
          <p className="text-on-surface-variant text-lg">We'll automatically scan for audio files and artwork.</p>
        </div>
      )}

      {/* Processing / Scanning Overlay with Live Progress */}
      {isProcessing && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="w-16 h-16 border-4 border-white/10 border-t-primary-container rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(var(--color-primary-container),0.5)]"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Library...</h2>
          
          {/* Live Progress Tracker */}
          {scanProgress.total > 0 ? (
            <>
              <p className="text-on-surface-variant text-sm font-medium mb-4">
                Processed {scanProgress.current.toLocaleString()} of {scanProgress.total.toLocaleString()} tracks
              </p>
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-container transition-all duration-200" 
                  style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-on-surface-variant text-sm font-medium">Reading folder structure...</p>
          )}
        </div>
      )}
    </div>
  );
}