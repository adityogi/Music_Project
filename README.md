# 🍎 Apple Music Pro Web Player

A professional, high-performance music library application built with **React 18** and **Vite**. This player is designed to handle massive local music collections entirely within the browser, utilizing modern Web APIs for a native-feeling desktop experience.

## 🚀 Key Features

### 🎧 Audio Engineering
- **10-Band Graphic EQ**: Professional-grade audio control using ten `BiquadFilterNode` peaking filters to customize your sound profile.
- **LCD Visualizer**: A real-time, frequency-domain visualizer rendered on a canvas via the **Web Audio API**.
- **Synced Lyrics**: Interactive, full-screen lyrics mode with support for `.lrc` file drag-and-drop and timestamp scrubbing.
- **Native Integration**: Full support for **OS Media Keys** and global keyboard shortcuts (Play/Pause/Skip).

### 📂 Library & Performance
- **Recursive Folder Scanning**: Support for the modern **File System Access API** with persistent folder handles and a hybrid fallback for folder selection.
- **List Virtualization**: Powered by **React-Virtuoso**, ensuring a butter-smooth 60FPS UI even with libraries exceeding 10,000+ tracks.
- **Fuzzy Search**: Typo-tolerant, lightning-fast searching across titles, artists, and albums powered by **Fuse.js**[cite: 2].
- **Queue Management**: Advanced "Up Next" queue with native **Drag & Drop** reordering[cite: 1, 2].
- **Custom Playlists**: Create and curate your own collections with persistent storage[cite: 2].

### 💅 Immersive UI/UX
- **Dynamic Ambient Background**: Real-time color extraction from album artwork creates a shifting, blurred "glow" effect that adapts to the current track[cite: 1, 2].
- **Custom Context Menus**: Sleek, Apple-style frosted glass right-click menus for advanced track actions[cite: 2].
- **Persistent State**: Your volume, EQ bands, and playlists are automatically saved via **Zustand Persistence**[cite: 1, 2].

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | React 18 + Vite[cite: 1, 2] |
| **Styling** | Tailwind CSS + Lucide Icons[cite: 1, 2] |
| **State Management** | Zustand + Persist Middleware[cite: 1, 2] |
| **Audio Processing** | Web Audio API (AudioContext)[cite: 1, 2] |
| **Search & Performance** | Fuse.js & React-Virtuoso[cite: 2] |
| **Storage** | IndexedDB & LocalStorage[cite: 1, 2] |

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/adityogi/music_project_5.git](https://github.com/adityogi/music_project_5.git)
   cd music_project_5
   ```

2. Install dependencies:
    ```bash
    npm install fuse.js react-virtuoso lucide-react zustand
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

## 📖 Usage Guide

-  Importing Music: Click "Open Folder" in the sidebar or simply drag a folder from your desktop anywhere onto the application window[cite: 1, 2].

- Equalizer: Click the Sliders icon in the Player Bar to adjust the 10-band EQ[cite: 2].

- Lyrics: Click the Microphone icon for the full-screen view. Drag a .lrc file onto the screen to sync lyrics for any local track[cite: 1, 2].

- Context Menus: Right-click any track in the library to access "Play Next," "Add to End of Queue," or add it to a Playlist[cite: 2].
