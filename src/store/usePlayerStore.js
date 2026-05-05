import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  // Navigation State
  currentView: 'home', // 'home', 'library', 'album'
  selectedAlbum: null,
  setView: (view, album = null) => set({ currentView: view, selectedAlbum: album }),

  // Library State
  library: [],
  albums: [],
  setLibrary: (songs, albums) => set({ library: songs, albums }),

  // Playback State
  currentSong: null,
  isPlaying: false,
  queue: [],
  queueIndex: -1,
  volume: 1,

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
}));
// Add this under your existing Playback State
  isQueueOpen: false,
  
  // Add these under your existing Actions
  toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
  
  removeFromQueue: (indexToRemove) => set((state) => {
    const newQueue = [...state.queue];
    newQueue.splice(indexToRemove, 1);
    
    // If we removed a song that was BEFORE our current song, we need to shift the index back
    let newIndex = state.queueIndex;
    if (indexToRemove < state.queueIndex) {
      newIndex -= 1;
    }
    
    return { queue: newQueue, queueIndex: newIndex };
  }),
  
  clearQueue: () => set({ queue: [], queueIndex: -1 }),