import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat, Music } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useMediaSession } from '../../hooks/useMediaSession';

export default function PlayerBar() {
  const { currentSong, isPlaying, playNext, playPrev, togglePlay, volume, setVolume } = usePlayerStore();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useMediaSession({ currentSong, audioRef, playNext, playPrev, togglePlay, setProgress });

  // Safely handle play/pause toggling
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      // The promise catch prevents browser autoplay policy errors from crashing the app
      audioRef.current.play().catch((err) => console.log("Waiting for user interaction to play:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Handle the volume changes
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Scrubbing logic
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  // Helper to make time look like 1:05
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <header className="h-16 bg-[#2c2c2e] border-b border-apple-border flex items-center justify-between px-4 z-20 shrink-0">
      
      {/* 
        The onCanPlay event is crucial here: it ensures that when a new song is loaded, 
        we don't try to play it until the browser actually has the audio data ready.
      */}
      <audio 
        ref={audioRef} 
        src={currentSong?.url}
        onTimeUpdate={() => setProgress(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={playNext}
        onCanPlay={() => { if (isPlaying) audioRef.current.play(); }}
      />
      
      {/* Left Controls */}
      <div className="w-1/4 flex items-center space-x-4 ml-16">
        <button onClick={playPrev} className="text-apple-muted hover:text-white transition">
          <SkipBack size={20} fill="currentColor" />
        </button>
        <button onClick={togglePlay} className="text-apple-muted hover:text-white transition">
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
        <button onClick={playNext} className="text-apple-muted hover:text-white transition">
          <SkipForward size={20} fill="currentColor" />
        </button>
      </div>

      {/* Center LCD & Scrub Bar */}
      <div className="flex-1 max-w-md mx-4 h-12 bg-apple-bg border border-apple-border rounded flex flex-col justify-center relative overflow-hidden shadow-inner group">
        {currentSong ? (
          <>
            <div className="flex items-center justify-between px-3 w-full pb-1 h-full">
              {/* Tiny Cover Art */}
              <div 
                className="w-8 h-8 rounded-sm bg-cover bg-center shrink-0 shadow-sm border border-apple-border/50 mr-2"
                style={{ backgroundImage: currentSong.coverUrl ? `url(${currentSong.coverUrl})` : 'none', backgroundColor: '#3a3a3c' }}
              />
              
              <span className="text-[10px] font-medium text-apple-muted w-8 text-left shrink-0">
                {formatTime(progress)}
              </span>
              
              <div className="flex-1 min-w-0 flex flex-col justify-center text-center px-2">
                <span className="text-xs font-semibold text-apple-text truncate">{currentSong.title}</span>
                <span className="text-[10px] text-apple-muted truncate">{currentSong.artist}</span>
              </div>
              
              <span className="text-[10px] font-medium text-apple-muted w-8 text-right shrink-0">
                -{formatTime(duration - progress)}
              </span>
            </div>
            
            {/* Scrub Bar (Same as before) */}
            <div className="absolute bottom-0 left-0 h-[3px] bg-apple-border w-full group-hover:h-[5px] transition-all">
              <div 
                className="absolute top-0 left-0 h-full bg-apple-text group-hover:bg-apple-red pointer-events-none transition-all duration-75 ease-linear" 
                style={{ width: `${(progress / (duration || 1)) * 100}%` }} 
              />
              <input 
                type="range" min="0" max={duration || 0} step="0.1" 
                value={progress} onChange={handleSeek}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </>
        ) : (
          <div className="w-full text-center text-apple-muted text-xs font-medium flex items-center justify-center gap-2 h-full">
            <Music size={12} /> Apple Music
          </div>
        )}
      </div>

      {/* Right Controls (Volume) */}
      <div className="w-1/4 flex items-center justify-end space-x-4">
        <Volume2 size={16} className="text-apple-muted" />
        <input 
          type="range" min="0" max="1" step="0.01" value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1.5 bg-apple-border rounded-lg appearance-none cursor-pointer accent-white"
        />
      </div>
    </header>
  );
}