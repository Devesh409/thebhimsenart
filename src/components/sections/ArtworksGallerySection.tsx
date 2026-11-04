import React, { useState, useMemo } from 'react';
import { useArt } from '../../context/ArtContext';
import {
  Search,
  Eye,
  Heart,
  Layers,
  LayoutGrid,
  List,
  ArrowUpRight,
  X
} from 'lucide-react';

export const ArtworksGallerySection: React.FC = () => {
  const { publishedArtworks, setSelectedArtworkId, isFavorite, toggleFavorite, likeArtwork } = useArt();

  const [selectedMedium, setSelectedMedium] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'number' | 'views' | 'likes'>('number');
  const [viewMode, setViewMode] = useState<'3d-grid' | 'wall' | 'compact'>('3d-grid');

  const allMediums = useMemo(() => {
    const set = new Set<string>();
    publishedArtworks.forEach(a => set.add(a.medium));
    return ['All', ...Array.from(set), 'Favorites'];
  }, [publishedArtworks]);

  const filteredArtworks = useMemo(() => {
    return publishedArtworks
      .filter(art => {
        if (selectedMedium === 'Favorites') {
          if (!isFavorite(art.id)) return false;
        } else if (selectedMedium !== 'All') {
          if (art.medium !== selectedMedium) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = art.title.toLowerCase().includes(q);
          const matchDesc = art.description.toLowerCase().includes(q);
          const matchMedium = art.medium.toLowerCase().includes(q);
          const matchTags = art.tags.some(t => t.toLowerCase().includes(q));
          return matchTitle || matchDesc || matchMedium || matchTags;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'views') return b.viewsCount - a.viewsCount;
        if (sortBy === 'likes') return b.likesCount - a.likesCount;
        return a.number.localeCompare(b.number);
      });
  }, [publishedArtworks, selectedMedium, searchQuery, sortBy, isFavorite]);

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 bg-transparent relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
              02 · Permanent Collection
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#faf6ee] tracking-tight [text-wrap:balance]">
              Curated Masterworks
            </h2>
          </div>

          <p className="text-sm text-[#a8a29e] max-w-md leading-relaxed">
            Original works from the artist&apos;s official archive. Filter by medium or search by technique to inspect high-resolution pigment layers.
          </p>
        </div>

        {/* Accessible Filter & View Toolbar */}
        <div className="p-4 rounded-xl bg-[#121217] border border-white/10 shadow-xl mb-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Segmented Medium Filter Buttons */}
          <div
            role="tablist"
            aria-label="Filter artworks by medium"
            className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white/5 rounded-lg"
          >
            {allMediums.map(medium => (
              <button
                key={medium}
                type="button"
                role="tab"
                aria-selected={selectedMedium === medium}
                onClick={() => setSelectedMedium(medium)}
                className={`px-4 py-2 min-h-[38px] rounded-md text-xs font-medium whitespace-nowrap shrink-0 smooth-transition ${
                  selectedMedium === medium
                    ? 'bg-[#d4af37] text-[#0b0b0f] font-semibold shadow-sm'
                    : 'text-[#d8cbb7] hover:text-[#faf6ee] hover:bg-white/5'
                }`}
              >
                {medium === 'Favorites' ? 'Saved Works' : medium}
              </button>
            ))}
          </div>

          {/* Search, Sort & Layout Switcher */}
          <div className="flex flex-wrap items-center gap-3 justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#8e8a83] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                aria-label="Search artworks by title, medium, or tag"
                placeholder="Search title or medium..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 min-h-[40px] rounded-lg bg-white/5 border border-white/10 text-xs text-[#faf6ee] placeholder-[#8e8a83] focus:outline-none focus:border-[#d4af37] smooth-transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#a8a29e] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              aria-label="Sort artworks"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="px-3.5 py-2 min-h-[40px] rounded-lg bg-[#181822] border border-white/10 text-xs text-[#d8cbb7] focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="number">Catalogue Order</option>
              <option value="views">Most Viewed</option>
              <option value="likes">Most Appreciated</option>
            </select>

            <div
              role="group"
              aria-label="Gallery layout view"
              className="flex items-center bg-white/5 p-1 rounded-lg border border-white/10"
            >
              <button
                type="button"
                onClick={() => setViewMode('3d-grid')}
                aria-pressed={viewMode === '3d-grid'}
                className={`p-2 min-h-[34px] min-w-[34px] rounded-md smooth-transition flex items-center justify-center ${
                  viewMode === '3d-grid' ? 'bg-[#d4af37] text-[#0b0b0f]' : 'text-[#a8a29e] hover:text-white'
                }`}
                title="Grid Catalogue"
                aria-label="Grid Catalogue"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('wall')}
                aria-pressed={viewMode === 'wall'}
                className={`p-2 min-h-[34px] min-w-[34px] rounded-md smooth-transition flex items-center justify-center ${
                  viewMode === 'wall' ? 'bg-[#d4af37] text-[#0b0b0f]' : 'text-[#a8a29e] hover:text-white'
                }`}
                title="Editorial Monograph View"
                aria-label="Editorial Monograph View"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                aria-pressed={viewMode === 'compact'}
                className={`p-2 min-h-[34px] min-w-[34px] rounded-md smooth-transition flex items-center justify-center ${
                  viewMode === 'compact' ? 'bg-[#d4af37] text-[#0b0b0f]' : 'text-[#a8a29e] hover:text-white'
                }`}
                title="Archival Index Table"
                aria-label="Archival Index Table"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {filteredArtworks.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#121217] border border-white/10 text-sm text-[#a8a29e]">
            No artworks match your filter criteria.{' '}
            <button
              type="button"
              onClick={() => {
                setSelectedMedium('All');
                setSearchQuery('');
              }}
              className="text-[#d4af37] underline ml-1 font-medium"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* VIEW 1: CATALOGUE GRID */}
        {viewMode === '3d-grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredArtworks.map(art => {
              const fav = isFavorite(art.id);
              return (
                <article
                  key={art.id}
                  className="group relative rounded-xl bg-[#121217] border border-white/10 hover:border-[#d4af37]/50 smooth-transition flex flex-col overflow-hidden shadow-xl hover:-translate-y-1"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedArtworkId(art.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedArtworkId(art.id);
                      }
                    }}
                    aria-label={`Inspect ${art.title}, ${art.medium}`}
                    className="relative aspect-[3/4] overflow-hidden bg-[#09090c] cursor-pointer p-4 flex items-center justify-center"
                  >
                    <div className="relative w-full h-full p-2.5 rounded bg-gradient-to-br from-[#26211a] via-[#141312] to-[#201a14] border-2 border-[#382d1c] shadow-2xl flex items-center justify-center smooth-transition group-hover:scale-[1.02]">
                      <div className="p-0.5 rounded bg-[#c5a880]/30 w-full h-full shadow-inner flex items-center justify-center">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded select-none"
                        />
                      </div>
                    </div>

                    {/* Save Favorite Button */}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(art.id);
                        if (!fav) likeArtwork(art.id);
                      }}
                      aria-label={fav ? `Remove ${art.title} from saved works` : `Save ${art.title}`}
                      className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center smooth-transition z-10 ${
                        fav
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-black/75 text-[#d8cbb7] hover:text-white border border-white/15'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${fav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 smooth-transition flex items-end justify-center p-5 pointer-events-none">
                      <span className="px-4 py-2 rounded-lg bg-[#d4af37] text-[#0b0b0f] font-semibold text-xs flex items-center gap-1.5 shadow-2xl">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Artwork</span>
                      </span>
                    </div>
                  </div>

                  {/* Clean Unboxed Curatorial Caption */}
                  <div className="p-5 flex flex-col justify-between flex-1 border-t border-white/10">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[#a8a29e] mb-1.5 font-sans">
                        <span className="font-mono text-[#d4af37] font-semibold tabular-nums">
                          No. {art.number}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{art.medium}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{art.year}</span>
                      </div>

                      <h3
                        onClick={() => setSelectedArtworkId(art.id)}
                        className="font-serif text-xl text-[#faf6ee] font-medium cursor-pointer hover:text-[#d4af37] smooth-transition leading-snug"
                      >
                        {art.title}
                      </h3>

                      <p className="text-xs text-[#a8a29e] line-clamp-2 mt-2 leading-relaxed">
                        {art.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-[#8e8a83] tabular-nums">
                        {art.viewsCount.toLocaleString()} views · {art.likesCount.toLocaleString()} appreciations
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedArtworkId(art.id)}
                        className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 hover:underline py-1"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* VIEW 2: EDITORIAL MONOGRAPH VIEW */}
        {viewMode === 'wall' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArtworks.map(art => (
              <article
                key={art.id}
                onClick={() => setSelectedArtworkId(art.id)}
                className="group p-6 rounded-2xl bg-[#121217] border border-white/10 hover:border-[#d4af37]/50 cursor-pointer smooth-transition flex flex-col sm:flex-row items-center gap-6 shadow-2xl"
              >
                <div className="w-full sm:w-48 aspect-[3/4] flex-shrink-0 p-2.5 rounded bg-gradient-to-br from-[#2a231b] via-[#141312] to-[#251e16] border-2 border-[#382d1c] shadow-xl flex items-center justify-center">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-[#a8a29e] mb-2">
                      <span className="font-mono text-[#d4af37] font-semibold">ACC. 2026.{art.number}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{art.medium}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#faf6ee] mb-2 group-hover:text-[#d4af37] smooth-transition">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#b5ada0] leading-relaxed mb-4">{art.description}</p>
                    <p className="text-xs text-[#8e8a83] leading-relaxed border-t border-white/10 pt-3">
                      <strong className="text-[#d8cbb7] font-medium">Technique:</strong> {art.technique}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between text-xs text-[#d4af37] font-semibold">
                    <span>Open High-Resolution Viewer</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* VIEW 3: ARCHIVAL INDEX LIST */}
        {viewMode === 'compact' && (
          <div className="divide-y divide-white/10 rounded-xl bg-[#121217] border border-white/10 overflow-hidden shadow-2xl">
            {filteredArtworks.map(art => (
              <div
                key={art.id}
                onClick={() => setSelectedArtworkId(art.id)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 cursor-pointer smooth-transition"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-[#d4af37] w-8 tabular-nums">{art.number}</span>
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-14 object-cover rounded border border-white/10"
                  />
                  <div>
                    <h4 className="font-serif text-base text-[#faf6ee] font-medium">{art.title}</h4>
                    <span className="text-xs text-[#a8a29e]">
                      {art.medium} · {art.category} · {art.year}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[#8e8a83] hidden sm:inline tabular-nums">
                    {art.viewsCount.toLocaleString()} views
                  </span>
                  <button
                    type="button"
                    className="px-4 py-2 min-h-[38px] rounded-lg bg-white/5 hover:bg-[#d4af37] text-xs text-[#d4af37] hover:text-[#0b0b0e] font-semibold smooth-transition"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
