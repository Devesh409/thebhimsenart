import React from 'react';
import { useArt } from '../../context/ArtContext';

export const ArtistSection: React.FC = () => {
  const { profile } = useArt();

  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[#09090c] relative overflow-hidden border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Framed Artist Portrait (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <figure className="relative w-full max-w-sm">
              <div className="relative rounded-2xl bg-[#14141a] p-4 border border-[#d4af37]/30 shadow-2xl overflow-hidden">
                <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-black relative group">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover smooth-transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
                      {profile.profession}
                    </span>
                    <span className="text-lg font-serif text-[#faf6ee] font-medium">
                      {profile.name}
                    </span>
                  </div>
                </div>
              </div>
              <figcaption className="text-xs font-serif text-[#8e8a83] italic mt-3 text-center">
                Fig. A — Artist Ganesh Shimpi in Mumbai, India ({profile.brand}).
              </figcaption>
            </figure>
          </div>

          {/* Right Column: Editorial Monograph Statement & Provenance (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
              03 · Artist Monograph
            </span>

            <h2 className="text-4xl sm:text-5xl font-serif text-[#faf6ee] tracking-tight mb-6">
              {profile.name}
            </h2>

            {/* Editorial Reading Columns with Drop Cap */}
            <div className="space-y-5 text-base font-serif text-[#e0d9cf] leading-relaxed max-w-2xl mb-10">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-[#d4af37] first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                I am a Mumbai-based fine artist and art content creator. My work spans watercolor, acrylic painting, ball pen sketching and digital illustration, with a focus on expressive portraits.
              </p>
              <p className="text-[#b5ada0] font-sans text-sm leading-relaxed">
                Through Thebhimsenart, I share drawing tutorials, painting processes and anime sketches on Instagram and YouTube, making the creative process part of the work itself.
              </p>
            </div>

            {/* Clean Hairline Divided Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-b border-white/10">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#a8a29e] block mb-1">
                  Instagram Community
                </span>
                <div className="text-3xl font-serif font-bold text-[#faf6ee] tabular-nums">
                  {profile.stats.instagramFollowers}
                </div>
                <span className="text-xs text-[#8e8a83]">Followers on @thebhimsenart</span>
              </div>

              <div className="sm:border-l sm:border-white/10 sm:pl-6">
                <span className="text-xs uppercase tracking-widest text-[#a8a29e] block mb-1">
                  YouTube Channel
                </span>
                <div className="text-3xl font-serif font-bold text-[#faf6ee] tabular-nums">
                  {profile.stats.youtubeSubscribers}
                </div>
                <span className="text-xs text-[#8e8a83]">Subscribers worldwide</span>
              </div>

              <div className="sm:border-l sm:border-white/10 sm:pl-6">
                <span className="text-xs uppercase tracking-widest text-[#a8a29e] block mb-1">
                  Content Languages
                </span>
                <div className="text-xl font-serif font-semibold text-[#d4af37] leading-snug">
                  {profile.stats.languages}
                </div>
                <span className="text-xs text-[#8e8a83]">Accessible studio instruction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
