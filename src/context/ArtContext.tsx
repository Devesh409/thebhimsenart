import React, { createContext, useContext, useState, useEffect } from 'react';
import { Artwork, ArtistProfile, SocialLink, ContactInquiry } from '../types/artwork';
import { INITIAL_ARTWORKS, INITIAL_ARTIST_PROFILE, INITIAL_SOCIAL_LINKS } from '../data/initialData';

interface ArtContextType {
  artworks: Artwork[];
  publishedArtworks: Artwork[];
  profile: ArtistProfile;
  socialLinks: SocialLink[];
  inquiries: ContactInquiry[];
  favorites: string[];
  visitorCount: number;
  selectedArtworkId: string | null;
  isAdminOpen: boolean;
  isAdminAuthenticated: boolean;
  activeTheme: 'museum-dark' | 'candlelight' | 'monochrome';
  setTheme: (theme: 'museum-dark' | 'candlelight' | 'monochrome') => void;
  setSelectedArtworkId: (id: string | null) => void;
  setIsAdminOpen: (open: boolean) => void;
  addArtwork: (artwork: Partial<Artwork> & { title: string; imageUrl: string; medium: string }) => Artwork;
  updateArtwork: (id: string, updated: Partial<Artwork>) => void;
  deleteArtwork: (id: string) => void;
  reorderArtworks: (newOrder: Artwork[]) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  recordArtworkView: (id: string) => void;
  likeArtwork: (id: string) => void;
  updateProfile: (profile: Partial<ArtistProfile>) => void;
  updateSocialLinks: (links: SocialLink[]) => void;
  submitInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'read'>) => boolean;
  markInquiryRead: (id: string) => void;
  deleteInquiry: (id: string) => void;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  resetToDefaults: () => void;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => boolean;
}

const STORAGE_KEYS = {
  ARTWORKS: 'thebhimsenart_artworks_v1',
  PROFILE: 'thebhimsenart_profile_v1',
  SOCIAL: 'thebhimsenart_social_v1',
  INQUIRIES: 'thebhimsenart_inquiries_v1',
  FAVORITES: 'thebhimsenart_favorites_v1',
  VISITOR_COUNT: 'thebhimsenart_visitors_v1',
  ADMIN_AUTH: 'thebhimsenart_admin_session_v1',
  THEME: 'thebhimsenart_theme_v1'
};

const ADMIN_PASSCODE = 'thebhimsenart2026';

const ArtContext = createContext<ArtContextType | undefined>(undefined);

