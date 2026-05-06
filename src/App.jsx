import React, { useState, useRef, useEffect } from 'react';
import { FolderDown, Palette, HardDrive, Search } from 'lucide-react';
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
import { downloadFolderStructure } from './utils/treeGenerator';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  const { currentView, setLibrary, setView, toggleTheme, currentTheme, isSidebarCollapsed } = usePlayerStore();
  
  useKeyboardShortcuts();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReading, setIsReading] = useState(false); // NEW: Pre-scan state
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
    
    setIsReading(true); // Start the first loading phase
    setScanProgress({ current: 0, total: 0 });
    
    try {
      // 1. Recursive Crawl (Bypass 100 file limit)
      const rawFiles = await extractFilesFromDrop(e.dataTransfer.items);
      
      setIsReading(false);
      setIsProcessing(true); // Move to Metadata analysis phase
      
      // 2. Download Structure
      downloadFolderStructure(rawFiles, "Supermix Library");
      
      // 3. Optimized Parse (Progress Tracking)
      const { songs, albums } = await parseLocalFolder(rawFiles, (current, total) => {
        setScanProgress({ current, total });
      });
      
      setLibrary(songs, albums);
      setView('library');
    } catch (error) {
      console.error("Upload error:", error);
      setIsReading(false);
      setIsProcessing(false);
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

      <nav className={`fixed top-0 right-0 h-16 bg-surface/50 backdrop-blur-xl flex justify-between items-center px-8 z-40 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-[calc(100%-80px)]' : 'w-[calc(100%-260px)]'}`}>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Apple Music Pro</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all text-on-surface-variant hover:text-white">
            <Palette size={18} />
            <span className="text-sm font-semibold hidden md:inline">Theme</span>
          </button>
          <button className="bg-primary-container text-white text-sm font-bold px-6 py-2 rounded-full hover:bg-primary-container/90 transition-colors shadow-lg">
            Subscribe
          </button>
        </div>
      </nav>

      <div className="flex flex-1 h-[calc(100vh-88px)] w-full relative z-10 pt-16">
        <Sidebar />
        <main className={`flex-1 h-full overflow-y-auto custom-scrollbar px-8 pb-32 relative z-10 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-[260px]'}`}>
          {(() => {
            if (!currentView) return <HomeView />;
            if (['home', 'browse', 'radio'].includes(currentView)) return <HomeView />;
            if (currentView === 'library') return <LibraryView />;
            if (currentView === 'album') return <AlbumDetailView />;
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

      {/* --- LOADING SCREENS --- */}

      {/* Phase 1: Reading Folder Structure */}
      {isReading && (
        <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="relative mb-8">
            <HardDrive size={80} className="text-primary-container animate-pulse" />
            <Search size={32} className="text-white absolute -bottom-2 -right-2 animate-bounce" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Reading Supermix...</h2>
          <p className="text-on-surface-variant font-medium text-center max-w-md px-6">
            Connecting to your local file system. This may take a moment for 92GB libraries.
          </p>
        </div>
      )}

      {/* Phase 2: Metadata Analysis */}
      {isProcessing && (
        <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-20 h-20 border-4 border-white/5 border-t-primary-container rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(var(--color-primary-container),0.4)]"></div>
          <h2 className="text-3xl font-black text-white mb-2">Optimizing Library</h2>
          
          <div className="mt-4 flex flex-col items-center w-full max-w-sm">
            <div className="flex justify-between w-full mb-2 px-1">
              <span className="text-xs font-bold text-primary-container uppercase tracking-tighter">Parsing Metadata</span>
              <span className="text-xs font-bold text-white uppercase">{Math.round((scanProgress.current / scanProgress.total) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-primary-container shadow-[0_0_10px_#ff5357] transition-all duration-300" 
                style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }}
              />
            </div>
            <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest opacity-60">
              {scanProgress.current.toLocaleString()} / {scanProgress.total.toLocaleString()} tracks processed
            </p>
          </div>
        </div>
      )}
    </div>
  );
}