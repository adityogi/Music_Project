import React from 'react';
import Sidebar from './components/layout/Sidebar';
import PlayerBar from './components/layout/PlayerBar';
import { usePlayerStore } from './store/usePlayerStore';
import { Play } from 'lucide-react';

export default function App() {
  const { currentView, albums, selectedAlbum, setView, playSong } = usePlayerStore();

  return (
    <div className="h-screen w-full bg-apple-bg text-apple-text flex flex-col font-sans overflow-hidden select-none">
      <PlayerBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto relative p-8 pb-32">
          {/* Welcome View */}
          {currentView === 'home' && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-4xl font-bold mb-4">Welcome to Your Music</h1>
              <p className="text-apple-muted">Select "Open Folder" in the sidebar to load your local library.</p>
            </div>
          )}

          {/* Library / Albums Grid */}
          {currentView === 'library' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Albums</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {albums.map((album, idx) => (
                  <div key={idx} className="group cursor-pointer" onClick={() => setView('album', album)}>
                    <div 
                      className="aspect-square rounded-lg mb-3 shadow-lg group-hover:shadow-xl transition-all relative"
                      style={{ background: album.gradient }}
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); playSong(album.songs[0], album.songs); }}
                        className="absolute bottom-3 left-3 w-10 h-10 bg-apple-red rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </button>
                    </div>
                    <h3 className="text-[13px] font-medium truncate">{album.title}</h3>
                    <p className="text-[13px] text-apple-muted truncate">{album.artist}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Album Detail View */}
          {currentView === 'album' && selectedAlbum && (
            <div>
              <div className="flex gap-8 mb-8 border-b border-apple-border pb-8">
                <div className="w-48 h-48 rounded-lg shadow-2xl" style={{ background: selectedAlbum.gradient }} />
                <div className="flex flex-col justify-end">
                  <h1 className="text-4xl font-bold mb-2">{selectedAlbum.title}</h1>
                  <h2 className="text-xl text-apple-red font-medium">{selectedAlbum.artist}</h2>
                </div>
              </div>
              <div>
                {selectedAlbum.songs.map((song, index) => (
                  <div 
                    key={song.id} 
                    onDoubleClick={() => playSong(song, selectedAlbum.songs)}
                    className="flex items-center px-4 py-3 hover:bg-apple-border/30 rounded-md cursor-pointer group"
                  >
                    <span className="w-8 text-apple-muted text-sm group-hover:hidden">{index + 1}</span>
                    <Play size={16} fill="currentColor" className="w-8 hidden group-hover:block text-apple-text" />
                    <span className="flex-1 text-sm">{song.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}