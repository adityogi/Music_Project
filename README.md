Apple Music Pro Web Player

A professional, high-performance music library application built with React and Vite. This player is designed to handle massive local music collections entirely within the browser, utilizing modern Web APIs for a native-feeling desktop experience.

🚀 Key Features

🎧 Audio Engineering

10-Band Graphic EQ: Professional-grade audio control using ten BiquadFilterNode peaking filters to customize your sound profile.

LCD Visualizer: A real-time, frequency-domain visualizer rendered on a canvas via the Web Audio API.

Synced Lyrics: Interactive, full-screen lyrics mode with support for .lrc file drag-and-drop and timestamp scrubbing.

Native Integration: Full support for OS Media Keys and global keyboard shortcuts (Play/Pause/Skip).

📂 Library & Performance

Recursive Folder Scanning: Support for the modern File System Access API (Chrome/Edge) with persistent folder handles and a cross-browser hybrid fallback for Firefox/Safari.

List Virtualization: Powered by React-Virtuoso, ensuring a butter-smooth 60FPS UI even with libraries exceeding 10,000+ tracks.

Fuzzy Search: Typo-tolerant, lightning-fast searching across titles, artists, and albums powered by Fuse.js.

Queue Management: Advanced "Up Next" queue with native Drag & Drop reordering and "Play Next" functionality.

Custom Playlists: Create and curate your own collections with persistent storage.

💅 Immersive UI/UX

Dynamic Ambient Background: Real-time color extraction from album artwork creates a shifting, blurred "glow" effect that adapts to the current track.

Custom Context Menus: Sleek, Apple-style frosted glass right-click menus for advanced track actions.

Persist State: Your volume, EQ bands, and playlists are automatically saved to local storage and survive browser refreshes.

🛠️ Tech Stack

Category

Technology

Framework

React 18 + Vite

Styling

Tailwind CSS + Lucide Icons

State Management

Zustand + Persist Middleware

Audio Processing

Web Audio API (AudioContext)

Search & Performance

Fuse.js & React-Virtuoso

Storage

IndexedDB & LocalStorage

📦 Installation

Clone the repository:

git clone [https://github.com/yourusername/apple-music-pro.git](https://github.com/yourusername/apple-music-pro.git)
cd apple-music-pro


Install dependencies:

npm install


Note: Ensure fuse.js and react-virtuoso are installed for search and scrolling features.

Start the development server:

npm run dev


📖 Usage Guide

Importing Music: Click "Open Folder" in the sidebar or simply drag a folder from your desktop anywhere onto the application window.

Equalizer: Click the Sliders icon in the Player Bar to adjust the 10-band EQ.

Lyrics: Click the Microphone icon for the full-screen view. Drag a .lrc file onto the screen to sync lyrics for any local track.

Context Menus: Right-click any track in the library to access "Play Next," "Add to End of Queue," or add it to a Playlist.

🎹 Keyboard Shortcuts

Key

Action

Space

Play / Pause

Arrow Right

Skip to Next Track

Arrow Left

Previous Track

Arrow Up/Down

Adjust Volume

L

Toggle Full-screen Lyrics

[!IMPORTANT] Privacy First: This is a local-first application. All audio processing and library management happen on your machine. Your music files are never uploaded to any server.