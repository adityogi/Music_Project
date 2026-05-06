import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // --- CORE STATE ---
      currentView: 'home', 
      selectedAlbum: null,
      library: [],
      albums: [],
      searchQuery: '',
      playlists: [],
      setView: (view, album = null) => set({ currentView: view, selectedAlbum: album }),
      setLibrary: (songs, albums) => set({ 
        library: Array.isArray(songs) ? songs : [], 
        albums: Array.isArray(albums) ? albums : [] 
      }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      // --- PLAYBACK ---
      currentSong: null,
      isPlaying: false,
      queue: [],
      queueIndex: -1,
      volume: 1,
      isQueueOpen: false,

      // --- OVERLAYS ---
      isLyricsOpen: false,
      isEqOpen: false,
      currentLyrics: [],
      eqBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

      toggleLyrics: () => set((state) => ({ isLyricsOpen: !state.isLyricsOpen })),
      toggleEq: () => set((state) => ({ isEqOpen: !state.isEqOpen })),
      toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
      setLyrics: (lyrics) => set({ currentLyrics: Array.isArray(lyrics) ? lyrics : [] }),
      
      setEqBand: (index, value) => set((state) => {
        const bands = state.eqBands || [0,0,0,0,0,0,0,0,0,0];
        const newBands = [...bands];
        newBands[index] = value;
        return { eqBands: newBands };
      }),
      resetEq: () => set({ eqBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }),

      // --- PLAYLIST ACTIONS ---
      createPlaylist: (name) => set((state) => ({
        playlists: [...(state.playlists || []), { id: Date.now().toString(), name, songs: [] }]
      })),

      // --- PLAYBACK ACTIONS ---
      playSong: (song, newQueue = null) => {
        if (!song) return;
        const q = newQueue || get().queue || [];
        const idx = q.findIndex(s => s.id === song.id);
        set({ 
          currentSong: song, 
          isPlaying: true, 
          queue: q, 
          queueIndex: idx !== -1 ? idx : 0 
        });
      },
      
      togglePlay: (force) => set((state) => ({ 
        isPlaying: typeof force === 'boolean' ? force : !state.isPlaying 
      })),
      
      playNext: () => {
        const { queue, queueIndex } = get();
        if (queue && queueIndex < queue.length - 1) {
          get().playSong(queue[queueIndex + 1]);
        }
      },
      
      playPrev: () => {
        const { queue, queueIndex } = get();
        if (queue && queueIndex > 0) {
          get().playSong(queue[queueIndex - 1]);
        }
      },
      
      setVolume: (v) => set({ volume: v }),
      
      removeFromQueue: (i) => set((state) => {
        const nq = [...(state.queue || [])];
        nq.splice(i, 1);
        return { queue: nq, queueIndex: i < state.queueIndex ? state.queueIndex - 1 : state.queueIndex };
      }),
      
      reorderQueue: (s, e) => set((state) => {
        const q = state.queue || [];
        if (s === e || !q[s]) return state;
        const nq = [...q];
        const [r] = nq.splice(s, 1);
        nq.splice(e, 0, r);
        
        let ni = state.queueIndex;
        if (state.queueIndex === s) ni = e;
        else if (s < state.queueIndex && e >= state.queueIndex) ni -= 1;
        else if (s > state.queueIndex && e <= state.queueIndex) ni += 1;
        
        return { queue: nq, queueIndex: ni };
      }),
    }),
    // --- CONTEXT MENU STATE ---
    contextMenu: { isOpen: false, x: 0, y: 0, song: null },
    setContextMenu: (isOpen, x = 0, y = 0, song = null) => 
      set({ contextMenu: { isOpen, x, y, song } }),

    // --- ADVANCED QUEUE ACTIONS ---
    addToQueueNext: (song) => set((state) => {
      const newQueue = [...(state.queue || [])];
      // Insert right after the currently playing song
      newQueue.splice(state.queueIndex + 1, 0, song);
      return { queue: newQueue };
    }),
    addToQueueEnd: (song) => set((state) => ({
      queue: [...(state.queue || []), song]
    })),
    {
      name: 'apple-music-settings',
      partialize: (state) => ({ 
        volume: state.volume, 
        eqBands: state.eqBands,
        playlists: state.playlists
      }),
    }
  )
);