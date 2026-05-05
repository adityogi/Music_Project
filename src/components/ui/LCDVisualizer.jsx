import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function LCDVisualizer({ audioRef }) {
  const canvasRef = useRef(null);
  const { isPlaying, currentSong, eqBands } = usePlayerStore();
  const animationRef = useRef(null);
  const filtersRef = useRef([]);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    // 1. Initialize the Master Audio Graph
    if (!audioRef.current.__analyser) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        
        const source = audioCtx.createMediaElementSource(audioRef.current);
        
        // Create 10 Peaking Filters for the EQ
        const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
        const filters = frequencies.map(freq => {
          const filter = audioCtx.createBiquadFilter();
          filter.type = 'peaking';
          filter.frequency.value = freq;
          filter.Q.value = 1.4; // Width of the frequency band
          filter.gain.value = 0; // Starts flat
          return filter;
        });
        
        filtersRef.current = filters;

        // Chain them together: Source -> F1 -> F2... -> F10 -> Analyser -> Destination
        source.connect(filters[0]);
        for (let i = 0; i < filters.length - 1; i++) {
          filters[i].connect(filters[i + 1]);
        }
        filters[filters.length - 1].connect(analyser);
        analyser.connect(audioCtx.destination);

        audioRef.current.__audioCtx = audioCtx;
        audioRef.current.__analyser = analyser;
      } catch (e) {
        console.error("Audio Context initialization failed:", e);
        return;
      }
    }

    // --- Visualizer Paint Loop (Unchanged) ---
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = audioRef.current.__analyser;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
        ctx.fillStyle = 'rgba(250, 35, 59, 0.15)'; 
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    if (isPlaying) {
      if (audioRef.current.__audioCtx.state === 'suspended') {
        audioRef.current.__audioCtx.resume();
      }
      draw();
    } else {
      cancelAnimationFrame(animationRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [audioRef, isPlaying, currentSong]);

  // 2. React to EQ Slider Changes
  useEffect(() => {
    if (filtersRef.current.length === 10 && audioRef.current?.__audioCtx) {
      eqBands.forEach((gainValue, index) => {
        // Smoothly transition the volume of the specific frequency to prevent audio popping
        filtersRef.current[index].gain.setTargetAtTime(
          gainValue, 
          audioRef.current.__audioCtx.currentTime, 
          0.05
        );
      });
    }
  }, [eqBands]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 rounded" width={400} height={48} />;
}