import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ContentCard } from './ContentCard';
import { Tv } from 'lucide-react';
import { GENRE_LIST } from '../data/initialData';

export const SeriesScreen: React.FC = () => {
  const { filteredCatalog } = useApp();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'seasons'>('rating');

  const series = filteredCatalog
    .filter((c) => c.type === 'series')
    .filter((c) => (selectedGenre === 'All' ? true : c.genres.includes(selectedGenre)))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.seasons?.length || 1) - (a.seasons?.length || 1);
    });

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Syne',sans-serif]">
              Web Series & Sagas
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Binge multi-season originals, docuseries, and weekly releases
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-zinc-900 text-zinc-200 text-xs px-2.5 py-1.5 rounded-lg border border-white/15 focus:outline-none focus:border-rose-500"
          >
            <option value="rating">Top Rated</option>
            <option value="seasons">Most Seasons</option>
          </select>
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {GENRE_LIST.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              selectedGenre === genre
                ? 'bg-rose-600 text-white shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-6">
        <div className="flex justify-between items-baseline mb-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {selectedGenre === 'All' ? 'All Web Series' : `${selectedGenre} Series`}
          </h3>
          <span className="text-xs text-zinc-500 font-mono">
            {series.length} {series.length === 1 ? 'title' : 'titles'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {series.map((s) => (
            <ContentCard key={s.id} item={s} />
          ))}
        </div>
      </div>
    </div>
  );
};
