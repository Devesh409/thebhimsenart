import React from 'react';
import { FloatingFrame3D } from '../gallery3d/FloatingFrame3D';
import { useArt } from '../../context/ArtContext';
import { Compass, ArrowDown, Eye, Shuffle, Heart, Sun, Moon, Flame, Lock } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    profile,
    publishedArtworks,
    favorites,
    setSelectedArtworkId,
    activeTheme,
    setTheme,
    setIsAdminOpen,
    isAdminAuthenticated
  } = useArt();

  const handleRandomArtwork = () => {
    if (publishedArtworks.length === 0) return;
    const randomIdx = Math.floor(Math.random() * publishedArtworks.length);
    setSelectedArtworkId(publishedArtworks[randomIdx].id);
  };

  return (
    <section className="relative flex flex-col justify-between pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
      {/* Subtle Ambient Background Illumination */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[520px] bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.10)_0%,_rgba(0,0,0,0)_70%)] pointer-events-none" />

      {/* Operational & Curatorial Utility Ribbon */}
      <div className="max-w-7xl mx-auto w-full pb-8 mb-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#a8a29e]">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="uppercase tracking-widest text-[#d4af37] font-semibold">
            Exhibition Catalogue · 2026
          </span>
          <span aria-hidden="true">·</span>
          <span>{profile.location}</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Watercolor / Acrylic / Digital Illustration</span>
        </div>

        {/* Interactive Museum Utilities & Theme Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRandomArtwork}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg bg-white/5 hover:bg-white/10 text-[#e8e4dc] hover:text-[#d4af37] border border-white/10 smooth-transition whitespace-nowrap shrink-0"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Discover Random Work</span>
          </button>

          <a
            href="#gallery"
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg bg-white/5 hover:bg-white/10 text-[#e8e4dc] border border-white/10 smooth-transition whitespace-nowrap shrink-0"
          >
            <Heart className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="tabular-nums">Saved ({favorites.length})</span>
          </a>

          {/* Gallery Ambiance Segmented Switcher */}
          <div
            role="group"
            aria-label="Gallery lighting ambiance"
            className="inline-flex items-center p-1 rounded-lg bg-white/5 border border-white/10"
          >
            <button
              type="button"
              onClick={() => setTheme('museum-dark')}
              aria-pressed={activeTheme === 'museum-dark'}
              title="Museum Dark Lighting"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[32px] rounded-md text-xs font-medium smooth-transition whitespace-nowrap shrink-0 ${
                activeTheme === 'museum-dark'
                  ? 'bg-[#d4af37] text-[#0b0b0e] font-semibold'
                  : 'text-[#a8a29e] hover:text-[#faf6ee]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Obsidian</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('candlelight')}
              aria-pressed={activeTheme === 'candlelight'}
              title="Warm Candlelight Ambiance"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[32px] rounded-md text-xs font-medium smooth-transition whitespace-nowrap shrink-0 ${
                activeTheme === 'candlelight'
                  ? 'bg-[#d4af37] text-[#0b0b0e] font-semibold'
                  : 'text-[#a8a29e] hover:text-[#faf6ee]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Warm</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('monochrome')}
              aria-pressed={activeTheme === 'monochrome'}
              title="Stark Gallery Contrast"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[32px] rounded-md text-xs font-medium smooth-transition whitespace-nowrap shrink-0 ${
                activeTheme === 'monochrome'
                  ? 'bg-[#d4af37] text-[#0b0b0e] font-semibold'
                  : 'text-[#a8a29e] hover:text-[#faf6ee]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stark</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            aria-label="Open Studio Curator Portal"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg border smooth-transition whitespace-nowrap shrink-0 ${
              isAdminAuthenticated
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                : 'bg-white/5 border-white/10 text-[#a8a29e] hover:text-[#faf6ee]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isAdminAuthenticated ? 'Curator Active' : 'Curator'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Exhibition Marquee */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 my-auto py-4">
        {/* Left Column: Curatorial Headline & Introduction (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#a8a29e] mb-4">
            <span className="text-[#d4af37] font-semibold">{profile.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.profession}</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-[5.25rem] font-serif text-[#faf6ee] tracking-tight leading-[0.96] mb-6 [text-wrap:balance]">
            Ganesh <span className="gold-gradient-text font-serif italic font-normal">Shimpi</span>
          </h1>

          <p className="text-2xl sm:text-3xl font-serif text-[#e0d8c8] italic mb-6 max-w-xl [text-wrap:balance]">
            &ldquo;{profile.tagline}&rdquo;
          </p>

          <p className="text-sm sm:text-base text-[#b5ada0] max-w-xl leading-relaxed mb-8">
            Step into a permanent digital archive of expressive portraits built through transparent watercolor washes, tactile alla-prima acrylics, and classical Indian digital reinterpretations.
          </p>

          {/* Primary & Secondary Action Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#virtual-museum"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-lg bg-[#d4af37] hover:bg-[#e3c14d] text-[#0b0b0e] font-semibold text-sm smooth-transition whitespace-nowrap shrink-0 shadow-lg"
            >
              <Compass className="w-4 h-4" />
              <span>Enter 3D Virtual Museum</span>
            </a>

            <a
              href="#gallery"
              className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[48px] rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-[#faf6ee] border border-white/10 smooth-transition whitespace-nowrap shrink-0"
            >
              <span>Browse Catalogue</span>
              <ArrowDown className="w-4 h-4 text-[#d4af37]" />
            </a>
          </div>
        </div>

        {/* Right Column: Interactive 3D Floating Frame Showcase (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
            <div className="absolute inset-0 bg-[#d4af37]/10 filter blur-3xl rounded-full pointer-events-none" />

            <FloatingFrame3D
              imageUrl="/artworks/portrait-reimagined.jpg"
              onClick={() => setSelectedArtworkId('portrait-reimagined')}
            />

            <button
              type="button"
              onClick={() => setSelectedArtworkId('portrait-reimagined')}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#14141a]/95 px-5 py-3 min-h-[48px] rounded-xl border border-[#d4af37]/40 shadow-2xl flex items-center gap-3 smooth-transition hover:border-[#d4af37] group whitespace-nowrap"
            >
              <div className="text-left">
                <div className="text-xs font-serif text-[#faf6ee] font-semibold group-hover:text-[#d4af37] smooth-transition">
                  Fig. 04 · Portrait Reimagined
                </div>
                <div className="text-[11px] text-[#a8a29e]">
                  Digital Illustration · Click to Inspect Masterwork
                </div>
              </div>
              <Eye className="w-4 h-4 text-[#d4af37] shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width 4-Column Institutional Metrics & Provenance Strip */}
      <div className="max-w-7xl mx-auto w-full mt-16 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#a8a29e] block mb-1">
            Instagram Reach
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-semibold text-[#faf6ee] tabular-nums">
            {profile.stats.instagramFollowers}
          </span>
          <span className="text-xs text-[#8e8a83] block mt-0.5">
            Verified @thebhimsenart followers
          </span>
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-[#a8a29e] block mb-1">
            YouTube Subscribers
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-semibold text-[#faf6ee] tabular-nums">
            {profile.stats.youtubeSubscribers}
          </span>
          <span className="text-xs text-[#8e8a83] block mt-0.5">
            Art tutorials & studio demonstrations
          </span>
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-[#a8a29e] block mb-1">
            Primary Mediums
          </span>
          <span className="text-lg sm:text-xl font-serif font-medium text-[#faf6ee] block">
            Watercolor · Acrylic · Ink
          </span>
          <span className="text-xs text-[#8e8a83] block mt-0.5">
            Archival cotton & digital canvas
          </span>
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-[#a8a29e] block mb-1">
            Broadcast Languages
          </span>
          <span className="text-lg sm:text-xl font-serif font-medium text-[#d4af37] block">
            {profile.stats.languages}
          </span>
          <span className="text-xs text-[#8e8a83] block mt-0.5">
            Accessible art education across India
          </span>
        </div>
      </div>
    </section>
  );
};
