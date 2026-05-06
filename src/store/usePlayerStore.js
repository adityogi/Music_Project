import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // --- NAVIGATION & SIDEBAR ---
      currentView: 'home', 
      selectedAlbum: null,
      isSidebarCollapsed: false,
      setView: (view, album = null) => set({ currentView: view, selectedAlbum: album }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      // --- LIBRARY ---
      library: [],
      albums: [],
      setLibrary: (songs, albums) => set({ 
        library: Array.isArray(songs) ? songs : [], 
        albums: Array.isArray(albums) ? albums : [] 
      }),

      // --- SEARCH ---
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // --- THEME STATE ---
      currentTheme: 'default',
      isThemeOpen: false,
      setTheme: (theme) => set({ currentTheme: theme }),
      toggleTheme: () => set((state) => ({ isThemeOpen: !state.isThemeOpen })),

      // --- PLAYBACK ---
      currentSong: null,
      isPlaying: false,
      queue: [],
      queueIndex: -1,
      volume: 1,
      isQueueOpen: false,

      // --- LYRICS ---
      isLyricsOpen: false,
      currentLyrics: [],
      toggleLyrics: () => set((state) => ({ isLyricsOpen: !state.isLyricsOpen })),
      setLyrics: (lyrics) => set({ currentLyrics: Array.isArray(lyrics) ? lyrics : [] }),

      // --- EQUALIZER ---
      isEqOpen: false,
      toggleEq: () => set((state) => ({ isEqOpen: !state.isEqOpen })),
      eqBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
      setEqBand: (index, value) => set((state) => {
        const bands = state.eqBands || [0,0,0,0,0,0,0,0,0,0];
        const newBands = [...bands];
        newBands[index] = value;
        return { eqBands: newBands };
      }),
      resetEq: () => set({ eqBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }),

      // --- PLAYLISTS ---
      playlists: [],
      createPlaylist: (name) => set((state) => ({
        playlists: [...(state.playlists || []), { id: Date.now().toString(), name, songs: [] }]
      })),
      addToPlaylist: (playlistId, song) => set((state) => ({
        playlists: (state.playlists || []).map(p => 
          p.id === playlistId ? { ...p, songs: [...(p.songs || []), song] } : p
        )
      })),

      // --- CONTEXT MENU STATE ---
      contextMenu: { isOpen: false, x: 0, y: 0, song: null },
      setContextMenu: (isOpen, x = 0, y = 0, song = null) => 
        set({ contextMenu: { isOpen, x, y, song } }),

      // --- ADVANCED QUEUE ACTIONS ---
      addToQueueNext: (song) => set((state) => {
        const newQueue = [...(state.queue || [])];
        newQueue.splice(state.queueIndex + 1, 0, song);
        return { queue: newQueue };
      }),
      addToQueueEnd: (song) => set((state) => ({
        queue: [...(state.queue || []), song]
      })),

      // --- CORE ACTIONS ---
      playSong: (song, newQueue = null) => {
        const queue = newQueue || get().queue || [];
        const index = queue.findIndex(s => s.id === song.id);
        set({ currentSong: song, isPlaying: true, queue, queueIndex: index !== -1 ? index : 0 });
      },
      togglePlay: (forceState) => set((state) => ({ 
        isPlaying: typeof forceState === 'boolean' ? forceState : !state.isPlaying 
      })),
      playNext: () => {
        const { queue, queueIndex } = get();
        if (queue && queueIndex < queue.length - 1) get().playSong(queue[queueIndex + 1]);
      },
      playPrev: () => {
        const { queue, queueIndex } = get();
        if (queue && queueIndex > 0) get().playSong(queue[queueIndex - 1]);
      },
      setVolume: (vol) => set({ volume: vol }),
      toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
      removeFromQueue: (indexToRemove) => set((state) => {
        const newQueue = [...(state.queue || [])];
        newQueue.splice(indexToRemove, 1);
        let newIndex = state.queueIndex;
        if (indexToRemove < state.queueIndex) newIndex -= 1;
        return { queue: newQueue, queueIndex: newIndex };
      }),
      reorderQueue: (startIndex, endIndex) => set((state) => {
        const currentQueue = state.queue || [];
        if (startIndex === endIndex || !currentQueue[startIndex]) return state;
        const newQueue = [...currentQueue];
        const [removed] = newQueue.splice(startIndex, 1);
        newQueue.splice(endIndex, 0, removed);
        let newIndex = state.queueIndex;
        if (state.queueIndex === startIndex) newIndex = endIndex;
        else if (startIndex < state.queueIndex && endIndex >= state.queueIndex) newIndex -= 1;
        else if (startIndex > state.queueIndex && endIndex <= state.queueIndex) newIndex += 1;
        return { queue: newQueue, queueIndex: newIndex };
      }),
      clearQueue: () => set({ queue: [], queueIndex: -1 }),
    }),
    {
      name: 'apple-music-settings',
      partialize: (state) => ({ 
        volume: state.volume, 
        isQueueOpen: state.isQueueOpen,
        eqBands: state.eqBands,
        playlists: state.playlists,
        currentTheme: state.currentTheme,
        isSidebarCollapsed: state.isSidebarCollapsed
      }),
    }
  )
);