export const ArtProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Artworks
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARTWORKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading artworks from localStorage', e);
    }
    return INITIAL_ARTWORKS;
  });

  // 2. Profile
  const [profile, setProfile] = useState<ArtistProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading profile from localStorage', e);
    }
    return INITIAL_ARTIST_PROFILE;
  });

  // 3. Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOCIAL);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading social links from localStorage', e);
    }
    return INITIAL_SOCIAL_LINKS;
  });

  // 4. Inquiries
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading inquiries from localStorage', e);
    }
    return [
      {
        id: 'inq-initial-1',
        name: 'Montex Fine Stationery',
        email: 'collaborations@montexpen.com',
        brand: 'Montex India',
        subject: 'Ball Pen Portrait Masterclass Series',
        message: 'Loved your expressive pen sketches on Instagram! We would love to collaborate on a sponsored reel series and workshop featuring our micro-tip collection.',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        read: true
      }
    ];
  });

  // 5. Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading favorites from localStorage', e);
    }
    return ['portrait-reimagined'];
  });

  // 6. Visitor count
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VISITOR_COUNT);
      return saved ? parseInt(saved, 10) : 1845;
    } catch (e) {
      return 1845;
    }
  });

  // 7. Theme
  const [activeTheme, setActiveTheme] = useState<'museum-dark' | 'candlelight' | 'monochrome'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'candlelight' || saved === 'monochrome' || saved === 'museum-dark') return saved;
    } catch (e) {
      // fallback
    }
    return 'museum-dark';
  });

  // 8. Admin states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch (e) {
      return false;
    }
  });

  // 9. Selected artwork modal
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);

  // Sync to URL hash/query on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const artQuery = params.get('artwork');
    if (artQuery) {
      const found = artworks.find(a => a.id === artQuery);
      if (found) {
        setSelectedArtworkId(found.id);
      }
    }

    // Increment visitor count once per session
    const hasVisitedThisSession = sessionStorage.getItem('thebhimsenart_visited');
    if (!hasVisitedThisSession) {
      sessionStorage.setItem('thebhimsenart_visited', 'true');
      setVisitorCount(prev => {
        const next = prev + 1;
        try {
          localStorage.setItem(STORAGE_KEYS.VISITOR_COUNT, next.toString());
        } catch (e) {
          // ignore
        }
        return next;
      });
    }
  }, []);

  // Update URL search parameter when selectedArtworkId changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedArtworkId) {
      url.searchParams.set('artwork', selectedArtworkId);
    } else {
      url.searchParams.delete('artwork');
    }
    window.history.replaceState({}, '', url.toString());
  }, [selectedArtworkId]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(artworks));
    } catch (e) {
      console.error(e);
    }
  }, [artworks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOCIAL, JSON.stringify(socialLinks));
    } catch (e) {
      console.error(e);
    }
  }, [socialLinks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, activeTheme);
    } catch (e) {
      console.error(e);
    }
  }, [activeTheme]);

  const setTheme = (t: 'museum-dark' | 'candlelight' | 'monochrome') => {
    setActiveTheme(t);
  };

  const publishedArtworks = artworks.filter(a => a.status === 'published');

  const addArtwork = (artData: Partial<Artwork> & { title: string; imageUrl: string; medium: string }): Artwork => {
    const idSlug = artData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `art-${Date.now()}`;
    const nextNumber = String(artworks.length + 1).padStart(2, '0');

    const newArt: Artwork = {
      id: idSlug,
      number: artData.number || nextNumber,
      title: artData.title,
      medium: artData.medium || 'Watercolor',
      category: artData.category || 'Portraits',
      year: artData.year || new Date().getFullYear().toString(),
      description: artData.description || 'Expressive fine art portrait study by Ganesh Shimpi.',
      technique: artData.technique || 'Mixed traditional pigment application on archival surface.',
      dimensions: artData.dimensions || '30 x 40 cm • Archival Paper',
      imageUrl: artData.imageUrl,
      processImageUrl: artData.processImageUrl,
      featured: artData.featured ?? false,
      status: artData.status || 'published',
      tags: artData.tags && artData.tags.length > 0 ? artData.tags : [artData.medium, 'Portrait', 'Fine Art'],
      viewsCount: 1,
      likesCount: 0,
      allowDownload: artData.allowDownload ?? true,
      behindTheScenes: artData.behindTheScenes || {
        story: 'Created with expressive energy in the Mumbai studio.',
        colorPalette: ['#332219', '#c47d4c', '#e9b589', '#7f4233'],
        toolsUsed: ['Artist Quality Pigments', 'Fine Detail Brushes', 'Archival Paper']
      }
    };

    setArtworks(prev => [newArt, ...prev]);
    return newArt;
  };

  const updateArtwork = (id: string, updated: Partial<Artwork>) => {
    setArtworks(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
  };

  const deleteArtwork = (id: string) => {
    setArtworks(prev => prev.filter(a => a.id !== id));
    if (selectedArtworkId === id) {
      setSelectedArtworkId(null);
    }
  };

  const reorderArtworks = (newOrder: Artwork[]) => {
    setArtworks(newOrder);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const recordArtworkView = (id: string) => {
    setArtworks(prev => prev.map(a => a.id === id ? { ...a, viewsCount: a.viewsCount + 1 } : a));
  };

  const likeArtwork = (id: string) => {
    setArtworks(prev => prev.map(a => a.id === id ? { ...a, likesCount: a.likesCount + 1 } : a));
  };

  const updateProfile = (newProfile: Partial<ArtistProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  const updateSocialLinks = (links: SocialLink[]) => {
    setSocialLinks(links);
  };

  const submitInquiry = (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'read'>): boolean => {
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    setInquiries(prev => [newInquiry, ...prev]);
    return true;
  };

  const markInquiryRead = (id: string) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, read: true } : inq));
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
  };

  const loginAdmin = (passcode: string): boolean => {
    if (passcode.trim() === ADMIN_PASSCODE || passcode.trim().toLowerCase() === 'thebhimsenart') {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      } catch (e) {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch (e) {
      // ignore
    }
  };

  const resetToDefaults = () => {
    setArtworks(INITIAL_ARTWORKS);
    setProfile(INITIAL_ARTIST_PROFILE);
    setSocialLinks(INITIAL_SOCIAL_LINKS);
    setFavorites(['portrait-reimagined']);
    localStorage.removeItem(STORAGE_KEYS.ARTWORKS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SOCIAL);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  };

  const exportBackup = (): string => {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      artworks,
      profile,
      socialLinks,
      inquiries,
      visitorCount
    }, null, 2);
  };

  const importBackup = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.artworks)) setArtworks(data.artworks);
      if (data.profile) setProfile(data.profile);
      if (Array.isArray(data.socialLinks)) setSocialLinks(data.socialLinks);
      if (Array.isArray(data.inquiries)) setInquiries(data.inquiries);
      if (typeof data.visitorCount === 'number') setVisitorCount(data.visitorCount);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  return (
    <ArtContext.Provider
      value={{
        artworks,
        publishedArtworks,
        profile,
        socialLinks,
        inquiries,
        favorites,
        visitorCount,
        selectedArtworkId,
        isAdminOpen,
        isAdminAuthenticated,
        activeTheme,
        setTheme,
        setSelectedArtworkId,
        setIsAdminOpen,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        reorderArtworks,
        toggleFavorite,
        isFavorite,
        recordArtworkView,
        likeArtwork,
        updateProfile,
        updateSocialLinks,
        submitInquiry,
        markInquiryRead,
        deleteInquiry,
        loginAdmin,
        logoutAdmin,
        resetToDefaults,
        exportBackup,
        importBackup
      }}
    >
      {children}
    </ArtContext.Provider>
  );
};

export const useArt = () => {
  const context = useContext(ArtContext);
  if (!context) {
    throw new Error('useArt must be used within an ArtProvider');
  }
  return context;
};
