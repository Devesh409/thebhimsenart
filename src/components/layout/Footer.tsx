import React from 'react';
import { useArt } from '../../context/ArtContext';
import { Lock, ArrowUp, Users } from 'lucide-react';

export const Footer: React.FC = () => {
  const { visitorCount, setIsAdminOpen } = useArt();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070709] border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8 text-xs text-[#a8a29e]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/10">
          <div className="text-center md:text-left">
            <span className="font-display text-lg tracking-widest text-[#faf6ee] font-bold block mb-1">
              THEBHIMSENART
            </span>
            <p className="text-xs text-[#8e8a83]">
              Ganesh Shimpi · Fine Artist & Art Content Creator · Mumbai, India
            </p>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#111116] border border-white/10 text-xs">
            <Users className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[#faf6ee] font-mono font-semibold tabular-nums">
              {visitorCount.toLocaleString()}
            </span>
            <span className="text-xs text-[#8e8a83]">Exhibition Visitors</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] rounded-lg bg-white/5 hover:bg-white/10 text-[#faf6ee] smooth-transition"
          >
            <span>Return to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#d4af37]" />
          </button>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8e8a83]">
          <p>
            © {new Date().getFullYear()} THEBHIMSENART. All original portraits, paintings, and digital illustrations by Ganesh Shimpi.
          </p>

          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg text-[#a8a29e] hover:text-[#d4af37] smooth-transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Curator Portal</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
