import React, { useEffect, useRef } from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function EqualizerModal() {
  const { isEqOpen, toggleEq, eqBands, setEqBand, resetEq } = usePlayerStore();
  const modalRef = useRef(null);
  
  const frequencies = ['32', '64', '125', '250', '500', '1K', '2K', '4K', '8K', '16K'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) toggleEq();
    };
    if (isEqOpen) window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isEqOpen, toggleEq]);

  if (!isEqOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        ref={modalRef} 
        className="w-full max-w-2xl bg-surface-container-high/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-container/20 rounded-lg text-primary-container">
              <SlidersHorizontal size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Equalizer</h2>
              <p className="text-sm text-on-surface-variant font-medium">10-Band Graphic EQ</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={resetEq}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors text-sm font-semibold border border-white/5"
            >
              <RotateCcw size={16} /> Reset
            </button>
            <button onClick={toggleEq} className="p-2 text-on-surface-variant hover:text-white transition-colors rounded-full hover:bg-white/10">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="flex justify-between items-center h-64 px-4">
          {eqBands.map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-6 h-full">
              <span className="text-xs font-bold text-on-surface-variant">{value > 0 ? `+${value}` : value}</span>
              
              <div className="relative flex-1 flex items-center justify-center w-8">
                {/* Zero Line */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/10 rounded pointer-events-none z-0"></div>
                
                {/* Vertical Range Input */}
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.5"
                  value={value}
                  onChange={(e) => setEqBand(index, parseFloat(e.target.value))}
                  className="absolute w-48 h-1 bg-white/10 rounded-full appearance-none outline-none cursor-pointer -rotate-90 origin-center z-10"
                  style={{
                    background: `linear-gradient(to right, rgba(var(--color-primary-container), 0.2) 0%, var(--color-primary-container) ${(value + 12) / 24 * 100}%, rgba(255,255,255,0.1) ${(value + 12) / 24 * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>

              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mt-2">
                {frequencies[index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}