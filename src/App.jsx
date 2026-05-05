import React from 'react';
import Sidebar from './components/layout/Sidebar';
import PlayerBar from './components/layout/PlayerBar';
import HomeView from './views/HomeView';
import LibraryView from './views/LibraryView';
import AlbumDetailView from './views/AlbumDetailView';
import { usePlayerStore } from './store/usePlayerStore';
import QueueDrawer from './components/layout/QueueDrawer';

export default function App() {
  const { currentView } = usePlayerStore();

  return (
    <div className="h-screen w-full bg-apple-bg text-apple-text flex flex-col font-sans overflow-hidden select-none">
      <PlayerBar />
      <div className="flex flex-1 overflow-hidden">
      <QueueDrawer/> 
      <div className="flex flex-1 overflow-hidden relative"></div>
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto relative p-8 pb-32">
          {currentView === 'home' && <HomeView />}
          {currentView === 'library' && <LibraryView />}
          {currentView === 'album' && <AlbumDetailView />}
        </main>
      </div>
    </div>
  );
}