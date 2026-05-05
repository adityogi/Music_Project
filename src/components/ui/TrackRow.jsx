import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function TrackRow({ song, index, albumSongs }) {
  const { currentSong, isPlaying, playSong } = usePlayerStore();
  const isCurrent = currentSong?.id === song.id;

  return (
    <div 
      onDoubleClick={() => playSong(song, albumSongs)}
      className={`flex items-center px-4 py-3 rounded-md cursor-pointer group transition-colors border-b border-apple-border/50 last:border-0 ${isCurrent ? 'bg-apple-red/20' : 'hover:bg-apple-border/30'}`}
    >
      <div className="w-8 flex justify-center text-apple-muted text-sm relative">
         <span className={isCurrent ? 'text-apple-red opacity-0' : 'group-hover:opacity-0'}>{index + 1}</span>
         <button 
           onClick={(e) => { e.stopPropagation(); playSong(song, albumSongs); }}
           className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 ${isCurrent ? 'text-apple-red opacity-100' : 'text-apple-text'}`}
         >
           {isCurrent && isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
         </button>
      </div>
      <span className={`flex-1 text-sm pl-4 truncate ${isCurrent ? 'text-apple-red' : 'text-apple-text'}`}>
        {song.title}
      </span>
    </div>
  );
}