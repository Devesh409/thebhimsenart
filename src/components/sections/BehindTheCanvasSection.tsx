import React from 'react';
import { BeforeAfterSlider } from '../common/BeforeAfterSlider';

export const BehindTheCanvasSection: React.FC = () => {
  return (
    <section
      id="process"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-transparent relative border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
              04 · Studio Technique
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#faf6ee] tracking-tight [text-wrap:balance]">
              Behind the Artwork
            </h2>
          </div>

          <p className="text-sm text-[#a8a29e] max-w-md leading-relaxed">
            Drag the comparison slider or use your Left/Right arrow keys to inspect how warm tonal blocking evolves into finished chiaroscuro portraiture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Interactive Before & After Slider (7 cols) */}
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] w-full">
              <BeforeAfterSlider
                beforeImage="/artworks/profile-in-warm-tones.jpg"
                afterImage="/artworks/light-and-expression.jpg"
                beforeLabel="Stage I · Warm Tonal Blocking"
                afterLabel="Stage II · Chiaroscuro Finish"
                className="h-full w-full"
              />
            </div>
            <p className="text-xs font-serif italic text-[#8e8a83] mt-3">
              Fig. B — Direct comparison between side-profile orange-red highlight blocking and front-facing graphic shadow modeling.
            </p>
          </div>

          {/* Right: Editorial Discipline Pillars (5 cols) */}
          <div className="lg:col-span-5 divide-y divide-white/10 border-t border-b border-white/10">
            <div className="py-6">
              <span className="font-mono text-xs text-[#d4af37] font-semibold block mb-1">
                01. Ball Pen & Ink Hatching
              </span>
              <h3 className="font-serif text-xl text-[#faf6ee] mb-1.5">
                Precision Linework & Cross-Contouring
              </h3>
              <p className="text-xs text-[#a8a29e] leading-relaxed">
                Recognized for expressive ball pen portraiture and anime studies, transforming everyday ink instruments into fine-art tonal gradients.
              </p>
            </div>

            <div className="py-6">
              <span className="font-mono text-xs text-[#d4af37] font-semibold block mb-1">
                02. Watercolor Granulation
              </span>
              <h3 className="font-serif text-xl text-[#faf6ee] mb-1.5">
                Transparent Wet-on-Dry Glazing
              </h3>
              <p className="text-xs text-[#a8a29e] leading-relaxed">
                Layered cadmium and sienna washes over 300 GSM cold-press cotton sheets, preserving luminous paper highlights beneath weathered textures.
              </p>
            </div>

            <div className="py-6">
              <span className="font-mono text-xs text-[#d4af37] font-semibold block mb-1">
                03. Open Studio Documentation
              </span>
              <h3 className="font-serif text-xl text-[#faf6ee] mb-1.5">
                Multilingual Process Education
              </h3>
              <p className="text-xs text-[#a8a29e] leading-relaxed">
                Every portrait study is documented from first sketch to final glaze and shared across Instagram and YouTube in Hindi, Marathi, and English.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
