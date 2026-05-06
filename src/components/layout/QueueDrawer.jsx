import React, { useEffect, useRef } from 'react';
import { X, ListMusic, Play, Trash2, GripVertical, Music } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function QueueDrawer() {
  const { isQueueOpen, toggleQueue, queue, queueIndex, playSong, removeFromQueue } = usePlayerStore();
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) toggleQueue();
    };
    if (isQueueOpen) window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isQueueOpen, toggleQueue]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] transition-opacity duration-300 ${isQueueOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} 
      />
      
      {/* Drawer */}
      <div 
        ref={drawerRef}
        className={`fixed top-0 right-0 h-[calc(100vh-88px)] w-96 bg-surface-container-highest/95 backdrop-blur-3xl border-l border-white/5 shadow-2xl z-[160] transform transition-transform duration-300 ease-in-out flex flex-col ${isQueueOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface-container-high/50">
          <div className="flex items-center gap-3">
            <ListMusic className="text-primary-container" size={24} />
            <h2 className="text-xl font-bold text-white tracking-tight">Up Next</h2>
          </div>
          <button onClick={toggleQueue} className="p-2 hover:bg-white/10 rounded-full text-on-surface-variant hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {queue?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-50">
              <ListMusic size={48} className="mb-4" />
              <p>Your queue is empty</p>
            </div>
          ) : (
            queue.map((song, index) => {
              const isPlaying = index === queueIndex;
              return (
                <div 
                  key={`${song.id}-${index}`}
                  className={`group flex items-center gap-3 p-3 rounded-xl transition-colors ${isPlaying ? 'bg-white/10 border border-white/5' : 'hover:bg-white/5'}`}
                >
                  <button className="text-on-surface-variant opacity-0 group-hover:opacity-50 hover:!opacity-100 cursor-grab active:cursor-grabbing">
                    <GripVertical size={16} />
                  </button>
                  
                  <div className="relative w-10 h-10 rounded bg-surface-container border border-white/5 shrink-0 overflow-hidden">
                    {song.coverUrl ? (
                      <img src={song.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Music size={16} className="text-on-surface-variant/50" /></div>
                    )}
                    <button 
                      onClick={() => playSong(song, queue)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play size={16} className="text-white fill-current ml-0.5" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <span className={`text-sm font-semibold truncate ${isPlaying ? 'text-primary-container' : 'text-white'}`}>{song.title}</span>
                    <span className="text-xs text-on-surface-variant truncate">{song.artist}</span>
                  </div>

                  <button 
                    onClick={() => removeFromQueue(index)}
                    className="p-2 text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-error transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}