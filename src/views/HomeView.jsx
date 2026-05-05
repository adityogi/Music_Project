import React from 'react';
import { Music } from 'lucide-react';

export default function HomeView() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-apple-red opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
      <Music size={64} className="text-apple-red mb-6 relative z-10" />
      <h1 className="text-4xl font-bold mb-4 relative z-10 text-apple-text">Your Local Music</h1>
      <p className="text-apple-muted relative z-10">Select "Open Folder" in the sidebar to load your library.</p>
    </div>
  );
}