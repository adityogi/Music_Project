import React, { useState, useMemo } from 'react';
import { Play, Disc3, Music, FolderOpen } from 'lucide-react';
import Fuse from 'fuse.js';
import { usePlayerStore } from '../store/usePlayerStore';

export default function LibraryView() {
  const { library, albums, searchQuery, setView, playSong } = usePlayerStore();
  const [activeTab, setActiveTab] = useState('albums');

  // Fuse.js Intelligent Filtering
  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return albums;
    const fuse = new Fuse(albums, { 
      keys: ['title', 'artist'], 
      threshold: 0.3, // Lower = more exact, Higher = more fuzzy
      ignoreLocation: true 
    });
    return fuse.search(searchQuery).map(res => res.item);
  }, [albums, searchQuery]);

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return library;
    const fuse = new Fuse(library, { 
      keys: ['title', 'artist', 'album'], 
      threshold: 0.3, 
      ignoreLocation: true 
    });
    return fuse.search(searchQuery).map(res => res.item);
  }, [library, searchQuery]);

  return (
    <div className="animate-in fade-in duration-500 pt-8 pb-12">
      {/* Header & Tabs */}
      <header className="mb-10 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-4xl font-bold text-on-surface tracking-tight">Library</h2>
          {searchQuery && (
            <span className="px-3 py-1 bg-primary-container/20 text-primary-container text-xs font-bold uppercase tracking-widest rounded-full">
              Search Results
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('albums')}
            className={`pb-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'albums' ? 'border-primary-container text-white' : 'border-transparent text-on-surface-variant hover:text-white'}`}
          >
            Albums ({filteredAlbums.length})
          </button>
          <button 
            onClick={() => setActiveTab('songs')}
            className={`pb-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'songs' ? 'border-primary-container text-white' : 'border-transparent text-on-surface-variant hover:text-white'}`}
          >
            Songs ({filteredSongs.length})
          </button>
        </div>
      </header>

      {/* Empty State */}
      {library.length === 0 && !searchQuery && (
        <div className="flex flex-col items-center justify-center py-32 text-on-surface-variant opacity-60">
          <FolderOpen size={64} className="mb-6 opacity-20" />
          <h3 className="text-2xl font-bold text-white mb-2">Your Library is Empty</h3>
          <p>Click "Open Folder" in the sidebar or drag and drop a music folder here.</p>
        </div>
      )}

      {/* No Results State */}
      {searchQuery && filteredAlbums.length === 0 && filteredSongs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-on-surface-variant opacity-60">
          <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
          <p>We couldn't find anything matching "{searchQuery}"</p>
        </div>
      )}

      {/* Albums Grid View */}
      {activeTab === 'albums' && filteredAlbums.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredAlbums.map((album, idx) => (
            <div 
              key={`${album.title}-${idx}`} 
              onClick={() => setView('album', album)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-surface-container border border-white/5 shadow-lg">
                {album.coverUrl ? (
                  <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-highest">
                    <Disc3 size={48} className="text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center shadow-lg shadow-primary-container/30">
                    <Play size={24} className="fill-current ml-1" />
                  </div>
                </div>
              </div>
              <h4 className="text-sm text-on-surface font-bold truncate group-hover:text-primary-container transition-colors">{album.title || 'Unknown Album'}</h4>
              <p className="text-[11px] font-semibold tracking-wide text-on-surface-variant/70 mt-1 truncate uppercase">{album.artist || 'Unknown Artist'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Songs List View */}
      {activeTab === 'songs' && filteredSongs.length > 0 && (
        <div className="flex flex-col gap-1">
          {filteredSongs.map((song, index) => (
             <div 
               key={song.id}
               onDoubleClick={() => playSong(song, filteredSongs)}
               className="grid grid-cols-[48px_1fr_1fr_1fr] gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group items-center cursor-pointer"
             >
               <div className="text-center text-on-surface-variant group-hover:hidden text-sm">{index + 1}</div>
               <button onClick={() => playSong(song, filteredSongs)} className="hidden group-hover:flex justify-center items-center text-on-surface">
                 <Play size={16} className="fill-current" />
               </button>
               
               <div className="flex items-center gap-3 min-w-0">
                 <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-surface-container border border-white/5">
                   {song.coverUrl ? <img src={song.coverUrl} className="w-full h-full object-cover" alt="cover" /> : <Music size={16} className="text-white/20 m-auto mt-2" />}
                 </div>
                 <span className="text-sm font-medium text-white truncate">{song.title || 'Unknown Title'}</span>
               </div>
               <div className="text-sm text-on-surface-variant truncate">{song.artist || 'Unknown Artist'}</div>
               <div className="text-sm text-on-surface-variant truncate">{song.album || 'Unknown Album'}</div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}