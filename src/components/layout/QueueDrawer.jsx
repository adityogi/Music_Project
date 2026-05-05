import React from 'react';
import { X, Play, Trash2 } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function QueueDrawer() {
  const { isQueueOpen, toggleQueue, queue, queueIndex, playSong, removeFromQueue, clearQueue } = usePlayerStore();

  if (!isQueueOpen) return null;

  return (
    <div className="absolute top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-apple-panel/95 backdrop-blur-xl border-l border-apple-border shadow-2xl z-30 flex flex-col transform transition-transform animate-in slide-in-from-right-8">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-apple-border">
        <h2 className="text-lg font-bold text-apple-text">Up Next</h2>
        <div className="flex items-center gap-2">
           <button 
            onClick={clearQueue} 
            className="text-apple-muted hover:text-apple-red text-xs font-medium px-2 py-1 bg-apple-bg rounded border border-apple-border transition"
           >
             Clear
           </button>
           <button onClick={toggleQueue} className="text-apple-muted hover:text-white p-1 transition">
             <X size={20} />
           </button>
        </div>
      </div>
      
      {/* Track List */}
      <div className="flex-1 overflow-y-auto p-2">
        {queue.length === 0 ? (
          <p className="text-center text-apple-muted mt-10 text-sm">Nothing in queue.</p>
        ) : (
          queue.map((song, idx) => {
            const isPlaying = idx === queueIndex;
            return (
              <div 
                key={`${song.id}-${idx}`} 
                className={`flex items-center gap-3 p-2 rounded-md group transition-colors ${isPlaying ? 'bg-apple-border/40' : 'hover:bg-apple-border/20'}`}
              >
                {/* Thumbnail */}
                <div 
                  className="w-10 h-10 rounded bg-cover bg-center shrink-0 relative flex items-center justify-center cursor-pointer shadow-sm"
                  style={{ backgroundImage: song.coverUrl ? `url(${song.coverUrl})` : 'none', backgroundColor: '#3a3a3c' }}
                  onClick={() => {
                    // Play this specific song and update the queue index to this spot
                    usePlayerStore.setState({ currentSong: song, isPlaying: true, queueIndex: idx });
                  }}
                >
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded transition-opacity" />
                  <Play size={16} fill="currentColor" className="text-white opacity-0 group-hover:opacity-100 relative z-10" />
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className={`text-[13px] font-medium truncate ${isPlaying ? 'text-apple-red' : 'text-apple-text'}`}>
                    {song.title}
                  </span>
                  <span className="text-[11px] text-apple-muted truncate">{song.artist}</span>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeFromQueue(idx)}
                  className="text-apple-muted hover:text-apple-red p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}