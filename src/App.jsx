import React, { useState, useRef } from 'react';
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
import { usePlayerStore } from './store/usePlayerStore';
import { extractFilesFromDrop } from './utils/dropReader';
import { parseLocalFolder } from './utils/musicParser';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  const { currentView, setLibrary, setView } = usePlayerStore();
  
  useKeyboardShortcuts();

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types && e.dataTransfer.types.includes('Files')) {
      dragCounter.current += 1;
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types && e.dataTransfer.types.includes('Files')) {
      dragCounter.current -= 1;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (!e.dataTransfer.items || e.dataTransfer.items.length === 0) return;

    setIsProcessing(true);
    
    try {
      const rawFiles = await extractFilesFromDrop(e.dataTransfer.items);
      const { songs, albums } = await parseLocalFolder(rawFiles);
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
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AmbientBackground />

      {/* NEW Top Navigation Bar */}
      <nav className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface/50 backdrop-blur-xl flex justify-between items-center px-margin-safe z-40">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Apple Music Pro</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all text-on-surface-variant hover:text-white group">
            <Palette size={18} />
            <span className="text-sm font-semibold hidden md:inline">Theme</span>
          </button>
          <button className="bg-primary-container text-white text-sm font-bold px-6 py-2 rounded-full hover:bg-primary-container/90 transition-colors shadow-[0_0_15px_rgba(255,83,87,0.3)]">
            Subscribe
          </button>
        </div>
      </nav>

      {/* Main Fluid Layout */}
      <div className="flex flex-1 h-[calc(100vh-88px)] w-full relative z-10 pt-16">
        <Sidebar />
        
        <main className="flex-1 ml-[sidebar-width] h-full overflow-y-auto custom-scrollbar px-margin-safe pb-32 relative z-10">
          {currentView === 'home' && <HomeView />}
          {currentView === 'library' && <LibraryView />}
          {currentView === 'album' && <AlbumDetailView />}
          {currentView.startsWith('playlist-') && <PlaylistView playlistId={currentView.split('-')[1]} />}
        </main>
      </div>

      <QueueDrawer />
      <LyricsOverlay />
      <EqualizerModal />
      <ContextMenu />
      <PlayerBar />

      {/* Drag & Drop Overlays */}
      {isDragging && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md border-4 border-dashed border-primary-container m-4 rounded-2xl flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200">
          <div className="bg-primary-container/20 p-8 rounded-full mb-6">
            <FolderDown size={80} className="text-primary-container" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Drop Music Here</h2>
          <p className="text-on-surface-variant text-lg">We'll automatically scan for audio files and artwork.</p>
        </div>
      )}

      {isProcessing && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-primary-container rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-white">Scanning Library...</h2>
          <p className="text-on-surface-variant text-sm">Reading tags and extracting artwork.</p>
        </div>
      )}
    </div>
  );
}