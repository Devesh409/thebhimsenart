import { Artwork, ArtistProfile, SocialLink } from '../types/artwork';

export const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: 'portrait-study',
    number: '01',
    title: 'Portrait study.',
    medium: 'Watercolor',
    category: 'Portraits',
    year: '2026',
    description: 'A portrait built through warm skin tones, layered washes and fine facial detail. The deep red turban anchors the composition.',
    technique: 'Layered wet-on-dry watercolor glazing over fine graphite underdrawing. Graduated cadmium red and crimson washes create rich turban volume, paired with delicate granulation for aged skin textures.',
    dimensions: '30 x 42 cm • 300 GSM Cold Press Watercolor Sheet',
    imageUrl: '/artworks/portrait-study.jpg',
    featured: true,
    status: 'published',
    tags: ['Watercolor', 'Portrait', 'Indian Culture', 'Fine Art', 'Traditional'],
    viewsCount: 1420,
    likesCount: 389,
    allowDownload: true,
    behindTheScenes: {
      story: 'Painted from an observation study in Mumbai. The intent was to capture the dignity, warmth, and resilience etched across the elder’s weathered features through transparent watercolor pigments.',
      colorPalette: ['#892b2f', '#d7895e', '#efc69f', '#5e6a82', '#2f2420'],
      toolsUsed: ['Winsor & Newton Artist Watercolors', 'Silver Black Velvet Brushes', 'Arches 300gsm Paper', '2B Graphite Pencil'],
      stages: [
        { title: 'Tonal Underdrawing', desc: 'Light graphite contouring to map anatomical planes and light direction.' },
        { title: 'Warm Skin Glazes', desc: 'Initial washes of yellow ochre, raw sienna, and burnt umber.' },
        { title: 'Turban & Fine Details', desc: 'Heavy crimson and vermilion pigment layers followed by fine whisker and wrinkle rendering.' }
      ],
      videoUrl: 'https://instagram.com/thebhimsenart'
    }
  },
  {
    id: 'profile-in-warm-tones',
    number: '02',
    title: 'Profile in warm tones.',
    medium: 'Acrylic',
    category: 'Portraits',
    year: '2026',
    description: 'A side-profile portrait using bold orange-red highlights and deep shadows, with flowing linework through the hair.',
    technique: 'Direct high-pigment acrylic application in a sketchbook study. High-contrast illumination from the front cast warm sunset tones across facial planes while flowing linework lends fluid kinetic energy.',
    dimensions: '21 x 29.7 cm • Heavyweight Mixed Media Spiral Journal',
    imageUrl: '/artworks/profile-in-warm-tones.jpg',
    featured: true,
    status: 'published',
    tags: ['Acrylic', 'Warm Tones', 'Side Profile', 'Sketchbook', 'Expressionism'],
    viewsCount: 2150,
    likesCount: 612,
    allowDownload: true,
    behindTheScenes: {
      story: 'Created live during a studio color-study session. Working on spiral-bound archival paper alongside an acrylic palette allowed spontaneous color mixing and bold, fearless brush strokes.',
      colorPalette: ['#e75836', '#fb9552', '#39171b', '#d08f7d', '#1b1417'],
      toolsUsed: ['Liquitex Heavy Body Acrylics', 'Filbert Synthetic Brushes', 'Spiral Mixed Media Journal', 'Stay-Wet Palette'],
      stages: [
        { title: 'Color Blocking', desc: 'Mapping primary shadow shapes with deep violet-burnt sienna.' },
        { title: 'Highlight Sculpting', desc: 'Applying radiant cadmium orange and pale peach along the bridge and cheekbone.' },
        { title: 'Hair & Gesture Lines', desc: 'Crisp rigger brush marks to convey flowing hair catching the sunset backlight.' }
      ],
      videoUrl: 'https://instagram.com/thebhimsenart'
    }
  },
  {
    id: 'light-and-expression',
    number: '03',
    title: 'Light & expression.',
    medium: 'Acrylic',
    category: 'Portraits',
    year: '2026',
    description: 'A front-facing portrait exploring warm light, graphic shadows and an expressive palette of reds, oranges and dark browns.',
    technique: 'Expressive alla-prima portraiture balancing acute facial lighting against deep tonal shadows. Graphic brush marks sculpt the emotion in the eyes and parted lips with intense clarity.',
    dimensions: '21 x 29.7 cm • Heavyweight Textured Mixed Media Journal',
    imageUrl: '/artworks/light-and-expression.jpg',
    featured: true,
    status: 'published',
    tags: ['Acrylic', 'Chiaroscuro', 'Emotional Portrait', 'Studio Study', 'Contemporary'],
    viewsCount: 1890,
    likesCount: 476,
    allowDownload: true,
    behindTheScenes: {
      story: 'An exploration of how harsh cinematic lighting can transform a calm expression into an intense emotional moment. Painted alongside real paint tubes and a skull prop in the Mumbai studio.',
      colorPalette: ['#d73b27', '#e88053', '#fbe1c7', '#34151b', '#1a1924'],
      toolsUsed: ['Amsterdam Acrylics', 'Flat & Round Synthetic Brushes', 'Wooden Studio Table', 'Archival Gesso Board'],
      stages: [
        { title: 'Tonal Mapping', desc: 'Locating the triangular shadow under the nose and high-contrast eye sockets.' },
        { title: 'Vibrant Light Glazes', desc: 'Building up saturated orange and rose glazes across the illuminated cheek.' },
        { title: 'Graphic Finishing', desc: 'Final expressive dark brown lines framing the jaw and wispy neck strands.' }
      ],
      videoUrl: 'https://instagram.com/thebhimsenart'
    }
  },
  {
    id: 'portrait-reimagined',
    number: '04',
    title: 'Portrait reimagined.',
    medium: 'Digital Illustration',
    category: 'Reimagined Classics',
    year: '2026',
    description: 'An Indian-inspired reinterpretation of the Mona Lisa, combining traditional clothing and jewellery with a painterly digital finish.',
    technique: 'Multi-layered digital painting utilizing custom classical oil brushes. Re-imagines Da Vinci’s sfumato masterwork with an Indian classical aesthetic—draped in a resplendent green sari, traditional bindi, nose ring, and ornate gold necklace.',
    dimensions: 'High-Resolution 4K Digital Masterwork • 4000 x 5333 px',
    imageUrl: '/artworks/portrait-reimagined.jpg',
    featured: true,
    status: 'published',
    tags: ['Digital Art', 'Classical Reimagined', 'Mona Lisa', 'Indian Heritage', 'Masterpiece'],
    viewsCount: 4320,
    likesCount: 1280,
    allowDownload: true,
    behindTheScenes: {
      story: 'What if Leonardo da Vinci had painted in ancient or classical India? This piece honors both Italian Renaissance sfumato and traditional Indian grace, adorned with a delicate nath (nose ring), royal bindi, and iridescent silk folds.',
      colorPalette: ['#284e3e', '#caa751', '#c4694e', '#3c3527', '#e8c9a3'],
      toolsUsed: ['iPad Pro 12.9 & Apple Pencil', 'Procreate Custom Impasto Brushes', 'Adobe Photoshop CC', 'Color Graded on Studio Display'],
      stages: [
        { title: 'Da Vinci Composition Study', desc: 'Aligning the iconic pyramidal pose and gentle three-quarter turn of the head.' },
        { title: 'Traditional Ornamentation', desc: 'Designing the kundan choker, floral bindi, and nose jewel with subtle light glints.' },
        { title: 'Sfumato & Fabric Harmony', desc: 'Blending misty background hills and silk fabric sheen with historical painterly brushstrokes.' }
      ],
      videoUrl: 'https://instagram.com/thebhimsenart'
    }
  }
];

