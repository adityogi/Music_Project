import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, ListMusic } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useMediaSession } from '../../hooks/useMediaSession';
import { formatTime } from '../../utils/timeFormat';
import LCDVisualizer from '../ui/LCDVisualizer';

export default function PlayerBar() {
  const { currentSong, isPlaying, playNext, playPrev, togglePlay, volume, setVolume, isQueueOpen, toggleQueue } = usePlayerStore();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useMediaSession({ currentSong, audioRef, playNext, playPrev, togglePlay, setProgress });

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.log("Waiting for user interaction:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  return (
    <header className="h-16 bg-[#2c2c2e] border-b border-apple-border flex items-center justify-between px-4 z-50 shrink-0 w-full">
      <audio 
        ref={audioRef} 
        src={currentSong?.url}
        onTimeUpdate={() => setProgress(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={playNext}
        onCanPlay={() => { if (isPlaying) audioRef.current.play(); }}
      />
      
      {/* Left Controls */}
      <div className="w-1/4 flex items-center space-x-5 pl-4">
        <button onClick={playPrev} className="text-apple-muted hover:text-white transition">
          <SkipBack className="w-5 h-5 shrink-0 fill-current" />
        </button>
        <button onClick={togglePlay} className="text-apple-muted hover:text-white transition">
          {isPlaying ? <Pause className="w-6 h-6 shrink-0 fill-current" /> : <Play className="w-6 h-6 shrink-0 fill-current" />}
        </button>
        <button onClick={playNext} className="text-apple-muted hover:text-white transition">
          <SkipForward className="w-5 h-5 shrink-0 fill-current" />
        </button>
      </div>

      {/* Center LCD */}
      <div className="flex-1 max-w-md mx-4 h-12 bg-apple-bg border border-apple-border rounded flex flex-col justify-center relative shadow-inner group overflow-hidden">
        
        {/* Live Audio Visualizer Canvas */}
        <LCDVisualizer audioRef={audioRef} />

        {currentSong ? (
          <>
            <div className="flex items-center justify-between px-3 w-full pb-1 h-full relative z-10 pointer-events-none">
              <div 
                className="w-8 h-8 rounded-sm bg-cover bg-center shrink-0 shadow-sm border border-apple-border/50 mr-2 pointer-events-auto"
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
            
            {/* Scrubber Bar */}
            <div className="absolute bottom-0 left-0 h-[3px] bg-apple-border w-full group-hover:h-[5px] transition-all z-20 rounded-b">
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
          <div className="w-full text-center text-apple-muted text-xs font-medium flex items-center justify-center gap-2 h-full relative z-10">
            <Music className="w-3 h-3 shrink-0" /> Apple Music
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="w-1/4 flex items-center justify-end gap-4 pr-4">
        <button 
          onClick={toggleQueue} 
          className={`transition ${isQueueOpen ? 'text-apple-red' : 'text-apple-muted hover:text-white'}`}
        >
          <ListMusic className="w-5 h-5 shrink-0" />
        </button>
        <Volume2 className="w-4 h-4 text-apple-muted shrink-0" />
        <input 
          type="range" min="0" max="1" step="0.01" value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1.5 bg-apple-border rounded-lg appearance-none cursor-pointer accent-white shrink-0"
        />
      </div>
    </header>
  );
}