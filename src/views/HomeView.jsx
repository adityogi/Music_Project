import React from 'react';
import { Calendar, Play, ChevronRight, Mic, Disc3 } from 'lucide-react';

export default function HomeView() {
  return (
    <div className="animate-in fade-in duration-500 pt-8 pb-12">
      {/* Header */}
      <header className="mb-10 border-b border-white/5 pb-6 flex items-end justify-between">
        <h2 className="text-4xl font-bold text-on-surface tracking-tight">Discover</h2>
        <div className="hidden md:flex gap-4">
          <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 backdrop-blur-md transition-all group">
            <Calendar size={18} className="text-on-surface-variant group-hover:text-primary-container transition-colors" />
          </button>
        </div>
      </header>

      {/* On Air Now Section (Horizontal Scroll) */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-on-surface font-bold flex items-center gap-2 tracking-tight">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_rgba(var(--color-primary-container),0.8)]"></span>
            On Air Now
          </h3>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x snap-mandatory">
          {[
            { id: 1, title: 'Apple Music 1', sub: 'Live Now', img: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800&auto=format&fit=crop' },
            { id: 2, title: 'Apple Music Hits', sub: 'Up Next: Pop Mix', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop' },
            { id: 3, title: 'Apple Music Country', sub: 'Live Now', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop' },
          ].map(station => (
            <div key={station.id} className="flex-none w-[320px] md:w-[400px] snap-center group cursor-pointer">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-surface-container border border-white/5">
                <img src={station.img} alt={station.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-primary-container mb-1 tracking-widest uppercase">{station.sub}</p>
                    <h4 className="text-xl text-white font-bold leading-tight">{station.title}</h4>
                  </div>
                  <button className="w-12 h-12 rounded-full bg-primary-container/90 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    <Play size={24} className="fill-current ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid: Podcasts & Episodes */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-xl text-on-surface font-bold tracking-tight">New Episodes</h3>
            <p className="text-sm text-on-surface-variant mt-1">Catch up on the latest from your favorite hosts.</p>
          </div>
          <button className="text-primary-container text-sm font-semibold hover:text-white transition-colors flex items-center gap-1 group">
            See All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[
            { id: 1, title: 'Dandelion Radio', sub: 'Ep. 142 • Indie', color: 'from-purple-900 to-black' },
            { id: 2, title: 'The Dotty Show', sub: 'Ep. 56 • UK Rap', color: 'from-blue-900 to-black' },
            { id: 3, title: 'Time Crisis', sub: 'Ep. 210 • Rock', color: 'from-orange-900 to-black' },
            { id: 4, title: 'Strombo', sub: 'Ep. 88 • Alt', icon: Mic, color: 'from-surface-container-high to-surface-container-lowest' },
            { id: 5, title: 'Zane Lowe', sub: 'Ep. 305 • Interviews', icon: Disc3, color: 'from-surface-container to-surface-bright', hidden: 'hidden lg:block' },
          ].map(ep => (
            <div key={ep.id} className={`group cursor-pointer ${ep.hidden || ''}`}>
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-surface-container border border-white/5 shadow-lg">
                <div className={`absolute inset-0 bg-gradient-to-br ${ep.color} flex items-center justify-center`}>
                  {ep.icon ? <ep.icon size={64} className="text-white/10" /> : <div className="w-full h-full opacity-50 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=400&auto=format&fit=crop')] bg-cover" />}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-14 h-14 rounded-full bg-primary-container text-white flex items-center justify-center shadow-lg shadow-primary-container/30 hover:scale-105 transition-transform">
                    <Play size={28} className="fill-current ml-1" />
                  </div>
                </div>
              </div>
              <h4 className="text-sm text-on-surface font-bold truncate group-hover:text-primary-container transition-colors">{ep.title}</h4>
              <p className="text-[11px] font-semibold tracking-wide text-on-surface-variant/70 mt-1 truncate uppercase">{ep.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section>
        <div className="relative rounded-3xl overflow-hidden bg-surface-container border border-white/5 shadow-2xl h-[300px] md:h-[350px] group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1600&auto=format&fit=crop" alt="Concert" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
          
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-bold tracking-widest text-white w-fit mb-6 uppercase shadow-lg">Exclusive Event</span>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">Live from London</h3>
            <p className="text-base text-on-surface-variant mb-8 max-w-md leading-relaxed">Experience the intimate acoustic set, recorded live at the studios. Available now in Spatial Audio.</p>
            
            <div className="flex items-center gap-4">
              <button className="bg-primary-container text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-primary-container/90 transition-colors shadow-[0_0_20px_rgba(var(--color-primary-container),0.4)] flex items-center gap-2 hover:scale-105">
                <Play size={18} className="fill-current" /> Watch Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}