import React, { useState, useMemo } from 'react';
import { Play, Disc3, Music, FolderOpen } from 'lucide-react';
import Fuse from 'fuse.js';
import { Virtuoso } from 'react-virtuoso'; // <--- IMPORT THIS
import { usePlayerStore } from '../store/usePlayerStore';

export default function LibraryView() {
  const { library, albums, searchQuery, setView, playSong, currentSong } = usePlayerStore();
  const [activeTab, setActiveTab] = useState('albums');

  // ... keep existing Fuse.js logic exactly as it is ...

  return (
    <div className="animate-in fade-in duration-500 pt-8 pb-12 h-full flex flex-col">
      {/* ... keep header and empty states exactly as they are ... */}

      {/* Albums Grid View (Keep as is, grids are usually fine unless you have 5000+ albums) */}
      
      {/* Optimized Songs List View */}
      {activeTab === 'songs' && filteredSongs.length > 0 && (
        <div className="flex-1 min-h-[500px]"> {/* Container must have height for Virtuoso */}
          <Virtuoso
            style={{ height: '100%', width: '100%' }}
            totalCount={filteredSongs.length}
            itemContent={(index) => {
              const song = filteredSongs[index];
              const isCurrentlyPlaying = currentSong?.id === song.id;

              return (
                <div 
                  key={song.id}
                  onDoubleClick={() => playSong(song, filteredSongs)}
                  className={`grid grid-cols-[48px_1fr_1fr_1fr] gap-4 px-4 py-3 rounded-xl transition-colors group items-center cursor-pointer mb-1 ${
                    isCurrentlyPlaying ? 'bg-white/10 border border-white/5' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="text-center text-on-surface-variant group-hover:hidden text-sm">
                    {isCurrentlyPlaying ? <div className="w-2 h-2 rounded-full bg-primary-container mx-auto animate-pulse" /> : index + 1}
                  </div>
                  <button onClick={() => playSong(song, filteredSongs)} className="hidden group-hover:flex justify-center items-center text-white">
                    <Play size={16} className="fill-current" />
                  </button>
                  
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-surface-container border border-white/5">
                      {song.coverUrl ? <img src={song.coverUrl} className="w-full h-full object-cover" alt="cover" /> : <Music size={16} className="text-white/20 m-auto mt-2" />}
                    </div>
                    <span className={`text-sm font-medium truncate ${isCurrentlyPlaying ? 'text-primary-container' : 'text-white'}`}>{song.title || 'Unknown Title'}</span>
                  </div>
                  <div className="text-sm text-on-surface-variant truncate">{song.artist || 'Unknown Artist'}</div>
                  <div className="text-sm text-on-surface-variant truncate">{song.album || 'Unknown Album'}</div>
                </div>
              );
            }}
          />
        </div>
      )}
    </div>
  );
}