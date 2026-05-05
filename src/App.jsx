import React, { useState, useRef } from 'react';
import { FolderDown } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import PlayerBar from './components/layout/PlayerBar';
import QueueDrawer from './components/layout/QueueDrawer';
import HomeView from './views/HomeView';
import LibraryView from './views/LibraryView';
import AlbumDetailView from './views/AlbumDetailView';
import { usePlayerStore } from './store/usePlayerStore';
import { extractFilesFromDrop } from './utils/dropReader';
import { parseLocalFolder } from './utils/musicParser';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import LyricsOverlay from './components/layout/LyricsOverlay';
import AmbientBackground from './components/layout/AmbientBackground';

export default function App() {
  const { currentView, setLibrary, setView } = usePlayerStore();
  useKeyboardShortcuts();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dragCounter = useRef(0);

  // --- Drag & Drop Handlers ---
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // THE FIX: Only trigger the overlay if the user is dragging files from the OS
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
    // onDragOver must be prevented to allow a drop
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0; // Reset the counter
    
    if (!e.dataTransfer.items || e.dataTransfer.items.length === 0) return;

    setIsProcessing(true); // Show a loading state if parsing a massive folder
    
    try {
      // 1. Unpack the dropped folder
      const rawFiles = await extractFilesFromDrop(e.dataTransfer.items);
      
      // 2. Pass it to our existing ID3 parser
      const { songs, albums } = await parseLocalFolder(rawFiles);
      
      // 3. Update the global state
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
      className="w-full h-full flex flex-col font-sans overflow-hidden select-none relative bg-transparent"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AmbientBackground />
      <PlayerBar />
      <div className="flex flex-1 overflow-hidden relative w-full">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto relative p-8 pb-32">
          {currentView === 'home' && <HomeView />}
          {currentView === 'library' && <LibraryView />}
          {currentView === 'album' && <AlbumDetailView />}
        </main>

        <QueueDrawer />
        <LyricsOverlay/>
      </div>

      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md border-4 border-dashed border-apple-red m-4 rounded-2xl flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200">
          <div className="bg-apple-red/20 p-8 rounded-full mb-6">
            <FolderDown size={80} className="text-apple-red" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Drop Music Here</h2>
          <p className="text-apple-muted text-lg">We'll automatically scan for audio files and artwork.</p>
        </div>
      )}

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-apple-border border-t-apple-red rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-white">Scanning Library...</h2>
          <p className="text-apple-muted text-sm">Reading ID3 tags and extracting artwork.</p>
        </div>
      )}
    </div>
  );
}