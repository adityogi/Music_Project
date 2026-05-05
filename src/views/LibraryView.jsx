import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import AlbumCard from '../components/ui/AlbumCard';

export default function LibraryView() {
  const { albums } = usePlayerStore();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-apple-text">Albums</h2>
      {albums.length === 0 ? (
         <p className="text-apple-muted">No albums found. Open a folder to begin.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {albums.map((album, idx) => (
            <AlbumCard key={idx} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}