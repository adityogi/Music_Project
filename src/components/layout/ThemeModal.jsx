import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { X, Check } from 'lucide-react';

export default function ThemeModal() {
  const { currentTheme, setTheme, isThemeOpen, toggleTheme } = usePlayerStore();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) toggleTheme();
    };
    if (isThemeOpen) window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isThemeOpen, toggleTheme]);

  if (!isThemeOpen) return null;

  const themes = [
    { id: 'default', name: 'Deep Chrome', color: '#ff5357', bg: '#121317' },
    { id: 'forest', name: 'Forest Deep', color: '#00a572', bg: '#081612' },
    { id: 'slate', name: 'Monochrome Slate', color: '#00f0ff', bg: '#0a0b10' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        ref={modalRef} 
        className="w-[320px] bg-surface-container-high/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Appearance</h2>
          <button onClick={toggleTheme} className="text-on-surface-variant hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                currentTheme === theme.id 
                  ? 'bg-white/10 border-primary-container' 
                  : 'bg-surface-container hover:bg-white/5 border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-8 h-8 rounded-full border border-white/20 shadow-inner flex items-center justify-center"
                  style={{ backgroundColor: theme.bg }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.color }} />
                </div>
                <span className={`font-semibold ${currentTheme === theme.id ? 'text-white' : 'text-on-surface-variant'}`}>
                  {theme.name}
                </span>
              </div>
              {currentTheme === theme.id && <Check size={18} className="text-primary-container" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}