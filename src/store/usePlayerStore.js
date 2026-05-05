import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // Navigation State
      currentView: 'home', 
      selectedAlbum: null,
      setView: (view, album = null) => set({ currentView: view, selectedAlbum: album }),

      // Library State
      library: [],
      albums: [],
      setLibrary: (songs, albums) => set({ library: songs, albums }),

      // Playback & Queue State
      currentSong: null,
      isPlaying: false,
      queue: [],
      queueIndex: -1,
      volume: 1,
      isQueueOpen: false,

      // Actions
      playSong: (song, newQueue = null) => {
        const queue = newQueue || get().queue;
        const queueIndex = queue.findIndex(s => s.id === song.id);
        set({ 
          currentSong: song, 
          isPlaying: true, 
          queue, 
          queueIndex: queueIndex !== -1 ? queueIndex : 0 
        });
      },
      
      // Lyrics State
      isLyricsOpen: false,
      currentLyrics: [],
      toggleLyrics: () => set((state) => ({ isLyricsOpen: !state.isLyricsOpen })),
      setLyrics: (lyrics) => set({ currentLyrics: lyrics }),

      togglePlay: (forceState) => set((state) => ({ 
        isPlaying: typeof forceState === 'boolean' ? forceState : !state.isPlaying 
      })),
      
      playNext: () => {
        const { queue, queueIndex } = get();
        if (queueIndex < queue.length - 1) {
          get().playSong(queue[queueIndex + 1]);
        }
      },
      
      playPrev: () => {
        const { queue, queueIndex } = get();
        if (queueIndex > 0) {
          get().playSong(queue[queueIndex - 1]);
        }
      },
      
      setVolume: (vol) => set({ volume: vol }),

      // Queue Actions
      toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
      
      removeFromQueue: (indexToRemove) => set((state) => {
        const newQueue = [...state.queue];
        newQueue.splice(indexToRemove, 1);
        
        let newIndex = state.queueIndex;
        if (indexToRemove < state.queueIndex) {
          newIndex -= 1;
        }
        
        return { queue: newQueue, queueIndex: newIndex };
      }),

      reorderQueue: (startIndex, endIndex) => set((state) => {
        if (startIndex === endIndex) return state; // Nothing changed
        
        const newQueue = [...state.queue];
        // 1. Remove the item from its old position
        const [removed] = newQueue.splice(startIndex, 1);
        // 2. Insert it at the new position
        newQueue.splice(endIndex, 0, removed);
        
        // 3. Shift the "Currently Playing" index so the music doesn't suddenly jump to the wrong song
        let newIndex = state.queueIndex;
        if (state.queueIndex === startIndex) {
          newIndex = endIndex;
        } else if (startIndex < state.queueIndex && endIndex >= state.queueIndex) {
          newIndex -= 1;
        } else if (startIndex > state.queueIndex && endIndex <= state.queueIndex) {
          newIndex += 1;
        }
        
        return { queue: newQueue, queueIndex: newIndex };
      }),
      
      clearQueue: () => set({ queue: [], queueIndex: -1 }),
    }),
    {
      name: 'apple-music-settings', // The key it saves under in LocalStorage
      // ONLY save these specific settings. We don't want to save the heavy library array!
      partialize: (state) => ({ 
        volume: state.volume, 
        isQueueOpen: state.isQueueOpen 
      }),
    }
  )
);