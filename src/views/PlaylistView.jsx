import React, { useState, useRef, useEffect } from 'react';
import { Play, Shuffle, MoreHorizontal, Clock, Heart, Pause, Music, Trash2 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

export default function PlaylistView({ playlistId }) {
  const { playlists, playSong, currentSong, isPlaying, deletePlaylist, setView } = usePlayerStore();
  const playlist = playlists.find(p => p.id === playlistId);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the 3-dots menu if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  if (!playlist) return <div className="text-on-surface-variant p-8 font-semibold">Playlist not found.</div>;

  const hasSongs = playlist.songs && playlist.songs.length > 0;

  // Shuffle Logic
  const handleShuffle = () => {
    if (!hasSongs) return;
    // Create a copy of the array and randomize it
    const shuffledQueue = [...playlist.songs].sort(() => Math.random() - 0.5);
    playSong(shuffledQueue[0], shuffledQueue);
  };

  // Delete Logic
  const handleDeletePlaylist = () => {
    if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
      setView('library'); // Send user back to library after deletion
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pt-8 pb-32">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-64 h-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl relative group bg-surface-container-high border border-white/5">
          {hasSongs && playlist.songs[0].coverUrl ? (
             <img src={playlist.songs[0].coverUrl} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface-container to-surface-container-highest flex items-center justify-center">
               <Music size={64} className="text-on-surface-variant/20" />
            </div>
          )}
          
          {hasSongs && (
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm">
              <button 
                onClick={() => playSong(playlist.songs[0], playlist.songs)}
                className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
              >
                <Play size={28} className="fill-current ml-1" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end pb-4">
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-2">Playlist</span>
          <h1 className="text-5xl md:text-6xl font-black text-on-surface mb-4 tracking-tight">{playlist.name}</h1>
          <p className="text-lg text-on-surface-variant mb-6">{playlist.songs?.length || 0} songs • Curated by You</p>
          
          <div className="flex items-center gap-4">
            {/* Play All Button */}
            <button 
              onClick={() => hasSongs && playSong(playlist.songs[0], playlist.songs)}
              disabled={!hasSongs}
              className={`font-semibold px-8 py-3 rounded-full transition-colors flex items-center gap-2 ${
                hasSongs 
                  ? 'bg-primary-container text-white hover:bg-primary-container/90 shadow-[0_0_20px_rgba(var(--color-primary-container),0.3)]' 
                  : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50'
              }`}
            >
              <Play size={20} className={hasSongs ? "fill-current" : ""} /> Play All
            </button>

            {/* Shuffle Button */}
            <button 
              onClick={handleShuffle}
              disabled={!hasSongs}
              title="Shuffle"
              className={`w-12 h-12 rounded-full transition-colors flex items-center justify-center border ${
                hasSongs 
                  ? 'bg-white/5 hover:bg-white/10 text-on-surface border-white/5' 
                  : 'bg-transparent text-on-surface-variant/30 border-white/5 cursor-not-allowed'
              }`}
            >
              <Shuffle size={20} />
            </button>

            {/* Three Dots / More Menu */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`w-12 h-12 rounded-full transition-colors flex items-center justify-center border border-white/5 ${
                  isMenuOpen ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-on-surface'
                }`}
              >
                <MoreHorizontal size={20} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-surface-container-highest/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={handleDeletePlaylist}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 text-sm font-semibold text-[#ff5357] hover:bg-white/5 transition-colors"
                  >
                    <Trash2 size={16} /> Delete Playlist
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Tracklist Area */}
      <div className="w-full">
        {hasSongs ? (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-[48px_1fr_1fr_1fr_80px] gap-4 px-4 py-2 border-b border-white/5 text-[11px] font-bold tracking-widest uppercase text-on-surface-variant mb-2 sticky top-16 bg-background/80 backdrop-blur-xl z-20">
              <div className="text-center">#</div>
              <div>Title</div>
              <div>Album</div>
              <div>Artist</div>
              <div className="text-right flex items-center justify-end"><Clock size={14} /></div>
            </div>

            {/* Track Rows */}
            <div className="flex flex-col gap-1 pb-8">
              {playlist.songs.map((song, index) => {
                const isCurrentlyPlaying = currentSong?.id === song.id;

                return (
                  <div 
                    key={`${song.id}-${index}`}
                    onDoubleClick={() => playSong(song, playlist.songs)}
                    className={`grid grid-cols-[48px_1fr_1fr_1fr_80px] gap-4 px-4 py-3 rounded-xl transition-colors group items-center cursor-pointer ${
                      isCurrentlyPlaying ? 'bg-white/10 border border-white/5' : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Number / Play Button */}
                    <div className="text-center flex justify-center items-center">
                      {isCurrentlyPlaying ? (
                        <div className="flex items-end gap-1 h-4 w-4">
                           <div className="w-1 bg-primary-container h-full animate-[pulse_1s_ease-in-out_infinite]" />
                           <div className="w-1 bg-primary-container h-2/3 animate-[pulse_1.2s_ease-in-out_infinite_0.2s]" />
                           <div className="w-1 bg-primary-container h-4/5 animate-[pulse_0.8s_ease-in-out_infinite_0.4s]" />
                        </div>
                      ) : (
                        <>
                          <span className="text-on-surface-variant group-hover:hidden text-sm">{index + 1}</span>
                          <button onClick={() => playSong(song, playlist.songs)} className="hidden group-hover:flex text-on-surface">
                            <Play size={16} className="fill-current" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Title & Art */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-surface-container border border-white/5">
                        {song.coverUrl ? (
                          <img src={song.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Music size={16} className="text-on-surface-variant/50" /></div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          {isCurrentlyPlaying && isPlaying ? <Pause size={16} className="text-white fill-white" /> : <Play size={16} className="text-white fill-white ml-0.5" />}
                        </div>
                      </div>
                      <span className={`text-sm truncate font-medium ${isCurrentlyPlaying ? 'text-primary-container' : 'text-on-surface'}`}>
                        {song.title}
                      </span>
                    </div>

                    {/* Album */}
                    <div className="text-sm text-on-surface-variant truncate">{song.album || 'Unknown Album'}</div>
                    
                    {/* Artist */}
                    <div className="text-sm text-on-surface-variant truncate">{song.artist || 'Unknown Artist'}</div>

                    {/* Duration & Actions */}
                    <div className="text-right text-sm text-on-surface-variant flex items-center justify-end gap-4">
                      <button className="hover:text-primary-container opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart size={16} />
                      </button>
                      <span className={`${isCurrentlyPlaying ? 'opacity-100 text-primary-container' : 'group-hover:opacity-100 opacity-60'} transition-opacity w-8`}>
                        {/* Note: In a full app, format song.duration here */}
                        --:--
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-on-surface-variant">
             <Music size={48} className="mx-auto mb-4 opacity-20" />
             <p className="text-lg font-semibold text-white mb-2">This playlist is empty.</p>
             <p className="text-sm opacity-80">Right-click songs in your Library and select "Add to Playlist".</p>
          </div>
        )}
      </div>
    </div>
  );
}