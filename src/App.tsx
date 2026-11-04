/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArtProvider, useArt } from './context/ArtContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { VirtualMuseumSection } from './components/sections/VirtualMuseumSection';
import { ArtworksGallerySection } from './components/sections/ArtworksGallerySection';
import { ArtistSection } from './components/sections/ArtistSection';
import { BehindTheCanvasSection } from './components/sections/BehindTheCanvasSection';
import { CollaborationsSection } from './components/sections/CollaborationsSection';
import { SocialMediaSection } from './components/sections/SocialMediaSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';
import { ArtworkModal } from './components/artwork/ArtworkModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';

const MainExperience: React.FC = () => {
  const { selectedArtworkId, setSelectedArtworkId, isAdminOpen, setIsAdminOpen, activeTheme } = useArt();

  const themeClass =
    activeTheme === 'candlelight'
      ? 'theme-candlelight bg-[#110e0b] text-[#f7ecd7]'
      : activeTheme === 'monochrome'
      ? 'theme-monochrome bg-[#080808] text-[#e6e6e6]'
      : 'theme-museum bg-[#0b0b0e] text-[#e8e4dc]';

  return (
    <div className={`min-h-screen ${themeClass} font-sans smooth-transition selection:bg-[#d4af37]/30 selection:text-[#faf6ee]`}>
      {/* Top Bar Navigation */}
      <Navbar />

      {/* Main Exhibition Content */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <HeroSection />
        <VirtualMuseumSection />
        <ArtworksGallerySection />
        <ArtistSection />
        <BehindTheCanvasSection />
        <CollaborationsSection />
        <SocialMediaSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Artwork Detail Inspector Modal */}
      {selectedArtworkId && (
        <ArtworkModal
          artworkId={selectedArtworkId}
          onClose={() => setSelectedArtworkId(null)}
        />
      )}

      {/* Artist Studio Admin Modal */}
      {isAdminOpen && (
        <AdminDashboardModal
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ArtProvider>
      <MainExperience />
    </ArtProvider>
  );
}
