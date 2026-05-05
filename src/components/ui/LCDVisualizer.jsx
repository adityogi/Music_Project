import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function LCDVisualizer({ audioRef }) {
  const canvasRef = useRef(null);
  const { isPlaying, currentSong } = usePlayerStore();
  const animationRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    // 1. Bulletproof Web Audio API Initialization
    // We attach it directly to the ref object to survive Vite's Hot Module Replacement.
    // If we recreate this context on every save, the browser will crash it for security.
    if (!audioRef.current.__analyser) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64; // Small size for chunky, aesthetic LCD bars
        
        const source = audioCtx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        audioRef.current.__audioCtx = audioCtx;
        audioRef.current.__analyser = analyser;
      } catch (e) {
        console.error("Audio Context initialization failed:", e);
        return;
      }
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = audioRef.current.__analyser;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // 2. The 60FPS Paint Loop
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Scale the height down slightly so it doesn't clip the edges of the box
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;

        // Apple Music Red, but highly transparent so it sits quietly in the background
        ctx.fillStyle = 'rgba(250, 35, 59, 0.15)'; 
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }
    };

    // 3. Play/Pause Logic
    if (isPlaying) {
      if (audioRef.current.__audioCtx.state === 'suspended') {
        audioRef.current.__audioCtx.resume();
      }
      draw();
    } else {
      cancelAnimationFrame(animationRef.current);
      // Let it clear out when paused
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [audioRef, isPlaying, currentSong]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 rounded"
      width={400} 
      height={48}
    />
  );
}