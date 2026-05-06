import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Mic2, SlidersHorizontal, ListMusic, Shuffle, Repeat, Heart } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useMediaSession } from '../../hooks/useMediaSession';
import { formatTime } from '../../utils/timeFormat';
import LCDVisualizer from '../ui/LCDVisualizer';

export default function PlayerBar() {
  const { currentSong, isPlaying, playNext, playPrev, togglePlay, volume, setVolume, isQueueOpen, toggleQueue, isLyricsOpen, toggleLyrics, isEqOpen, toggleEq } = usePlayerStore();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useMediaSession({ currentSong, audioRef, playNext, playPrev, togglePlay, setProgress });

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(e => console.log(e));
    else audioRef.current.pause();
  }, [isPlaying, currentSong]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) { audioRef.current.currentTime = newTime; setProgress(newTime); }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-[88px] z-50 bg-[#1a1b1f]/95 backdrop-blur-2xl border-t border-white/5 flex items-center justify-between px-6">
      <audio 
        ref={audioRef} src={currentSong?.url}
        onTimeUpdate={() => setProgress(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={playNext}
        onCanPlay={() => { if (isPlaying) audioRef.current.play(); }}
      />

      {/* Left: Controls */}
      <div className="flex items-center gap-5 w-[260px] shrink-0">
        <button className="text-on-surface-variant hover:text-white transition-colors"><Shuffle size={18} /></button>
        <button onClick={playPrev} className="text-on-surface-variant hover:text-white transition-transform active:scale-95"><SkipBack size={24} className="fill-current" /></button>
        <button onClick={togglePlay} className="w-[42px] h-[42px] rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-md">
          {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
        </button>
        <button onClick={playNext} className="text-on-surface-variant hover:text-white transition-transform active:scale-95"><SkipForward size={24} className="fill-current" /></button>
        <button className="text-on-surface-variant hover:text-white transition-colors"><Repeat size={18} /></button>
      </div>

      {/* Center: LCD Scrubber */}
      <div className="flex-1 max-w-[600px] mx-8 relative h-12 bg-[#121317] rounded-full border border-white/5 overflow-hidden flex items-center px-3 group">
        <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none z-0 mix-blend-screen scale-y-50"><LCDVisualizer audioRef={audioRef} /></div>
        
        {currentSong ? (
          <>
            <div className="w-8 h-8 rounded-sm overflow-hidden bg-surface-container shrink-0 z-10">
              {currentSong.coverUrl ? <img src={currentSong.coverUrl} className="w-full h-full object-cover" alt="cover"/> : <div className="w-full h-full bg-white/5" />}
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 z-10 text-[11px] font-medium text-on-surface-variant/80">
              <div className="flex flex-col truncate min-w-[100px] max-w-[200px]">
                <span className="text-white font-bold truncate">{currentSong.title}</span>
                <span className="truncate">{currentSong.artist}</span>
              </div>
              <span className="w-8 text-right shrink-0">{formatTime(progress)}</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full relative cursor-pointer group-hover:h-1.5 transition-all">
                <div className="absolute top-0 left-0 h-full bg-on-surface-variant rounded-full" style={{ width: `${(progress / (duration || 1)) * 100}%` }}></div>
                <input type="range" min="0" max={duration || 0} step="0.1" value={progress} onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <span className="w-8 shrink-0">-{formatTime(duration - progress)}</span>
            </div>
          </>
        ) : (
           <div className="flex-1 text-center text-xs font-semibold text-on-surface-variant/50 uppercase tracking-widest z-10">Apple Music Pro</div>
        )}
      </div>

      {/* Right: Tools & Volume */}
      <div className="flex items-center justify-end gap-5 w-[260px] shrink-0 text-on-surface-variant">
        <button onClick={toggleEq} className={`transition-colors ${isEqOpen ? 'text-primary-container' : 'hover:text-white'}`}><SlidersHorizontal size={18} /></button>
        <button onClick={toggleLyrics} className={`transition-colors ${isLyricsOpen ? 'text-primary-container' : 'hover:text-white'}`}><Mic2 size={18} /></button>
        <button onClick={toggleQueue} className={`transition-colors ${isQueueOpen ? 'text-primary-container' : 'hover:text-white'}`}><ListMusic size={18} /></button>
        
        <div className="flex items-center gap-2 group cursor-pointer w-24">
          <Volume2 size={18} className="group-hover:text-white transition-colors" />
          <div className="flex-1 h-1 bg-white/10 rounded-full relative group-hover:h-1.5 transition-all">
            <div className="absolute top-0 left-0 h-full bg-white/80 group-hover:bg-primary-container transition-colors rounded-full" style={{ width: `${volume * 100}%` }}></div>
             <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}