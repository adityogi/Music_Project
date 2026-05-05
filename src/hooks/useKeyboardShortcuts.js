import { useEffect } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Don't interfere if typing in the search bar
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      // 2. FIX: If a button is focused, let the browser handle the spacebar natively
      // This prevents the "double-toggle" bug where it pauses and plays instantly
      if (e.code === 'Space' && document.activeElement.tagName === 'BUTTON') {
        return;
      }

      const store = usePlayerStore.getState();

      switch (e.code) {
        case 'Space':
          e.preventDefault(); // Stops the page from scrolling down
          if (store.currentSong) store.togglePlay(); 
          break;
          
        case 'ArrowRight':
          e.preventDefault();
          store.playNext();
          break;
          
        case 'ArrowLeft':
          e.preventDefault();
          store.playPrev();
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          store.setVolume(Math.min(store.volume + 0.05, 1));
          break;
          
        case 'ArrowDown':
          e.preventDefault();
          store.setVolume(Math.max(store.volume - 0.05, 0));
          break;
          
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}