export const INITIAL_ARTIST_PROFILE: ArtistProfile = {
  name: 'Ganesh Shimpi',
  brand: 'THEBHIMSENART',
  profession: 'Fine Artist & Art Content Creator',
  tagline: 'Portraits in paint, ink and pixels.',
  location: 'Mumbai, India',
  bio: 'I am a Mumbai-based fine artist and art content creator. My work spans watercolor, acrylic painting, ball pen sketching and digital illustration, with a focus on expressive portraits.\n\nThrough Thebhimsenart, I share drawing tutorials, painting processes and anime sketches on Instagram and YouTube, making the creative process part of the work itself.',
  avatarUrl: '/artworks/ganesh-shimpi-profile.jpg',
  stats: {
    instagramFollowers: '66K',
    youtubeSubscribers: '275K',
    languages: 'Hindi / Marathi / English'
  },
  contactEmail: 'artbyganesh2002@gmail.com',
  collaborations: [
    { name: 'Montex', description: 'Ball pen sketching series, pen precision tutorials & product demonstrations', category: 'Fine Writing & Sketch Instruments' },
    { name: 'Amariz', description: 'Archival fine art paper showcase, watercolor wash testing & artist review', category: 'Fine Art Surfaces' },
    { name: 'DOMS', description: 'Color pencil portraits, student-to-master tutorials & creative content', category: 'Art & Stationery Supplies' },
    { name: 'Kaco India', description: 'Gel pen ink flow demonstrations, anime sketches & expressive line work', category: 'Precision Ink Pens' }
  ],
  collaborationFormats: [
    'Instagram Reels, Stories & Posts',
    'YouTube Shorts & Dedicated Videos',
    'In-video Brand Integrations',
    'Product Demonstrations & Art Tutorials'
  ]
};

export const INITIAL_SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'instagram',
    platform: 'instagram',
    label: 'Instagram',
    username: '@thebhimsenart',
    url: 'https://instagram.com/thebhimsenart',
    followers: '66K Followers',
    enabled: true
  },
  {
    id: 'youtube',
    platform: 'youtube',
    label: 'YouTube',
    username: '@thebhimsenart',
    url: 'https://youtube.com/@thebhimsenart',
    followers: '275K Subscribers',
    enabled: true
  },
  {
    id: 'facebook',
    platform: 'facebook',
    label: 'Facebook',
    username: 'Thebhimsenart Official',
    url: 'https://facebook.com/thebhimsenart',
    followers: '12K Community',
    enabled: true
  },
  {
    id: 'pinterest',
    platform: 'pinterest',
    label: 'Pinterest',
    username: 'thebhimsenart',
    url: 'https://pinterest.com/thebhimsenart',
    followers: '35K Monthly Views',
    enabled: true
  },
  {
    id: 'behance',
    platform: 'behance',
    label: 'Behance',
    username: 'ganeshshimpi',
    url: 'https://behance.net/ganeshshimpi',
    followers: 'Portfolio Showcase',
    enabled: true
  },
  {
    id: 'linkedin',
    platform: 'linkedin',
    label: 'LinkedIn',
    username: 'Ganesh Shimpi',
    url: 'https://linkedin.com/in/ganesh-shimpi',
    followers: 'Professional Network',
    enabled: true
  }
];
