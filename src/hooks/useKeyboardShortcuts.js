import { useEffect } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. If the user is typing in the search bar, don't trigger media shortcuts!
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      // 2. Grab the current state and actions from our Zustand store directly
      const store = usePlayerStore.getState();

      // 3. Map keys to player actions
      switch (e.code) {
        case 'Space':
          e.preventDefault(); // Stops the page from scrolling down when you press space!
          // We only want to toggle if there's actually a song loaded
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
          // Increase volume by 5%, capped at 1.0 (100%)
          store.setVolume(Math.min(store.volume + 0.05, 1));
          break;
          
        case 'ArrowDown':
          e.preventDefault();
          // Decrease volume by 5%, floored at 0.0 (0%)
          store.setVolume(Math.max(store.volume - 0.05, 0));
          break;
          
        default:
          break;
      }
    };

    // Attach the listener to the whole window
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up the listener if the component ever unmounts
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}