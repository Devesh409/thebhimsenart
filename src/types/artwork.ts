export interface Artwork {
  id: string;
  number: string;
  title: string;
  medium: string;
  category: string;
  year: string;
  description: string;
  technique: string;
  dimensions?: string;
  imageUrl: string;
  processImageUrl?: string;
  featured: boolean;
  status: 'published' | 'draft';
  tags: string[];
  viewsCount: number;
  likesCount: number;
  allowDownload: boolean;
  behindTheScenes?: {
    story: string;
    colorPalette: string[];
    toolsUsed: string[];
    stages?: { title: string; desc: string; imageUrl?: string }[];
    videoUrl?: string;
  };
}

export interface SocialLink {
  id: string;
  platform: 'instagram' | 'youtube' | 'facebook' | 'pinterest' | 'behance' | 'linkedin' | 'website' | 'other';
  label: string;
  username: string;
  url: string;
  followers?: string;
  enabled: boolean;
}

export interface BrandCollaboration {
  name: string;
  description?: string;
  category?: string;
}

export interface ArtistProfile {
  name: string;
  brand: string;
  profession: string;
  tagline: string;
  location: string;
  bio: string;
  avatarUrl: string;
  stats: {
    instagramFollowers: string;
    youtubeSubscribers: string;
    languages: string;
  };
  contactEmail: string;
  collaborations: BrandCollaboration[];
  collaborationFormats: string[];
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  brand?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}
