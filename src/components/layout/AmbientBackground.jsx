import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { extractDominantColor } from '../../utils/colorExtractor';

export default function AmbientBackground() {
  const { currentSong } = usePlayerStore();
  const [color, setColor] = useState('rgba(250, 35, 59, 0.1)'); // Default red

  useEffect(() => {
    if (currentSong?.coverUrl) {
      extractDominantColor(currentSong.coverUrl).then((newColor) => {
        setColor(newColor);
      });
    } else {
      setColor('rgba(250, 35, 59, 0.1)');
    }
  }, [currentSong]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-1000 ease-in-out bg-apple-bg">
      {/* Top Left Orb */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen filter blur-[120px] opacity-70 animate-pulse"
        style={{ 
          backgroundColor: color,
          animationDuration: '8s' 
        }}
      />
      
      {/* Bottom Right Orb */}
      <div 
        className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-pulse"
        style={{ 
          backgroundColor: color,
          animationDuration: '12s',
          animationDelay: '2s'
        }}
      />
    </div>
  );
}