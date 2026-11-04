import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  addArtwork: (artwork: Partial<Artwork> & { title: string; imageUrl: string; medium: string }) => Promise<Artwork>;
  updateArtwork: (id: string, updated: Partial<Artwork>) => Promise<void>;
  deleteArtwork: (id: string) => Promise<void>;
  reorderArtworks: (newOrder: Artwork[]) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  recordArtworkView: (id: string) => void;
  likeArtwork: (id: string) => void;
  updateProfile: (profile: Partial<ArtistProfile>) => void;
  updateSocialLinks: (links: SocialLink[]) => void;
  submitInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'read'>) => Promise<boolean>;
  markInquiryRead: (id: string) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  refreshInquiries: () => Promise<void>;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => Promise<void>;
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
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARTWORKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading artworks from localStorage', e);
    }
    return INITIAL_ARTWORKS;
  });

  const [profile, setProfile] = useState<ArtistProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading profile from localStorage', e);
    }
    return INITIAL_ARTIST_PROFILE;
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOCIAL);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading social links from localStorage', e);
    }
    return INITIAL_SOCIAL_LINKS;
  });

  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading inquiries from localStorage', e);
    }
    return [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading favorites from localStorage', e);
    }
    return ['portrait-reimagined'];
  });

  const [visitorCount, setVisitorCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VISITOR_COUNT);
      return saved ? parseInt(saved, 10) : 1845;
    } catch (e) {
      return 1845;
    }
  });

  const [activeTheme, setActiveTheme] = useState<'museum-dark' | 'candlelight' | 'monochrome'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'candlelight' || saved === 'monochrome' || saved === 'museum-dark') return saved;
    } catch (e) {
      // fallback
    }
    return 'museum-dark';
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);

  // Sync customer inquiries with the local server database (/api/inquiries) + localStorage
  const refreshInquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.inquiries)) {
          setInquiries(prev => {
            // Merge server local DB records with any existing browser localStorage records
            const map = new Map<string, ContactInquiry>();
            data.inquiries.forEach((item: ContactInquiry) => map.set(item.id, item));
            prev.forEach(item => {
              if (!map.has(item.id)) {
                map.set(item.id, item);
              }
            });
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            try {
              localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(merged));
            } catch (e) {
              // ignore
            }
            return merged;
          });
        }
      }
    } catch (e) {
      // Fallback to localStorage if running as static build without server
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
        if (saved) setInquiries(JSON.parse(saved));
      } catch (err) {
        // ignore
      }
    }
  }, []);

  // Load inquiries on mount and when Admin Portal opens
  useEffect(() => {
    refreshInquiries();
  }, [refreshInquiries, isAdminOpen]);

  // Listen to storage events across tabs in the same browser
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.INQUIRIES && e.newValue) {
        try {
          setInquiries(JSON.parse(e.newValue));
        } catch (err) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // URL search parameter sync
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const artQuery = params.get('artwork');
    if (artQuery) {
      const found = artworks.find(a => a.id === artQuery);
      if (found) {
        setSelectedArtworkId(found.id);
      }
    }

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

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedArtworkId) {
      url.searchParams.set('artwork', selectedArtworkId);
    } else {
      url.searchParams.delete('artwork');
    }
    window.history.replaceState({}, '', url.toString());
  }, [selectedArtworkId]);

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

  const addArtwork = async (
    artData: Partial<Artwork> & { title: string; imageUrl: string; medium: string }
  ): Promise<Artwork> => {
    const idSlug =
      artData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 100) || `art-${Date.now()}`;
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

  const updateArtwork = async (id: string, updated: Partial<Artwork>) => {
    setArtworks(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteArtwork = async (id: string) => {
    setArtworks(prev => prev.filter(a => a.id !== id));
    if (selectedArtworkId === id) {
      setSelectedArtworkId(null);
    }
  };

  const reorderArtworks = (newOrder: Artwork[]) => {
    setArtworks(newOrder);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const recordArtworkView = (id: string) => {
    setArtworks(prev => prev.map(a => (a.id === id ? { ...a, viewsCount: a.viewsCount + 1 } : a)));
  };

  const likeArtwork = (id: string) => {
    setArtworks(prev => prev.map(a => (a.id === id ? { ...a, likesCount: a.likesCount + 1 } : a)));
  };

  const updateProfile = (newProfile: Partial<ArtistProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  const updateSocialLinks = (links: SocialLink[]) => {
    setSocialLinks(links);
  };

  // Store customer inquiry strictly in the Local Database (Server JSON file + Browser localStorage)
  const submitInquiry = async (
    inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'read'>
  ): Promise<boolean> => {
    const cleanName = String(inquiry.name || 'Visitor').trim().slice(0, 120) || 'Visitor';
    const cleanEmail = String(inquiry.email || '').trim().slice(0, 200);
    const cleanBrand = String(inquiry.brand || '').trim().slice(0, 150);
    const cleanSubject =
      String(inquiry.subject || 'Artwork Acquisition / Brand Collaboration')
        .trim()
        .slice(0, 200) || 'Artwork Inquiry';
    const cleanMessage = String(inquiry.message || '').trim().slice(0, 4000);

    let savedRecord: ContactInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      brand: cleanBrand,
      subject: cleanSubject,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      read: false
    };

    // 1. Save to Local Server JSON Database (/api/inquiries)
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          brand: cleanBrand,
          subject: cleanSubject,
          message: cleanMessage
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.inquiry) {
          savedRecord = data.inquiry;
        }
      }
    } catch (e) {
      // Static build fallback uses browser localStorage directly
    }

    // 2. Save synchronously to browser localStorage and update React state
    setInquiries(prev => {
      const next = [savedRecord, ...prev.filter(item => item.id !== savedRecord.id)];
      try {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(next));
      } catch (e) {
        console.error('Error saving inquiry to localStorage', e);
      }
      return next;
    });

    return true;
  };

  const markInquiryRead = async (id: string) => {
    setInquiries(prev => {
      const next = prev.map(inq => (inq.id === id ? { ...inq, read: true } : inq));
      try {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });

    try {
      await fetch(`/api/inquiries/${encodeURIComponent(id)}/read`, {
        method: 'PATCH'
      });
    } catch (e) {
      // ignore
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiries(prev => {
      const next = prev.filter(inq => inq.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });

    try {
      await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {
      // ignore
    }
  };

  const loginAdmin = (passcode: string): boolean => {
    if (passcode.trim() === ADMIN_PASSCODE || passcode.trim().toLowerCase() === 'thebhimsenart') {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      } catch (e) {
        // ignore
      }
      refreshInquiries();
      return true;
    }
    return false;
  };

  const logoutAdmin = async () => {
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
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        artworks,
        profile,
        socialLinks,
        inquiries,
        visitorCount
      },
      null,
      2
    );
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
        refreshInquiries,
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
