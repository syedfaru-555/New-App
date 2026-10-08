import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bookmark, Download, HardDrive, Trash2, Play, Film, Tv, Plus } from 'lucide-react';
import { ContentCard } from './ContentCard';

export const MyListScreen: React.FC = () => {
  const {
    myListIds,
    getContentById,
    toggleMyList,
    downloadedItems,
    removeDownload,
    startPlayback,
    setActiveTab
  } = useApp();

  const [activeTab, setActiveLocalTab] = useState<'watchlist' | 'downloads'>('watchlist');
  const [formatFilter, setFormatFilter] = useState<'all' | 'movie' | 'series'>('all');

  const savedItems = myListIds
    .map((id) => getContentById(id))
    .filter(Boolean)
    .filter((item) => (formatFilter === 'all' ? true : item!.type === formatFilter));

  const totalDownloadedMb = downloadedItems.reduce((acc, curr) => acc + curr.fileSizeMb, 0);
  const totalDownloadedGb = (totalDownloadedMb / 1024).toFixed(1);

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-5xl mx-auto">
      {/* Top Segmented Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Syne',sans-serif]">
            Library & Saves
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Your personalized watchlist and offline downloads
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-zinc-900 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveLocalTab('watchlist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'watchlist'
                ? 'bg-rose-600 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>My List ({myListIds.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Downloads ({downloadedItems.length})</span>
          </button>
        </div>
      </div>

      {/* WATCHLIST TAB */}
      {activeTab === 'watchlist' && (
        <div className="mt-5">
          {/* Sub filter: All / Movies / Series */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'movie', label: 'Movies' },
                { id: 'series', label: 'Series' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormatFilter(f.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    formatFilter === f.id
                      ? 'bg-white/20 text-white font-semibold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-zinc-500 font-mono tabular-nums">
              {savedItems.length} titles
            </span>
          </div>

          {savedItems.length === 0 ? (
            <div className="py-20 text-center">
              <Bookmark className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-300">Your Watchlist is empty</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Explore movies and web series and tap the "+ My List" button to save titles for later.
              </p>
              <button
                onClick={() => setActiveTab('home')}
                className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-transform active:scale-95"
              >
                Explore Trending Content
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {savedItems.map((item) => (
                <div key={item!.id} className="relative group">
                  <ContentCard item={item!} />
                  <button
                    onClick={() => toggleMyList(item!.id)}
                    title="Remove from list"
                    className="absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-black/80 text-rose-400 hover:text-rose-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DOWNLOADS TAB */}
      {activeTab === 'downloads' && (
        <div className="mt-5 space-y-4">
          {/* Storage Meter Card */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 font-bold text-zinc-300 uppercase tracking-wider">
                <HardDrive className="w-4 h-4 text-rose-500" />
                Vela Offline Storage
              </span>
              <span className="text-zinc-400 font-mono">
                {totalDownloadedGb} GB used / 64 GB available
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-amber-500 rounded-full"
                style={{ width: `${Math.min(100, Math.max(5, (totalDownloadedMb / 65536) * 100))}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              Downloaded videos can be watched offline anytime without internet connection.
            </p>
          </div>

          {/* Downloaded Content List */}
          {downloadedItems.length === 0 ? (
            <div className="py-20 text-center">
              <Download className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-300">No downloaded titles</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Tap the Download icon on any movie or episode to save it for offline travel watching.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {downloadedItems.map((item) => {
                const parent = getContentById(item.contentId);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-white/5 hover:border-white/15 transition-colors"
                  >
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-12 rounded-lg object-cover bg-zinc-800 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-100 truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5 font-mono">
                        <span>{item.duration}</span>
                        <span aria-hidden="true" className="text-zinc-600">·</span>
                        <span>{item.fileSizeMb} MB</span>
                        <span aria-hidden="true" className="text-zinc-600">·</span>
                        <span className="text-emerald-400 font-sans font-medium">Ready Offline</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (parent) startPlayback(parent);
                        }}
                        className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-transform active:scale-95"
                        title="Watch offline"
                      >
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </button>

                      <button
                        onClick={() => removeDownload(item.id)}
                        className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition-colors"
                        title="Delete download"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
