import React, { useState } from 'react';
import { X, GripVertical, Trash2, Play } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function QueueDrawer() {
  const { isQueueOpen, toggleQueue, queue, queueIndex, playSong, removeFromQueue, reorderQueue } = usePlayerStore();
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  if (!isQueueOpen) return null;

  // --- Bulletproof Drag & Drop Handlers ---
  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.setData('text/plain', index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    // Fired if the user cancels the drag by letting go outside the window
    setDraggedItemIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    
    // 1. Force the visual state to reset instantly
    setDraggedItemIndex(null);

    // 2. Safely grab the index we attached in DragStart
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    // 3. Fire the reorder
    reorderQueue(sourceIndex, targetIndex);
  };

  return (
    <aside className="w-80 bg-apple-panel border-l border-apple-border flex flex-col shrink-0 h-full shadow-2xl relative z-40 animate-in slide-in-from-right-8 duration-300">
      <div className="p-4 border-b border-apple-border flex justify-between items-center bg-apple-panel/80 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-lg font-bold text-white">Playing Next</h2>
        <button onClick={toggleQueue} className="text-apple-muted hover:text-white transition">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {queue.length === 0 ? (
          <div className="text-center text-apple-muted text-sm mt-10">Queue is empty</div>
        ) : (
          queue.map((song, index) => {
            const isPlaying = index === queueIndex;
            return (
              <div 
                key={`${song.id}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`flex items-center gap-3 p-2 rounded-lg group transition-all cursor-grab active:cursor-grabbing
                  ${isPlaying ? 'bg-apple-border/50' : 'hover:bg-apple-border/30'}
                  ${draggedItemIndex === index ? 'opacity-50 ring-2 ring-apple-red' : 'opacity-100 ring-0'}
                `}
              >
                {/* Drag Grip Handle */}
                <div className="text-apple-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0">
                  <GripVertical size={16} />
                </div>

                <div 
                  className="w-10 h-10 rounded bg-cover bg-center shrink-0 border border-apple-border/50 relative overflow-hidden"
                  style={{ backgroundImage: song.coverUrl ? `url(${song.coverUrl})` : 'none', backgroundColor: '#3a3a3c' }}
                >
                  {!isPlaying && (
                    <button 
                      onClick={() => playSong(song)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play size={16} className="text-white fill-white" />
                    </button>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center pointer-events-none">
                  <span className={`text-sm font-semibold truncate ${isPlaying ? 'text-apple-red' : 'text-white'}`}>
                    {song.title}
                  </span>
                  <span className="text-xs text-apple-muted truncate">{song.artist}</span>
                </div>

                <button 
                  onClick={() => removeFromQueue(index)}
                  className="text-apple-muted hover:text-apple-red opacity-0 group-hover:opacity-100 transition p-2 shrink-0"
                  title="Remove from Queue"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}