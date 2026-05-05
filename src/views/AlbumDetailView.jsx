import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import TrackRow from '../components/ui/TrackRow';
import { Play, Shuffle } from 'lucide-react';

export default function AlbumDetailView() {
  const { selectedAlbum, playSong } = usePlayerStore();

  if (!selectedAlbum) return null;

  return (
    <div>
      <div className="flex flex-col md:flex-row items-end gap-8 mb-8 border-b border-apple-border/50 pb-8 bg-gradient-to-b from-[#2a2a2c] to-[#1c1c1e] p-8 -mx-8 -mt-8">
        <div 
          className="w-56 h-56 rounded-lg shadow-2xl flex-shrink-0 bg-cover bg-center" 
          style={{ backgroundImage: selectedAlbum.coverUrl ? `url(${selectedAlbum.coverUrl})` : selectedAlbum.gradient }} 
        />
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold mb-2 text-apple-text">{selectedAlbum.title}</h1>
          <h2 className="text-xl text-apple-red font-medium mb-4">{selectedAlbum.artist}</h2>
          <p className="text-sm text-apple-muted mb-6 uppercase tracking-wider font-semibold">
            Local Library • {selectedAlbum.songs.length} Songs
          </p>
          
          <div className="flex items-center gap-4">
              <button 
                  onClick={() => playSong(selectedAlbum.songs[0], selectedAlbum.songs)}
                  className="bg-apple-red text-white px-8 py-2 rounded font-semibold hover:bg-apple-red-hover transition shadow flex items-center gap-2"
              >
                  <Play size={18} fill="currentColor" /> Play
              </button>
              <button className="bg-apple-border text-apple-text w-10 h-10 rounded flex items-center justify-center hover:bg-[#4a4a4c] transition">
                  <Shuffle size={18} />
              </button>
          </div>
        </div>
      </div>

      <div className="px-2">
        {selectedAlbum.songs.map((song, index) => (
          <TrackRow key={song.id} song={song} index={index} albumSongs={selectedAlbum.songs} />
        ))}
      </div>
    </div>
  );
}