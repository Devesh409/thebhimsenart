import React from 'react';
import { useArt } from '../../context/ArtContext';
import {
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  Globe,
  ExternalLink,
  Play
} from 'lucide-react';

export const SocialMediaSection: React.FC = () => {
  const { socialLinks } = useArt();

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-[#d4af37]" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-[#d4af37]" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-[#d4af37]" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-[#d4af37]" />;
      default:
        return <Globe className="w-5 h-5 text-[#d4af37]" />;
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
              06 · Digital Channels
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#faf6ee] tracking-tight">
              Connect With THEBHIMSENART
            </h2>
          </div>
          <p className="text-sm text-[#a8a29e] max-w-md">
            Follow studio painting processes, portrait studies, and tutorials across official channels.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {socialLinks.filter(s => s.enabled).map(item => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-[#121217] border border-white/10 hover:border-[#d4af37]/40 smooth-transition flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {getPlatformIcon(item.platform)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#faf6ee] truncate">{item.label}</h3>
                  <span className="text-xs text-[#d4af37] font-mono block truncate">{item.username}</span>
                  {item.followers && (
                    <span className="text-xs text-[#8e8a83] block mt-0.5 tabular-nums">{item.followers}</span>
                  )}
                </div>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 min-h-[40px] rounded-lg bg-white/5 group-hover:bg-[#d4af37] text-xs text-[#faf6ee] group-hover:text-[#0b0b0e] font-semibold inline-flex items-center gap-1.5 smooth-transition shrink-0 whitespace-nowrap"
              >
                <span>Follow</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#121217] border border-[#d4af37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
              <Play className="w-5 h-5 fill-[#d4af37]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold block">
                Video Archive & Demonstrations
              </span>
              <h3 className="text-lg font-serif text-[#faf6ee] font-medium">
                Portrait Drawing & Watercolor Tutorials on YouTube
              </h3>
              <p className="text-xs text-[#a8a29e] mt-0.5">
                Subscribe to @thebhimsenart (275K subscribers) for full-length demonstrations.
              </p>
            </div>
          </div>

          <a
            href="https://youtube.com/@thebhimsenart"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-lg bg-[#d4af37] hover:bg-[#e3c14d] text-[#0b0b0e] text-xs font-semibold smooth-transition shrink-0 whitespace-nowrap"
          >
            <span>Watch On YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
