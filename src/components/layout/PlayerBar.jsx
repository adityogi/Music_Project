import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Mic2, SlidersHorizontal, ListMusic, Shuffle, Repeat, Heart } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useMediaSession } from '../../hooks/useMediaSession';
import { formatTime } from '../../utils/timeFormat';
import LCDVisualizer from '../ui/LCDVisualizer';

export default function PlayerBar() {
  const { 
    currentSong, isPlaying, playNext, playPrev, togglePlay, 
    volume, setVolume, isQueueOpen, toggleQueue, 
    isLyricsOpen, toggleLyrics, isEqOpen, toggleEq
  } = usePlayerStore();
  
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
    <div className="fixed bottom-0 left-0 w-full h-[player-height] z-50 bg-[#121317]/90 backdrop-blur-3xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between px-8">
      <audio 
        ref={audioRef} 
        src={currentSong?.url}
        onTimeUpdate={() => setProgress(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={playNext}
        onCanPlay={() => { if (isPlaying) audioRef.current.play(); }}
      />

      {/* Left: Now Playing Info */}
      <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
        {currentSong && (
          <>
            <div className="w-14 h-14 rounded-md overflow-hidden bg-surface-container border border-white/10 flex-shrink-0 shadow-lg relative">
               <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentSong.coverUrl})`, backgroundColor: '#292a2e' }} />
            </div>
            <div className="flex flex-col truncate">
              <h4 className="text-[15px] text-white font-bold truncate leading-tight mb-1">{currentSong.title}</h4>
              <p className="text-[11px] font-semibold tracking-wide uppercase text-on-surface-variant truncate">{currentSong.artist}</p>
            </div>
            <button className="ml-4 text-on-surface-variant hover:text-primary-container transition-colors"><Heart size={20} /></button>
          </>
        )}
      </div>

      {/* Center: Controls & Scrubber */}
      <div className="flex-1 max-w-2xl mx-8 flex flex-col items-center justify-center gap-2 relative h-full">
        {/* Background Visualizer Layer */}
        <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none z-0 mix-blend-screen scale-y-50">
           <LCDVisualizer audioRef={audioRef} />
        </div>
        
        <div className="flex items-center gap-6 z-10 pt-2">
          <button className="text-on-surface-variant hover:text-white transition-colors"><Shuffle size={20} /></button>
          <button onClick={playPrev} className="text-white hover:text-primary-container transition-transform hover:scale-110 active:scale-95"><SkipBack size={28} className="fill-current" /></button>
          <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg">
            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
          </button>
          <button onClick={playNext} className="text-white hover:text-primary-container transition-transform hover:scale-110 active:scale-95"><SkipForward size={28} className="fill-current" /></button>
          <button className="text-on-surface-variant hover:text-white transition-colors"><Repeat size={20} /></button>
        </div>
        
        <div className="w-full flex items-center gap-3 group text-[11px] font-medium text-on-surface-variant z-10">
          <span className="w-8 text-right">{formatTime(progress)}</span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full relative cursor-pointer group-hover:h-2 transition-all">
            <div className="absolute top-0 left-0 h-full bg-primary-container transition-colors rounded-full" style={{ width: `${(progress / (duration || 1)) * 100}%` }}></div>
            <input 
              type="range" min="0" max={duration || 0} step="0.1" 
              value={progress} onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="w-8">-{formatTime(duration - progress)}</span>
        </div>
      </div>

      {/* Right: Toggles & Volume */}
      <div className="flex items-center justify-end gap-5 w-1/3 min-w-[200px] text-on-surface-variant">
        <button onClick={toggleLyrics} className={`transition-colors ${isLyricsOpen ? 'text-primary-container' : 'hover:text-white'}`}><Mic2 size={20} /></button>
        <button onClick={toggleEq} className={`transition-colors ${isEqOpen ? 'text-primary-container' : 'hover:text-white'}`}><SlidersHorizontal size={20} /></button>
        <button onClick={toggleQueue} className={`transition-colors ${isQueueOpen ? 'text-primary-container' : 'hover:text-white'}`}><ListMusic size={20} /></button>
        
        <div className="flex items-center gap-2 group cursor-pointer w-24">
          <Volume2 size={20} className="group-hover:text-white transition-colors" />
          <div className="flex-1 h-1 bg-white/10 rounded-full relative group-hover:h-1.5 transition-all">
            <div className="absolute top-0 left-0 h-full bg-white/80 group-hover:bg-primary-container transition-colors rounded-full" style={{ width: `${volume * 100}%` }}></div>
             <input 
              type="range" min="0" max="1" step="0.01" value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}