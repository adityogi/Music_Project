import React from 'react';
import { ListMusic, Play, Trash2 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

export default function PlaylistView({ playlistId }) {
  const { playlists, playSong } = usePlayerStore();
  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) return <div className="text-white">Playlist not found</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-end gap-8 mb-10">
        <div className="w-52 h-52 bg-gradient-to-br from-apple-red to-pink-600 rounded-xl shadow-2xl flex items-center justify-center">
          <ListMusic size={80} className="text-white" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-apple-muted uppercase tracking-widest">Playlist</span>
          <h1 className="text-6xl font-black text-white">{playlist.name}</h1>
          <span className="text-apple-muted">{playlist.songs?.length || 0} songs</span>
          <button 
            onClick={() => playlist.songs?.length > 0 && playSong(playlist.songs[0], playlist.songs)}
            className="mt-4 flex items-center gap-2 bg-apple-red hover:bg-apple-red-hover text-white px-6 py-2.5 rounded-full font-bold transition w-fit"
          >
            <Play size={20} className="fill-white" /> Play All
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {playlist.songs?.map((song, index) => (
          <div 
            key={`${song.id}-${index}`}
            className="group flex items-center justify-between p-3 hover:bg-apple-border/30 rounded-lg transition-colors border-b border-apple-border/10 last:border-0"
          >
            <div className="flex items-center gap-4 min-w-0">
               <span className="text-apple-muted w-4 text-center text-sm">{index + 1}</span>
               <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate cursor-pointer hover:underline" onClick={() => playSong(song, playlist.songs)}>{song.title}</span>
                  <span className="text-xs text-apple-muted truncate">{song.artist}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}