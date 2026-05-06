import React from 'react';
import { Play, Shuffle, Heart, Disc3 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

export default function AlbumDetailView() {
  const { selectedAlbum, playSong, currentSong } = usePlayerStore();

  if (!selectedAlbum) return null;

  return (
    <div className="animate-in fade-in duration-500 pt-8 pb-12">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-64 h-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl relative group bg-surface-container border border-white/5">
          {selectedAlbum.coverUrl ? (
             <img src={selectedAlbum.coverUrl} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface-container to-surface-container-highest flex items-center justify-center">
               <Disc3 size={64} className="text-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm">
            <button 
              onClick={() => selectedAlbum.songs?.length > 0 && playSong(selectedAlbum.songs[0], selectedAlbum.songs)}
              className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
            >
              <Play size={28} className="fill-current ml-1" />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-end pb-4">
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-2">Album</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">{selectedAlbum.title}</h1>
          <p className="text-lg text-primary-container font-semibold mb-6">
            {selectedAlbum.artist} <span className="text-on-surface-variant font-normal tracking-normal text-base ml-2">• {selectedAlbum.songs?.length || 0} songs</span>
          </p>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => selectedAlbum.songs?.length > 0 && playSong(selectedAlbum.songs[0], selectedAlbum.songs)}
              className="bg-primary-container text-white font-semibold px-8 py-3 rounded-full hover:bg-primary-container/90 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(var(--color-primary-container),0.3)]"
            >
              <Play size={20} className="fill-current" /> Play
            </button>
            <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-white border border-white/5">
              <Shuffle size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist Area */}
      <div className="w-full max-w-4xl">
        <div className="flex flex-col gap-1 pb-8">
          {selectedAlbum.songs?.map((song, index) => {
            const isCurrentlyPlaying = currentSong?.id === song.id;

            return (
              <div 
                key={`${song.id}-${index}`}
                onDoubleClick={() => playSong(song, selectedAlbum.songs)}
                className={`grid grid-cols-[48px_1fr_80px] gap-4 px-4 py-3 rounded-xl transition-colors group items-center cursor-pointer ${
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
                      <span className="text-on-surface-variant group-hover:hidden text-sm font-medium">{index + 1}</span>
                      <button onClick={() => playSong(song, selectedAlbum.songs)} className="hidden group-hover:flex text-white">
                        <Play size={16} className="fill-current" />
                      </button>
                    </>
                  )}
                </div>

                {/* Title */}
                <span className={`text-sm truncate font-medium ${isCurrentlyPlaying ? 'text-primary-container' : 'text-white'}`}>
                  {song.title}
                </span>

                {/* Actions */}
                <div className="text-right flex items-center justify-end gap-4">
                  <button className="text-on-surface-variant hover:text-primary-container opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}