import React, { useState, useMemo } from 'react';
import { Play, Disc3, Music, FolderOpen, FileText } from 'lucide-react';
import Fuse from 'fuse.js';
import { Virtuoso } from 'react-virtuoso';
import { usePlayerStore } from '../store/usePlayerStore';
import { downloadFolderStructure } from '../utils/treeGenerator';

export default function LibraryView() {
  const { library, albums, searchQuery, setView, playSong, currentSong } = usePlayerStore();
  const [activeTab, setActiveTab] = useState('albums');

  // Fuse.js Intelligent Filtering
  const filteredAlbums = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return albums || [];
    const fuse = new Fuse(albums, { 
      keys: ['title', 'artist'], 
      threshold: 0.3, 
      ignoreLocation: true 
    });
    return fuse.search(searchQuery).map(res => res.item);
  }, [albums, searchQuery]);

  const filteredSongs = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return library || [];
    const fuse = new Fuse(library, { 
      keys: ['title', 'artist', 'album'], 
      threshold: 0.3, 
      ignoreLocation: true 
    });
    return fuse.search(searchQuery).map(res => res.item);
  }, [library, searchQuery]);

  return (
    <div className="animate-in fade-in duration-500 pt-8 pb-12 h-full flex flex-col">
      {/* Header & Tabs */}
      <header className="mb-10 border-b border-white/5 pb-6 shrink-0">
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
            Albums ({(filteredAlbums || []).length})
          </button>
          <button 
            onClick={() => setActiveTab('songs')}
            className={`pb-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'songs' ? 'border-primary-container text-white' : 'border-transparent text-on-surface-variant hover:text-white'}`}
          >
            Songs ({(filteredSongs || []).length})
          </button>

          <div className="flex-1"></div>
          
          {/* NEW: Explicit Download Button */}
          {library && library.length > 0 && (
            <button 
              onClick={() => downloadFolderStructure(library, "Supermix Data")}
              className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary-container bg-primary-container/10 hover:bg-primary-container/20 rounded-full transition-colors border border-primary-container/20"
            >
              <FileText size={16} /> Download Structure
            </button>
          )}
        </div>
      </header>

      {/* Empty State */}
      {(!library || library.length === 0) && !searchQuery && (
        <div className="flex flex-col items-center justify-center py-32 text-on-surface-variant opacity-60">
          <FolderOpen size={64} className="mb-6 opacity-20" />
          <h3 className="text-2xl font-bold text-white mb-2">Your Library is Empty</h3>
          <p>Drag and drop a music folder anywhere onto the app to begin.</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-20">
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

      {/* Optimized Songs List View (Virtuoso) */}
      {activeTab === 'songs' && filteredSongs.length > 0 && (
        <div className="flex-1 h-[calc(100vh-280px)] w-full">
          <Virtuoso
            style={{ height: '100%', width: '100%' }}
            totalCount={filteredSongs.length}
            className="custom-scrollbar pr-4 pb-20"
            itemContent={(index) => {
              const song = filteredSongs[index];
              const isCurrentlyPlaying = currentSong?.id === song.id;

              return (
                <div 
                  key={song.id}
                  onDoubleClick={() => playSong(song, filteredSongs)}
                  className={`grid grid-cols-[48px_1fr_1fr_1fr] gap-4 px-4 py-3 rounded-xl transition-colors group items-center cursor-pointer mb-1 ${
                    isCurrentlyPlaying ? 'bg-white/10 border border-white/5' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="text-center text-on-surface-variant group-hover:hidden text-sm">
                    {isCurrentlyPlaying ? <div className="w-2 h-2 rounded-full bg-primary-container mx-auto animate-pulse" /> : index + 1}
                  </div>
                  <button onClick={() => playSong(song, filteredSongs)} className="hidden group-hover:flex justify-center items-center text-white">
                    <Play size={16} className="fill-current" />
                  </button>
                  
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-surface-container border border-white/5">
                      {song.coverUrl ? <img src={song.coverUrl} className="w-full h-full object-cover" alt="cover" /> : <Music size={16} className="text-white/20 m-auto mt-2" />}
                    </div>
                    <span className={`text-sm font-medium truncate ${isCurrentlyPlaying ? 'text-primary-container' : 'text-white'}`}>{song.title || 'Unknown Title'}</span>
                  </div>
                  <div className="text-sm text-on-surface-variant truncate">{song.artist || 'Unknown Artist'}</div>
                  <div className="text-sm text-on-surface-variant truncate">{song.album || 'Unknown Album'}</div>
                </div>
              );
            }}
          />
        </div>
      )}
    </div>
  );
}