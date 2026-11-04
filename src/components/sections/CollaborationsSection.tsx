import React from 'react';
import { useArt } from '../../context/ArtContext';
import { ArrowRight } from 'lucide-react';

export const CollaborationsSection: React.FC = () => {
  const { profile } = useArt();

  return (
    <section
      id="collaborations"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[#09090c] border-t border-white/10 relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
              05 · Commercial Partnerships
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#faf6ee] tracking-tight [text-wrap:balance]">
              Art. Content. Collaboration.
            </h2>
          </div>

          <p className="text-base font-serif italic text-[#d8cbb7] max-w-md">
            &ldquo;Let&apos;s bring your next creative project to life.&rdquo;
          </p>
        </div>

        {/* Previous Brand Collaborations Grid (Single-Elevation Depth) */}
        <div className="mb-14">
          <h3 className="text-xs uppercase tracking-widest text-[#a8a29e] font-semibold mb-6">
            Previous Brand Collaborations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profile.collaborations.map(collab => (
              <div
                key={collab.name}
                className="p-6 rounded-xl bg-[#121217] border border-white/10 hover:border-[#d4af37]/40 smooth-transition flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-serif font-bold text-[#faf6ee] mb-1">
                    {collab.name}
                  </div>
                  {collab.category && (
                    <span className="text-xs text-[#d4af37] block mb-3">
                      {collab.category}
                    </span>
                  )}
                </div>
                {collab.description && (
                  <p className="text-xs text-[#a8a29e] leading-relaxed border-t border-white/10 pt-3">
                    {collab.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Formats */}
        <div className="pt-10 border-t border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-3">
              Collaboration Formats
            </h3>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#faf6ee] font-medium">
              {profile.collaborationFormats.map((format, idx) => (
                <React.Fragment key={format}>
                  <span>{format}</span>
                  {idx < profile.collaborationFormats.length - 1 && (
                    <span aria-hidden="true" className="text-[#d4af37]">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[44px] rounded-lg bg-[#d4af37] hover:bg-[#e3c14d] text-[#0b0b0e] text-xs font-semibold smooth-transition shrink-0 shadow-md"
          >
            <span>Discuss a Partnership</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
