import React from 'react';
import { Play } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function AlbumCard({ album }) {
  const { setView, playSong } = usePlayerStore();

  return (
    <div className="group cursor-pointer" onClick={() => setView('album', album)}>
      <div 
        className="aspect-square rounded-lg mb-3 shadow-lg group-hover:shadow-xl transition-all relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: album.coverUrl ? `url(${album.coverUrl})` : album.gradient }}
      >
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <button 
          onClick={(e) => { e.stopPropagation(); playSong(album.songs[0], album.songs); }}
          className="absolute bottom-3 left-3 w-10 h-10 bg-apple-red rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0"
        >
          <Play size={20} fill="currentColor" className="ml-1" />
        </button>
      </div>
      <h3 className="text-[13px] font-medium text-apple-text truncate">{album.title}</h3>
      <p className="text-[13px] text-apple-muted truncate">{album.artist}</p>
    </div>
  );
}