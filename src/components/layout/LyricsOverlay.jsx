import React from 'react';
import { X, Mic2, Maximize2 } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function LyricsOverlay() {
  const { isLyricsOpen, toggleLyrics, currentSong, currentLyrics } = usePlayerStore();

  if (!isLyricsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-300 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-8 bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-2xl">
             {currentSong?.coverUrl ? (
               <img src={currentSong.coverUrl} alt="Cover" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-surface-container-high" />
             )}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{currentSong?.title || 'No Song Playing'}</h2>
            <p className="text-lg font-semibold text-primary-container">{currentSong?.artist || 'Unknown Artist'}</p>
          </div>
        </div>
        
        <button 
          onClick={toggleLyrics}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-md"
        >
          <X size={24} />
        </button>
      </div>

      {/* Lyrics Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 md:px-32 py-12 flex flex-col pb-[120px]">
        {currentLyrics && currentLyrics.length > 0 ? (
          currentLyrics.map((line, index) => (
            <p 
              key={index}
              className={`text-4xl md:text-5xl font-bold mb-8 transition-all duration-300 ${
                index === 0 ? 'text-white scale-105 origin-left' : 'text-white/30 hover:text-white/60 cursor-pointer'
              }`}
            >
              {line.text}
            </p>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto opacity-50">
             <Mic2 size={80} className="text-white mb-8 opacity-20" />
             <h3 className="text-3xl font-bold text-white mb-4">No Lyrics Found</h3>
             <p className="text-xl text-on-surface-variant">
               Drag and drop a .lrc file matching this song onto the player to instantly sync lyrics.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}