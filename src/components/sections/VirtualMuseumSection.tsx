import React, { useState } from 'react';
import { VirtualMuseumRoom } from '../gallery3d/VirtualMuseumRoom';

export const VirtualMuseumSection: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <section
      id="virtual-museum"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#08080a] border-t border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
              01 · Spatial Exhibition Hall
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#faf6ee] tracking-tight [text-wrap:balance]">
              3D Virtual Museum Gallery
            </h2>
            <p className="text-sm text-[#a8a29e] mt-2 max-w-2xl leading-relaxed">
              Explore the permanent collection illuminated inside our virtual exhibition hall. Select a wing preset below, step through individual paintings, or click any frame to launch the high-resolution archival viewer.
            </p>
          </div>

          <div className="text-xs text-[#a8a29e] flex items-center gap-2 shrink-0">
            <span>Drag canvas to look</span>
            <span aria-hidden="true">·</span>
            <span>Click painting to inspect</span>
            <span aria-hidden="true">·</span>
            <span>Press H to toggle HUD</span>
          </div>
        </div>

        <div
          className={`relative rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl transition-all duration-300 ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'min-h-[580px] lg:min-h-[650px]'
          }`}
        >
          <VirtualMuseumRoom
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        </div>
      </div>
    </section>
  );
};
