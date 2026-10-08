import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  BarChart3,
  Film,
  Tv,
  Users,
  CheckCircle,
  Eye,
  Star,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ContentItem } from '../types';
import { GENRE_LIST } from '../data/initialData';

export const AdminDashboard: React.FC = () => {
  const {
    showAdminDashboard,
    setShowAdminDashboard,
    catalog,
    addContentItem,
    deleteContentItem,
    toggleFeaturedContent,
    user
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'catalog' | 'analytics' | 'featured' | 'users'>('catalog');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for new title
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'movie' | 'series'>('movie');
  const [newPosterUrl, setNewPosterUrl] = useState('');
  const [newBackdropUrl, setNewBackdropUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('/videos/sample.mp4');
  const [newTrailerUrl, setNewTrailerUrl] = useState('/videos/sample.mp4');
  const [newYear, setNewYear] = useState(2026);
  const [newRating, setNewRating] = useState(8.8);
  const [newMaturity, setNewMaturity] = useState<'U' | 'U/A 13+' | '16+' | '18+'>('16+');
  const [newDuration, setNewDuration] = useState('2h 10m');
  const [newGenre, setNewGenre] = useState('Action');
  const [newDirector, setNewDirector] = useState('Vela Studios');
  const [newSynopsis, setNewSynopsis] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newIsOriginal, setNewIsOriginal] = useState(true);
  const [newIsFeatured, setNewIsFeatured] = useState(false);

  if (!showAdminDashboard) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ContentItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      posterUrl: newPosterUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      backdropUrl: newBackdropUrl || newPosterUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      videoUrl: newVideoUrl || '/videos/sample.mp4',
      trailerUrl: newTrailerUrl || '/videos/sample.mp4',
      year: Number(newYear),
      rating: Number(newRating),
      maturityRating: newMaturity,
      duration: newDuration,
      genres: [newGenre, 'Sci-Fi'],
      languages: ['English', 'Spanish'],
      audioTracks: ['English (5.1)', 'Spanish'],
      subtitles: ['English [CC]', 'Spanish'],
      director: newDirector || 'Original Director',
      cast: [
        { name: 'Lead Actor', role: 'Main Character', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
      ],
      synopsis: newSynopsis || 'A compelling new original streaming title exclusively on Vela Stream.',
      tagline: newTagline || 'Experience the cinema of tomorrow.',
      isOriginal: newIsOriginal,
      featured: newIsFeatured,
      is4K: true,
      isHDR: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    addContentItem(newItem);
    setShowAddModal(false);
    // Reset form
    setNewTitle('');
    setNewSynopsis('');
    setNewTagline('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-zinc-950 rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-black text-white tracking-tight font-['Syne',sans-serif]">
                Vela Creator & Admin Studio
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-1">
                Manage streaming catalog, metadata, featured hero placements & analytics
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAdminDashboard(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            aria-label="Close Admin Studio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex gap-1.5 sm:gap-2 px-3 sm:px-5 pt-2 border-b border-white/10 text-xs font-semibold overflow-x-auto scrollbar-none shrink-0" style={{ scrollbarWidth: 'none' }}>
          {[
            { id: 'catalog', label: 'Catalog Manager', icon: Film },
            { id: 'featured', label: 'Featured Banners', icon: Sparkles },
            { id: 'analytics', label: 'Viewership & Metrics', icon: BarChart3 },
            { id: 'users', label: 'Accounts & Tiers', icon: Users }
          ].map((t) => {
            const Icon = t.icon;
            const active = activeAdminTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveAdminTab(t.id as any)}
                className={`flex items-center gap-1.5 pb-2.5 pt-1 px-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-rose-500 text-rose-500'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: CATALOG MANAGER */}
          {activeAdminTab === 'catalog' && (
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <h3 className="text-sm font-bold text-white">All Titles ({catalog.length})</h3>
                  <p className="text-[11px] sm:text-xs text-zinc-400">Add, edit, feature, or remove streaming titles</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="self-start sm:self-auto px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Title</span>
                </button>
              </div>

              {/* Responsive Catalog List (Mobile-first, zero-overlap) */}
              <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-zinc-900/60">
                {catalog.map((item) => (
                  <div key={item.id} className="p-3 sm:p-3.5 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Media Thumbnail + Metadata Column */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg object-cover bg-zinc-800 shrink-0 border border-white/10 shadow-sm"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                        <div>
                          {/* Badges line */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] uppercase font-bold text-zinc-300 px-1.5 py-0.5 bg-white/10 rounded">
                              {item.type}
                            </span>
                            {item.featured && (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                Featured
                              </span>
                            )}
                            <span className="text-[10px] text-zinc-400 px-1 rounded border border-zinc-700/80">
                              {item.maturityRating}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-1">
                            {item.title}
                          </h4>
                        </div>

                        {/* Specs & Genres */}
                        <div className="text-[11px] text-zinc-400 mt-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {item.rating}
                            </span>
                            <span>·</span>
                            <span>{item.year}</span>
                            <span>·</span>
                            <span className="text-zinc-300 font-medium">{item.duration}</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5 max-w-sm sm:max-w-md">
                            {item.genres.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar (Clean separated row on mobile, right-aligned on desktop) */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
                      <button
                        onClick={() => toggleFeaturedContent(item.id)}
                        className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          item.featured
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                            : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 border border-white/10'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{item.featured ? 'Featured on Home' : 'Feature on Home'}</span>
                      </button>

                      <button
                        onClick={() => deleteContentItem(item.id)}
                        className="px-2.5 py-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Delete title"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sm:hidden text-[11px]">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FEATURED BANNERS */}
          {activeAdminTab === 'featured' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Active Hero Carousel Banners</h3>
              <p className="text-xs text-zinc-400">These titles appear directly on the main home landing carousel:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catalog.filter((c) => c.featured).map((item) => (
                  <div key={item.id} className="relative rounded-xl overflow-hidden border border-white/10 group aspect-video">
                    <img
                      src={item.backdropUrl || item.posterUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-[10px] font-bold text-rose-500 uppercase">Featured Banner</span>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-zinc-400">{item.duration} · {item.genres.join(', ')}</p>
                    </div>
                    <button
                      onClick={() => toggleFeaturedContent(item.id)}
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-black/80 text-rose-400 text-xs font-bold"
                    >
                      Remove from Banner
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS & METRICS */}
          {activeAdminTab === 'analytics' && (
            <div className="space-y-5">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Active Monthly Subscribers', value: '482,900', change: '+14.2%' },
                  { label: 'Total Hours Streamed', value: '1.84M hrs', change: '+22.5%' },
                  { label: 'Avg 4K Stream Bitrate', value: '18.4 Mbps', change: 'Optimal' },
                  { label: 'Monthly Recurring Revenue', value: '$3.42M', change: '+18.1%' }
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-zinc-900 border border-white/10">
                    <span className="text-xs text-zinc-400 block">{stat.label}</span>
                    <span className="text-xl font-black text-white font-['Syne',sans-serif] mt-1 block">
                      {stat.value}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Viewership Breakdown */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Top Streamed Genres (Last 30 Days)
                </h4>
                {[
                  { genre: 'Sci-Fi & Cyberpunk', percent: 84 },
                  { genre: 'Action & Thriller', percent: 76 },
                  { genre: 'True Crime & Documentary', percent: 62 },
                  { genre: 'Fantasy & Lore', percent: 54 },
                  { genre: 'Kids & Animation', percent: 45 }
                ].map((g, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-300">
                      <span>{g.genre}</span>
                      <span className="font-mono">{g.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-600 rounded-full"
                        style={{ width: `${g.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: USERS & TIERS */}
          {activeAdminTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Active Platform Accounts</h3>
              <div className="p-3 bg-zinc-900 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{user.name} ({user.email})</h4>
                  <p className="text-[11px] text-zinc-400">
                    Profiles: {user.profiles.length} · Role: System Administrator · Tier: {user.currentTierId}
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/20 rounded">
                  Super Admin
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add New Title Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-zinc-950 p-6 rounded-2xl border border-white/15 max-w-lg w-full space-y-3 text-xs overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="text-base font-bold text-white font-['Syne',sans-serif]">Publish New Streaming Title</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Title Name</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Solaris Drift"
                className="w-full p-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-400 block mb-1">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
                >
                  <option value="movie">Movie</option>
                  <option value="series">Web Series</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Primary Genre</label>
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="w-full p-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
                >
                  {GENRE_LIST.filter((g) => g !== 'All').map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-zinc-400 block mb-1">Release Year</label>
                <input
                  type="number"
                  value={newYear}
                  onChange={(e) => setNewYear(Number(e.target.value))}
                  className="w-full p-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full p-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Duration</label>
                <input
                  type="text"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="2h 15m"
                  className="w-full p-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Poster Image URL</label>
              <input
                type="text"
                value={newPosterUrl}
                onChange={(e) => setNewPosterUrl(e.target.value)}
                placeholder="https://... (or leave empty for default)"
                className="w-full p-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Video Stream MP4 URL</label>
              <input
                type="text"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="w-full p-2 bg-zinc-900 border border-white/10 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Synopsis</label>
              <textarea
                value={newSynopsis}
                onChange={(e) => setNewSynopsis(e.target.value)}
                rows={2}
                className="w-full p-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
              />
            </div>

            <div className="flex items-center gap-4 py-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsOriginal}
                  onChange={(e) => setNewIsOriginal(e.target.checked)}
                  className="accent-rose-600"
                />
                <span>Vela Original</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsFeatured}
                  onChange={(e) => setNewIsFeatured(e.target.checked)}
                  className="accent-rose-600"
                />
                <span>Feature on Hero Carousel</span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 bg-zinc-800 text-zinc-300 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold"
              >
                Publish Title
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
