import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // --- NAVIGATION STATE ---
      currentView: 'home', 
      selectedAlbum: null,
      setView: (view, album = null) => set({ currentView: view, selectedAlbum: album }),

      // --- LIBRARY STATE ---
      library: [],
      albums: [],
      setLibrary: (songs, albums) => set({ library: songs, albums }),

      // --- SEARCH STATE ---
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // --- PLAYBACK & QUEUE STATE ---
      currentSong: null,
      isPlaying: false,
      queue: [],
      queueIndex: -1,
      volume: 1,
      isQueueOpen: false,

      // --- LYRICS STATE ---
      isLyricsOpen: false,
      currentLyrics: [],
      toggleLyrics: () => set((state) => ({ isLyricsOpen: !state.isLyricsOpen })),
      setLyrics: (lyrics) => set({ currentLyrics: lyrics }),

      // --- EQUALIZER STATE ---
      isEqOpen: false,
      toggleEq: () => set((state) => ({ isEqOpen: !state.isEqOpen })),
      eqBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
      setEqBand: (index, value) => set((state) => {
        const newBands = [...state.eqBands];
        newBands[index] = value;
        return { eqBands: newBands };
      }),
      resetEq: () => set({ eqBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }),

      // --- PLAYLIST STATE ---
      playlists: [],
      createPlaylist: (name) => set((state) => ({
        playlists: [...state.playlists, { id: Date.now().toString(), name: name, songs: [] }]
      })),
      addToPlaylist: (playlistId, song) => set((state) => ({
        playlists: state.playlists.map(p => 
          p.id === playlistId ? { ...p, songs: [...p.songs, song] } : p
        )
      })),

      // --- ACTIONS ---
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
      toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
      
      removeFromQueue: (indexToRemove) => set((state) => {
        const newQueue = [...state.queue];
        newQueue.splice(indexToRemove, 1);
        let newIndex = state.queueIndex;
        if (indexToRemove < state.queueIndex) newIndex -= 1;
        return { queue: newQueue, queueIndex: newIndex };
      }),
      
      reorderQueue: (startIndex, endIndex) => set((state) => {
        if (startIndex === endIndex) return state;
        const newQueue = [...state.queue];
        const [removed] = newQueue.splice(startIndex, 1);
        newQueue.splice(endIndex, 0, removed);
        
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
      name: 'apple-music-settings',
      // ONLY persist volume, EQ settings, and playlists (ignore the heavy library)
      partialize: (state) => ({ 
        volume: state.volume, 
        isQueueOpen: state.isQueueOpen,
        eqBands: state.eqBands,
        playlists: state.playlists
      }),
    }
  )
);