import React, { useState } from 'react';
import { useArt } from '../../context/ArtContext';
import { Artwork, SocialLink, BrandCollaboration } from '../../types/artwork';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Check,
  Lock,
  LogOut,
  Upload,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Share2,
  Mail,
  User,
  Database,
  ExternalLink,
  Eye,
  AlertTriangle,
  Download,
  FileText
} from 'lucide-react';

interface AdminDashboardModalProps {
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ onClose }) => {
  const {
    artworks,
    profile,
    socialLinks,
    inquiries,
    visitorCount,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    reorderArtworks,
    updateProfile,
    updateSocialLinks,
    markInquiryRead,
    deleteInquiry,
    refreshInquiries,
    resetToDefaults,
    exportBackup,
    importBackup
  } = useArt();

  // Auth state
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab state
  const [activeTab, setActiveTab] = useState<'artworks' | 'profile' | 'social' | 'collaborations' | 'inquiries' | 'backup'>('artworks');

  // Artwork Editor modal / state
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [isAddingArtwork, setIsAddingArtwork] = useState(false);

  // Form states for artwork Add/Edit
  const [artForm, setArtForm] = useState({
    title: '',
    medium: 'Watercolor',
    category: 'Portraits',
    year: '2026',
    description: '',
    technique: '',
    dimensions: '30 x 42 cm • Archival Paper',
    imageUrl: '',
    featured: false,
    status: 'published' as 'published' | 'draft',
    tags: 'Watercolor, Portrait, Fine Art',
    allowDownload: true
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(passcode)) {
      setAuthError('');
    } else {
      setAuthError('Invalid admin passcode. Please try again.');
    }
  };

  // Open Add Artwork form
  const handleOpenAdd = () => {
    setEditingArtwork(null);
    setArtForm({
      title: '',
      medium: 'Watercolor',
      category: 'Portraits',
      year: new Date().getFullYear().toString(),
      description: '',
      technique: '',
      dimensions: '30 x 42 cm • Archival Paper',
      imageUrl: '',
      featured: false,
      status: 'published',
      tags: 'Watercolor, Portrait, Fine Art',
      allowDownload: true
    });
    setImagePreview('');
    setIsAddingArtwork(true);
  };

  // Open Edit Artwork form
  const handleOpenEdit = (art: Artwork) => {
    setEditingArtwork(art);
    setArtForm({
      title: art.title,
      medium: art.medium,
      category: art.category,
      year: art.year,
      description: art.description,
      technique: art.technique,
      dimensions: art.dimensions || '',
      imageUrl: art.imageUrl,
      featured: art.featured,
      status: art.status,
      tags: art.tags.join(', '),
      allowDownload: art.allowDownload
    });
    setImagePreview(art.imageUrl);
    setIsAddingArtwork(true);
  };

  // Image Upload handler (supports file upload with base64 conversion)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
        setArtForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Artwork form
  const handleSaveArtwork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artForm.title || !artForm.imageUrl) {
      alert('Please enter a title and provide an image.');
      return;
    }

    const parsedTags = artForm.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingArtwork) {
      updateArtwork(editingArtwork.id, {
        title: artForm.title,
        medium: artForm.medium,
        category: artForm.category,
        year: artForm.year,
        description: artForm.description,
        technique: artForm.technique,
        dimensions: artForm.dimensions,
        imageUrl: artForm.imageUrl,
        featured: artForm.featured,
        status: artForm.status,
        tags: parsedTags,
        allowDownload: artForm.allowDownload
      });
    } else {
      addArtwork({
        title: artForm.title,
        medium: artForm.medium,
        category: artForm.category,
        year: artForm.year,
        description: artForm.description,
        technique: artForm.technique,
        dimensions: artForm.dimensions,
        imageUrl: artForm.imageUrl,
        featured: artForm.featured,
        status: artForm.status,
        tags: parsedTags,
        allowDownload: artForm.allowDownload
      });
    }

    setIsAddingArtwork(false);
    setEditingArtwork(null);
  };

  // Move artwork position
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newArtworks = [...artworks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newArtworks.length) return;

    const temp = newArtworks[index];
    newArtworks[index] = newArtworks[targetIdx];
    newArtworks[targetIdx] = temp;
    reorderArtworks(newArtworks);
  };

  // Profile Form state
  const [profileForm, setProfileForm] = useState({ ...profile });
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  // Social Links state
  const [socialLinksState, setSocialLinksState] = useState([...socialLinks]);
  const [socialSaved, setSocialSaved] = useState(false);

  const handleSaveSocial = () => {
    updateSocialLinks(socialLinksState);
    setSocialSaved(true);
    setTimeout(() => setSocialSaved(false), 2500);
  };

  const handleAddSocial = () => {
    const newLink: SocialLink = {
      id: `social-${Date.now()}`,
      platform: 'other',
      label: 'New Platform',
      username: '@username',
      url: 'https://',
      followers: '10K Followers',
      enabled: true
    };
    setSocialLinksState(prev => [...prev, newLink]);
  };

  const handleDeleteSocial = (id: string) => {
    setSocialLinksState(prev => prev.filter(s => s.id !== id));
  };

  // JSON Import/Export
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string>('');

  const handleDownloadBackup = () => {
    const json = exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `THEBHIMSENART_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePerformImport = () => {
    if (!importJsonText.trim()) return;
    if (importBackup(importJsonText)) {
      setImportStatus('Backup data restored successfully!');
      setTimeout(() => setImportStatus(''), 3000);
    } else {
      setImportStatus('Error: Invalid JSON format.');
    }
  };

  // Unauthenticated View: Login Modal
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-md rounded-3xl bg-[#121217] border border-[#d4af37]/30 p-6 sm:p-8 shadow-2xl text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#a8a29e] hover:text-white rounded-full bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-2xl font-serif text-[#faf6ee] mb-1">Artist Admin Portal</h3>
          <p className="text-xs text-[#a8a29e] mb-6">
            Authorized management suite for Ganesh Shimpi • THEBHIMSENART
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Admin Passcode"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#faf6ee] placeholder-[#8e8a83] text-sm focus:outline-none focus:border-[#d4af37] text-center tracking-widest transition"
                autoFocus
              />
            </div>

            {authError && <p className="text-xs text-rose-400">{authError}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#c29d2b] text-[#0b0b0e] font-semibold text-sm transition shadow-lg"
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Statistics summaries
  const publishedCount = artworks.filter(a => a.status === 'published').length;
  const draftCount = artworks.filter(a => a.status === 'draft').length;
  const featuredCount = artworks.filter(a => a.featured).length;
  const unreadInquiries = inquiries.filter(i => !i.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-3xl bg-[#0f0f14] border border-white/10 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Dashboard Top Header */}
        <div className="px-6 py-4 bg-[#14141a] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] font-serif font-bold text-lg">
              GS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-semibold text-[#faf6ee]">THEBHIMSENART Studio Manager</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-[#a8a29e]">Ganesh Shimpi • Fine Artist & Art Content Creator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#a8a29e] hover:text-white transition"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a8a29e] hover:text-white transition"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Analytics Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-6 py-3 bg-[#111116] border-b border-white/5 text-xs">
          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[10px] uppercase text-[#8e8a83] block">Total Artworks</span>
            <span className="text-base font-mono font-bold text-[#faf6ee]">{artworks.length}</span>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[10px] uppercase text-[#8e8a83] block">Published</span>
            <span className="text-base font-mono font-bold text-emerald-400">{publishedCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[10px] uppercase text-[#8e8a83] block">Featured</span>
            <span className="text-base font-mono font-bold text-[#d4af37]">{featuredCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[10px] uppercase text-[#8e8a83] block">Inquiries</span>
            <span className="text-base font-mono font-bold text-[#faf6ee]">
              {inquiries.length} {unreadInquiries > 0 && <span className="text-[10px] text-amber-400">({unreadInquiries} new)</span>}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase text-[#8e8a83] block">Visitor Count</span>
            <span className="text-base font-mono font-bold text-[#d4af37]">{visitorCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-white/10 flex items-center gap-2 overflow-x-auto bg-[#0f0f14]">
          {[
            { id: 'artworks', label: 'Artworks Collection', icon: Layers },
            { id: 'profile', label: 'Artist Profile & Stats', icon: User },
            { id: 'social', label: 'Social Channels', icon: Share2 },
            { id: 'collaborations', label: 'Brand Collaborations', icon: Sparkles },
            { id: 'inquiries', label: `Inquiries (${unreadInquiries})`, icon: Mail },
            { id: 'backup', label: 'Data & Backup', icon: Database }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setIsAddingArtwork(false);
                }}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent text-[#a8a29e] hover:text-[#e8e4dc]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#0b0b0e]">
          {/* TAB 1: ARTWORKS MANAGEMENT */}
          {activeTab === 'artworks' && (
            <div>
              {/* Header with Add Button */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-serif text-[#faf6ee]">Artworks Gallery Catalog</h4>
                  <p className="text-xs text-[#a8a29e]">Manage paintings, descriptions, 3D museum presence, and reorder.</p>
                </div>

                {!isAddingArtwork && (
                  <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c29d2b] text-[#0b0b0e] font-semibold text-xs transition shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Artwork</span>
                  </button>
                )}
              </div>

              {/* Add / Edit Form Modal Inline */}
              {isAddingArtwork ? (
                <div className="p-6 rounded-2xl bg-[#14141b] border border-[#d4af37]/30 shadow-2xl mb-8 animate-fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <h5 className="text-base font-serif text-[#faf6ee]">
                      {editingArtwork ? `Edit Artwork: ${editingArtwork.title}` : 'Add New Masterwork to Gallery'}
                    </h5>
                    <button
                      onClick={() => setIsAddingArtwork(false)}
                      className="p-1 text-[#a8a29e] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveArtwork} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div>
                        <label className="text-xs text-[#a8a29e] font-medium block mb-1">Artwork Title *</label>
                        <input
                          type="text"
                          required
                          value={artForm.title}
                          onChange={e => setArtForm({ ...artForm, title: e.target.value })}
                          placeholder="e.g. Portrait study."
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>

                      {/* Medium */}
                      <div>
                        <label className="text-xs text-[#a8a29e] font-medium block mb-1">Medium *</label>
                        <select
                          value={artForm.medium}
                          onChange={e => setArtForm({ ...artForm, medium: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#1c1c24] border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                        >
                          <option value="Watercolor">Watercolor</option>
                          <option value="Acrylic">Acrylic</option>
                          <option value="Digital Illustration">Digital Illustration</option>
                          <option value="Ball Pen Sketching">Ball Pen Sketching</option>
                          <option value="Oil Painting">Oil Painting</option>
                          <option value="Mixed Media">Mixed Media</option>
                          <option value="Color Pencil">Color Pencil</option>
                        </select>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="text-xs text-[#a8a29e] font-medium block mb-1">Category</label>
                        <input
                          type="text"
                          value={artForm.category}
                          onChange={e => setArtForm({ ...artForm, category: e.target.value })}
                          placeholder="e.g. Portraits / Reimagined Classics"
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>

                      {/* Year */}
                      <div>
                        <label className="text-xs text-[#a8a29e] font-medium block mb-1">Creation Year</label>
                        <input
                          type="text"
                          value={artForm.year}
                          onChange={e => setArtForm({ ...artForm, year: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>

                      {/* Physical Dimensions */}
                      <div>
                        <label className="text-xs text-[#a8a29e] font-medium block mb-1">Dimensions / Surface</label>
                        <input
                          type="text"
                          value={artForm.dimensions}
                          onChange={e => setArtForm({ ...artForm, dimensions: e.target.value })}
                          placeholder="e.g. 30 x 42 cm • 300 GSM Cold Press"
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="text-xs text-[#a8a29e] font-medium block mb-1">Tags (Comma-separated)</label>
                        <input
                          type="text"
                          value={artForm.tags}
                          onChange={e => setArtForm({ ...artForm, tags: e.target.value })}
                          placeholder="Watercolor, Portrait, Indian Culture"
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Image Upload / URL */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <label className="text-xs text-[#faf6ee] font-medium block">Artwork Image File *</label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div>
                          <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-[#d4af37] cursor-pointer bg-white/5 transition">
                            <Upload className="w-6 h-6 text-[#d4af37] mb-2" />
                            <span className="text-xs text-[#faf6ee] font-medium">Choose Image File</span>
                            <span className="text-[10px] text-[#8e8a83]">JPG, PNG, or WebP</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div>
                          <label className="text-[11px] text-[#a8a29e] block mb-1">Or Direct Image URL / Path</label>
                          <input
                            type="text"
                            value={artForm.imageUrl}
                            onChange={e => {
                              setArtForm({ ...artForm, imageUrl: e.target.value });
                              setImagePreview(e.target.value);
                            }}
                            placeholder="/artworks/portrait-study.jpg"
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                          />

                          {imagePreview && (
                            <div className="mt-2 flex items-center gap-2">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-12 h-16 object-cover rounded border border-[#d4af37]/40"
                              />
                              <span className="text-[11px] text-emerald-400 font-medium">Image Loaded & Ready</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-xs text-[#a8a29e] font-medium block mb-1">Description (From Portfolio / Story) *</label>
                      <textarea
                        required
                        rows={3}
                        value={artForm.description}
                        onChange={e => setArtForm({ ...artForm, description: e.target.value })}
                        placeholder="A portrait built through warm skin tones..."
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    {/* Artistic Technique */}
                    <div>
                      <label className="text-xs text-[#a8a29e] font-medium block mb-1">Artistic Technique & Pigment Notes</label>
                      <textarea
                        rows={2}
                        value={artForm.technique}
                        onChange={e => setArtForm({ ...artForm, technique: e.target.value })}
                        placeholder="Layered wet-on-dry glazing..."
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#faf6ee]">
                        <input
                          type="checkbox"
                          checked={artForm.featured}
                          onChange={e => setArtForm({ ...artForm, featured: e.target.checked })}
                          className="rounded text-[#d4af37] focus:ring-[#d4af37]"
                        />
                        <span>Mark as Featured Masterpiece</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#faf6ee]">
                        <input
                          type="checkbox"
                          checked={artForm.allowDownload}
                          onChange={e => setArtForm({ ...artForm, allowDownload: e.target.checked })}
                          className="rounded text-[#d4af37] focus:ring-[#d4af37]"
                        />
                        <span>Allow Public Download</span>
                      </label>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#a8a29e]">Status:</span>
                        <select
                          value={artForm.status}
                          onChange={e => setArtForm({ ...artForm, status: e.target.value as 'published' | 'draft' })}
                          className="px-2 py-1 rounded bg-[#1c1c24] border border-white/10 text-xs text-[#faf6ee]"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft (Hidden)</option>
                        </select>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setIsAddingArtwork(false)}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#a8a29e] transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c29d2b] text-[#0b0b0e] font-semibold text-xs transition shadow-md"
                      >
                        {editingArtwork ? 'Save Changes' : 'Publish Artwork'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {/* Artworks List Table */}
              <div className="space-y-3">
                {artworks.map((art, index) => (
                  <div
                    key={art.id}
                    className="p-4 rounded-2xl bg-[#131319] border border-white/5 hover:border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 transition"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      {/* Image Thumbnail */}
                      <div className="w-14 h-18 rounded-lg overflow-hidden border border-[#d4af37]/30 flex-shrink-0 bg-black">
                        <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-[#d4af37] font-semibold">{art.number}</span>
                          <h5 className="font-serif text-base text-[#faf6ee] font-medium">{art.title}</h5>
                          {art.featured && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#e6cf93] border border-[#d4af37]/30 font-medium">
                              Featured
                            </span>
                          )}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${
                              art.status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {art.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#a8a29e]">
                          {art.medium} • {art.category} • {art.year} • {art.viewsCount} views
                        </p>
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      {/* Reorder Buttons */}
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-[#c7c0b5] transition"
                        title="Move Up in Gallery"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === artworks.length - 1}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-[#c7c0b5] transition"
                        title="Move Down in Gallery"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(art)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#e8e4dc] transition"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${art.title}"?`)) {
                            deleteArtwork(art.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-[#a8a29e] hover:text-rose-400 transition"
                        title="Delete artwork"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & STATS */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h4 className="text-lg font-serif text-[#faf6ee] mb-1">Artist Profile & Creator Stats</h4>
              <p className="text-xs text-[#a8a29e] mb-6">
                Update your artist identity, bio from the PDF, follower counts, and location.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#a8a29e] font-medium block mb-1">Artist Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#a8a29e] font-medium block mb-1">Brand / Studio Name</label>
                    <input
                      type="text"
                      value={profileForm.brand}
                      onChange={e => setProfileForm({ ...profileForm, brand: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#a8a29e] font-medium block mb-1">Profession</label>
                    <input
                      type="text"
                      value={profileForm.profession}
                      onChange={e => setProfileForm({ ...profileForm, profession: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#a8a29e] font-medium block mb-1">Tagline</label>
                    <input
                      type="text"
                      value={profileForm.tagline}
                      onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#a8a29e] font-medium block mb-1">Location</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#a8a29e] font-medium block mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={profileForm.contactEmail}
                      onChange={e => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Statistics from PDF */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h5 className="text-xs text-[#d4af37] uppercase font-semibold tracking-wider mb-3">
                    Creator Audience Numbers
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-[#a8a29e] block mb-1">Instagram Followers</label>
                      <input
                        type="text"
                        value={profileForm.stats.instagramFollowers}
                        onChange={e =>
                          setProfileForm({
                            ...profileForm,
                            stats: { ...profileForm.stats, instagramFollowers: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#a8a29e] block mb-1">YouTube Subscribers</label>
                      <input
                        type="text"
                        value={profileForm.stats.youtubeSubscribers}
                        onChange={e =>
                          setProfileForm({
                            ...profileForm,
                            stats: { ...profileForm.stats, youtubeSubscribers: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#a8a29e] block mb-1">Content Languages</label>
                      <input
                        type="text"
                        value={profileForm.stats.languages}
                        onChange={e =>
                          setProfileForm({
                            ...profileForm,
                            stats: { ...profileForm.stats, languages: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Biography */}
                <div>
                  <label className="text-xs text-[#a8a29e] font-medium block mb-1">Artist Statement & Bio</label>
                  <textarea
                    rows={5}
                    value={profileForm.bio}
                    onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c29d2b] text-[#0b0b0e] font-semibold text-xs transition shadow-md"
                  >
                    {profileSaved ? <Check className="w-4 h-4" /> : null}
                    <span>{profileSaved ? 'Profile Updated!' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SOCIAL CHANNELS */}
          {activeTab === 'social' && (
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-serif text-[#faf6ee]">Social Media Channels & Handles</h4>
                  <p className="text-xs text-[#a8a29e]">
                    Manage links for Instagram, YouTube, Facebook, Behance, Pinterest, and LinkedIn.
                  </p>
                </div>

                <button
                  onClick={handleAddSocial}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#faf6ee] border border-white/10 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Add Social Link</span>
                </button>
              </div>

              <div className="space-y-3">
                {socialLinksState.map((link, idx) => (
                  <div
                    key={link.id}
                    className="p-4 rounded-2xl bg-[#131319] border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                  >
                    <div className="md:col-span-3">
                      <input
                        type="text"
                        value={link.label}
                        onChange={e => {
                          const updated = [...socialLinksState];
                          updated[idx].label = e.target.value;
                          setSocialLinksState(updated);
                        }}
                        placeholder="Platform Name"
                        className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <input
                        type="text"
                        value={link.username}
                        onChange={e => {
                          const updated = [...socialLinksState];
                          updated[idx].username = e.target.value;
                          setSocialLinksState(updated);
                        }}
                        placeholder="@username"
                        className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <input
                        type="text"
                        value={link.url}
                        onChange={e => {
                          const updated = [...socialLinksState];
                          updated[idx].url = e.target.value;
                          setSocialLinksState(updated);
                        }}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteSocial(link.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-[#a8a29e] hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button
                  onClick={handleSaveSocial}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c29d2b] text-[#0b0b0e] font-semibold text-xs transition shadow-md"
                >
                  {socialSaved ? <Check className="w-4 h-4" /> : null}
                  <span>{socialSaved ? 'Social Links Saved!' : 'Save Social Channels'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: COLLABORATIONS */}
          {activeTab === 'collaborations' && (
            <div className="max-w-3xl">
              <h4 className="text-lg font-serif text-[#faf6ee] mb-1">Brand Collaborations & Formats</h4>
              <p className="text-xs text-[#a8a29e] mb-6">
                Showcase brands (Montex, Amariz, DOMS, Kaco India) and commercial sponsorship formats.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#131319] border border-white/5">
                  <h5 className="text-xs uppercase font-semibold text-[#d4af37] mb-3">Previous Brand Partners</h5>
                  <div className="space-y-2">
                    {profile.collaborations.map((collab, i) => (
                      <div key={collab.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-xs">
                        <div>
                          <strong className="text-[#faf6ee] font-medium">{collab.name}</strong>
                          <span className="text-[#a8a29e] ml-2 font-light">({collab.category})</span>
                          <p className="text-[11px] text-[#8e8a83] mt-0.5">{collab.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#131319] border border-white/5">
                  <h5 className="text-xs uppercase font-semibold text-[#d4af37] mb-3">Collaboration Formats Offered</h5>
                  <ul className="space-y-1.5 text-xs text-[#faf6ee]">
                    {profile.collaborationFormats.map(fmt => (
                      <li key={fmt} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                        <span>{fmt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h4 className="text-lg font-serif text-[#faf6ee]">Collector & Brand Inquiries</h4>
                  <p className="text-xs text-[#a8a29e]">
                    Customer inquiries are stored directly in the local database (`data/inquiries_db.json` &amp; browser storage).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={refreshInquiries}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#d4af37] font-semibold transition"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Refresh Local Inbox ({inquiries.length})</span>
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white/5 text-xs text-[#a8a29e]">
                  No inquiries received yet. Submit a message in the Contact section and it will appear here immediately.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map(inq => (
                    <div
                      key={inq.id}
                      className={`p-4 rounded-2xl border transition ${
                        inq.read
                          ? 'bg-[#131319] border-white/5'
                          : 'bg-[#181822] border-[#d4af37]/40 shadow-md'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {!inq.read && <span className="w-2 h-2 rounded-full bg-[#d4af37]" />}
                          <strong className="text-sm font-medium text-[#faf6ee]">{inq.name}</strong>
                          {inq.brand && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#d8cbb7]">
                              {inq.brand}
                            </span>
                          )}
                          <span className="text-xs text-[#a8a29e]">({inq.email})</span>
                        </div>
                        <span className="text-[11px] text-[#8e8a83]">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h5 className="text-xs font-semibold text-[#d4af37] mb-1">{inq.subject}</h5>
                      <p className="text-xs text-[#c7c0b5] leading-relaxed mb-3 whitespace-pre-line">{inq.message}</p>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <a
                          href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.subject} - THEBHIMSENART`)}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4af37] text-[#0b0b0e] text-xs font-semibold hover:bg-[#c29d2b] transition"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>

                        {!inq.read && (
                          <button
                            onClick={() => markInquiryRead(inq.id)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#a8a29e] hover:text-white transition"
                          >
                            Mark Read
                          </button>
                        )}

                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-[#8e8a83] hover:text-rose-400 transition ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: BACKUP & DATA */}
          {activeTab === 'backup' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h4 className="text-lg font-serif text-[#faf6ee] mb-1">Backup & Portfolio Data</h4>
                <p className="text-xs text-[#a8a29e]">
                  Export a JSON snapshot of all artworks, profile details, and inquiries, or restore from a backup.
                </p>
              </div>

              {/* Export Button */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-semibold text-[#faf6ee] mb-0.5">Export Full Studio JSON</h5>
                  <p className="text-[11px] text-[#8e8a83]">Downloads all catalog items and metadata as a .json file.</p>
                </div>
                <button
                  onClick={handleDownloadBackup}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c29d2b] text-[#0b0b0e] text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup</span>
                </button>
              </div>

              {/* Import Area */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h5 className="text-xs font-semibold text-[#faf6ee]">Restore from JSON</h5>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  placeholder="Paste backup JSON string here..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-[#faf6ee] focus:border-[#d4af37] focus:outline-none"
                />
                <button
                  onClick={handlePerformImport}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-[#faf6ee] transition"
                >
                  Restore Data
                </button>
                {importStatus && <p className="text-xs text-[#d4af37]">{importStatus}</p>}
              </div>

              {/* Reset to Default PDF Data */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-semibold text-rose-300 mb-0.5">Reset to Original PDF Content</h5>
                  <p className="text-[11px] text-[#a8a29e]">
                    Restores the initial 4 masterworks, bio, and collaboration records from the PDF.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Reset all artworks and profile data back to original PDF values?')) {
                      resetToDefaults();
                      alert('Restored original PDF data successfully.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition"
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
