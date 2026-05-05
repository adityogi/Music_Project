import React, { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import Fuse from 'fuse.js';
import { SearchX, Play } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

export default function LibraryView() {
  const { library, searchQuery, playSong } = usePlayerStore();

  // 1. Fuzzy Search Memoization
  const filteredLibrary = useMemo(() => {
    if (!searchQuery) return library;
    
    // Fuse handles typos and partial matches beautifully
    const fuse = new Fuse(library, {
      keys: ['title', 'artist', 'album'],
      threshold: 0.3, // How "fuzzy" the search is allowed to be
    });
    
    return fuse.search(searchQuery).map(result => result.item);
  }, [library, searchQuery]);

  if (library.length === 0) return null;

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-4xl font-bold text-white mb-6">
        {searchQuery ? 'Search Results' : 'Songs'}
      </h1>

      {filteredLibrary.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-apple-muted">
           <SearchX size={48} className="mb-4 opacity-50" />
           <p className="text-lg">No songs found for "{searchQuery}"</p>
        </div>
      ) : (
        <div className="flex-1">
          {/* 2. List Virtualization */}
          <Virtuoso
            style={{ height: '100%' }}
            data={filteredLibrary}
            itemContent={(index, song) => (
              <div 
                key={song.id}
                className="group flex items-center justify-between p-3 hover:bg-apple-border/30 rounded-lg transition-colors border-b border-apple-border/30 last:border-0"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div 
                    className="w-10 h-10 rounded bg-cover bg-center shrink-0 shadow-sm relative overflow-hidden cursor-pointer"
                    style={{ backgroundImage: song.coverUrl ? `url(${song.coverUrl})` : 'none', backgroundColor: '#3a3a3c' }}
                    onClick={() => playSong(song)}
                  >
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={16} className="text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{song.title}</span>
                    <span className="text-xs text-apple-muted truncate">{song.artist} • {song.album}</span>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}