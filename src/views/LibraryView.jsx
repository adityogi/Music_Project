import React, { useMemo } from 'react';
import { Play, Music, Clock, FolderOpen, Star } from 'lucide-react';
import Fuse from 'fuse.js';
import { usePlayerStore } from '../store/usePlayerStore';

export default function LibraryView() {
  const { library, searchQuery, playSong, currentSong, isPlaying } = usePlayerStore();

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return library;
    const fuse = new Fuse(library, { keys: ['title', 'artist', 'album'], threshold: 0.3, ignoreLocation: true });
    return fuse.search(searchQuery).map(res => res.item);
  }, [library, searchQuery]);

  return (
    <div className="animate-in fade-in duration-500 pt-8 pb-12 w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-4xl font-bold text-white tracking-tight">All Songs</h2>
      </header>

      {library.length === 0 && !searchQuery && (
        <div className="flex flex-col items-center justify-center py-32 text-on-surface-variant opacity-60">
          <FolderOpen size={64} className="mb-6 opacity-20" />
          <h3 className="text-2xl font-bold text-white mb-2">No Songs Found</h3>
          <p>Import a folder using the sidebar to build your library.</p>
        </div>
      )}

      {filteredSongs.length > 0 && (
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-[48px_2fr_2fr_1.5fr_100px_60px] gap-4 px-4 py-3 border-b border-white/10 text-[10px] font-bold tracking-[0.15em] uppercase text-on-surface-variant/60 mb-2 sticky top-[72px] bg-background/95 backdrop-blur-xl z-20">
            <div className="text-center">#</div>
            <div>Song</div>
            <div>Album</div>
            <div>Artist</div>
            <div>Rating</div>
            <div className="text-right flex justify-end"><Clock size={14} /></div>
          </div>

          {/* Track Rows */}
          <div className="flex flex-col gap-1">
            {filteredSongs.map((song, index) => {
              const isActive = currentSong?.id === song.id;

              return (
                <div 
                  key={song.id}
                  onDoubleClick={() => playSong(song, filteredSongs)}
                  className={`grid grid-cols-[48px_2fr_2fr_1.5fr_100px_60px] gap-4 px-4 py-2 rounded-xl transition-all group items-center cursor-pointer ${
                    isActive ? 'bg-white/10 border border-white/5 shadow-md' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {/* Number / Play / Waveform */}
                  <div className="text-center flex justify-center items-center h-full">
                    {isActive ? (
                      isPlaying ? (
                        <div className="flex items-end gap-[2px] h-3.5 w-4 justify-center">
                          <div className="w-[3px] bg-primary-container h-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                          <div className="w-[3px] bg-primary-container h-2/3 animate-[pulse_1.2s_ease-in-out_infinite_0.2s]" />
                          <div className="w-[3px] bg-primary-container h-4/5 animate-[pulse_1s_ease-in-out_infinite_0.4s]" />
                        </div>
                      ) : (
                        <Play size={14} className="text-primary-container fill-current" />
                      )
                    ) : (
                      <>
                        <span className="text-on-surface-variant/50 group-hover:hidden text-xs font-medium">{index + 1}</span>
                        <button onClick={() => playSong(song, filteredSongs)} className="hidden group-hover:flex text-white">
                          <Play size={16} className="fill-current" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Title & Cover */}
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-surface-container border border-white/5">
                      {song.coverUrl ? <img src={song.coverUrl} className="w-full h-full object-cover" alt="cover" /> : <Music size={16} className="text-white/20 m-auto mt-3" />}
                    </div>
                    <span className={`text-sm font-semibold truncate ${isActive ? 'text-primary-container' : 'text-white'}`}>
                      {song.title || 'Unknown Title'}
                    </span>
                  </div>

                  {/* Album */}
                  <div className="text-sm text-on-surface-variant/80 truncate pr-4">{song.album || 'Local Folder'}</div>
                  
                  {/* Artist */}
                  <div className="text-sm text-on-surface-variant/80 truncate pr-4">{song.artist || 'Unknown Artist'}</div>

                  {/* Rating Placeholder */}
                  <div className="flex items-center text-on-surface-variant/30 group-hover:text-on-surface-variant/50 transition-colors">
                    <Star size={14} className="hover:text-primary-container cursor-pointer transition-colors" />
                  </div>

                  {/* Duration Placeholder (Since parsing durations on massive local files is async, we hardcode or show generic for now unless stored) */}
                  <div className="text-right text-xs font-medium text-on-surface-variant/60 flex items-center justify-end">
                    local
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}