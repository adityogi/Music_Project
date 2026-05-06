import React, { useEffect, useRef } from 'react';
import { Play, ListPlus, Music, ChevronRight } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function ContextMenu() {
  const { contextMenu, setContextMenu, addToQueueNext, addToQueueEnd, playlists, addToPlaylist, playSong } = usePlayerStore();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [setContextMenu]);

  if (!contextMenu.isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="fixed z-[300] w-56 bg-[#2c2c2e]/90 backdrop-blur-xl border border-apple-border rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-100"
      style={{ top: contextMenu.y, left: contextMenu.x }}
    >
      <button onClick={() => { playSong(contextMenu.song); setContextMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-apple-red rounded-lg transition group">
        <Play size={16} className="fill-white" /> Play
      </button>
      
      <div className="h-[1px] bg-apple-border my-1 mx-2" />

      <button onClick={() => { addToQueueNext(contextMenu.song); setContextMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-apple-red rounded-lg transition">
        <ListPlus size={16} /> Play Next
      </button>
      <button onClick={() => { addToQueueEnd(contextMenu.song); setContextMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-apple-red rounded-lg transition">
        <ListPlus size={16} /> Add to End of Queue
      </button>

      <div className="h-[1px] bg-apple-border my-1 mx-2" />

      <div className="relative group/sub">
        <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-apple-red rounded-lg transition">
          <div className="flex items-center gap-3">
            <Music size={16} /> Add to Playlist
          </div>
          <ChevronRight size={14} />
        </button>
        
        {/* Submenu for Playlists */}
        <div className="absolute left-full top-0 ml-1 w-48 bg-[#2c2c2e]/95 backdrop-blur-xl border border-apple-border rounded-xl shadow-2xl p-1.5 hidden group-hover/sub:block">
          {playlists.length === 0 ? (
            <div className="px-3 py-2 text-xs text-apple-muted italic">No playlists created</div>
          ) : (
            playlists.map(p => (
              <button 
                key={p.id} 
                onClick={() => { addToPlaylist(p.id, contextMenu.song); setContextMenu(false); }}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-apple-red rounded-lg transition truncate"
              >
                {p.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}