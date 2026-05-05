import React, { useEffect, useRef, useState } from 'react';
import { FileText, X } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { parseLRC } from '../../utils/lyricParser';

export default function LyricsOverlay({ audioRef }) {
  const { isLyricsOpen, toggleLyrics, currentSong, currentLyrics, setLyrics } = usePlayerStore();
  const [currentTime, setCurrentTime] = useState(0);
  const containerRef = useRef(null);

  // Sync to audio time via requestAnimationFrame for buttery smooth tracking
  useEffect(() => {
    if (!isLyricsOpen || !audioRef.current) return;
    
    let animationFrame;
    const updateTime = () => {
      setCurrentTime(audioRef.current.currentTime);
      animationFrame = requestAnimationFrame(updateTime);
    };
    
    updateTime();
    return () => cancelAnimationFrame(animationFrame);
  }, [isLyricsOpen, audioRef]);

  // Handle dropping an .lrc file
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.lrc') || file.name.endsWith('.txt'))) {
      const text = await file.text();
      setLyrics(parseLRC(text));
    }
  };

  if (!isLyricsOpen) return null;

  // Find the active lyric line
  const activeIndex = currentLyrics.findIndex((lyric, i) => {
    const nextLyric = currentLyrics[i + 1];
    return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
  });

  return (
    <div 
      className="absolute inset-0 z-[60] flex flex-col bg-black overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Massive ambient blurred background */}
      {currentSong?.coverUrl && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-125 blur-[100px]"
          style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
        />
      )}
      
      {/* Overlay gradient to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 to-black/80 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 p-8 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-md bg-cover bg-center shadow-2xl"
            style={{ backgroundImage: currentSong?.coverUrl ? `url(${currentSong.coverUrl})` : 'none', backgroundColor: '#3a3a3c' }}
          />
          <div>
            <h2 className="text-2xl font-bold text-white shadow-black drop-shadow-md">{currentSong?.title || 'No Song Playing'}</h2>
            <p className="text-apple-muted font-medium shadow-black drop-shadow-md">{currentSong?.artist}</p>
          </div>
        </div>
        <button onClick={toggleLyrics} className="p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition">
          <X size={24} />
        </button>
      </div>

      {/* Lyrics Scroller */}
      <div className="relative z-10 flex-1 overflow-y-auto px-8 pb-32 pt-20 flex flex-col items-center hide-scrollbar" ref={containerRef}>
        {currentLyrics.length > 0 ? (
          <div className="max-w-3xl w-full space-y-8 pb-[50vh]">
            {currentLyrics.map((lyric, index) => {
              const isActive = index === activeIndex;
              const isPassed = index < activeIndex;
              
              // Auto-scroll logic (rough implementation)
              if (isActive && containerRef.current) {
                const element = document.getElementById(`lyric-${index}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }

              return (
                <p 
                  key={index} 
                  id={`lyric-${index}`}
                  className={`text-4xl md:text-5xl font-bold transition-all duration-500 ease-out origin-left cursor-pointer hover:text-white
                    ${isActive ? 'text-white scale-105 opacity-100 blur-none' : 
                      isPassed ? 'text-white/40 scale-100 blur-[1px]' : 'text-white/20 scale-100 blur-[2px]'}`
                  }
                  onClick={() => { if (audioRef.current) audioRef.current.currentTime = lyric.time; }}
                >
                  {lyric.text}
                </p>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/50 animate-pulse">
            <FileText size={64} className="mb-4 opacity-50" />
            <h3 className="text-2xl font-bold">Drop an .lrc file here</h3>
            <p className="mt-2 text-lg">To sync lyrics with this track</p>
          </div>
        )}
      </div>
    </div>
  );
}