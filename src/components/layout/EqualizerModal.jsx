import React from 'react';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function EqualizerModal() {
  const { isEqOpen, toggleEq, eqBands, setEqBand, resetEq } = usePlayerStore();

  if (!isEqOpen) return null;

  const labels = ['32', '64', '125', '250', '500', '1K', '2K', '4K', '8K', '16K'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#242426] border border-apple-border rounded-2xl p-6 shadow-2xl w-full max-w-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-apple-border pb-4">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="text-apple-red" size={24} />
            <h2 className="text-xl font-bold text-white">Graphic Equalizer</h2>
          </div>
          <div className="flex gap-4">
            <button onClick={resetEq} className="text-apple-muted hover:text-white transition flex items-center gap-2 text-sm">
              <RotateCcw size={16} /> Reset
            </button>
            <button onClick={toggleEq} className="text-apple-muted hover:text-white transition">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* 10-Band Mixing Board */}
        <div className="flex justify-between items-end h-64 px-2">
          {eqBands.map((bandValue, index) => (
            <div key={index} className="flex flex-col items-center h-full">
              {/* dB Label */}
              <span className="text-xs font-mono text-apple-muted mb-4 h-4">
                {bandValue > 0 ? '+' : ''}{bandValue.toFixed(1)}
              </span>
              
              {/* Vertical Slider Wrapper */}
              <div className="relative flex-1 w-8 flex justify-center py-2">
                {/* Center Zero Line */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[2px] bg-apple-border/50 z-0 pointer-events-none" />
                
                {/* The Input */}
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.5"
                  value={bandValue}
                  onChange={(e) => setEqBand(index, parseFloat(e.target.value))}
                  // CSS hack to make range sliders vertical
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-1.5 bg-apple-border rounded-lg appearance-none cursor-ns-resize accent-apple-red z-10"
                  style={{ transform: 'translate(-50%, -50%) rotate(-90deg)' }}
                />
              </div>

              {/* Frequency Label */}
              <span className="text-xs font-semibold text-apple-muted mt-4">
                {labels[index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}