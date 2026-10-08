import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search as SearchIcon, X, SlidersHorizontal, Flame, History, Film, Tv } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { GENRE_LIST } from '../data/initialData';

export const SearchScreen: React.FC = () => {
  const { filteredCatalog } = useApp();

  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Chronos',
    'Sci-Fi',
    'Kenji Takahashi',
    'Paris'
  ]);

  const trendingSearches = [
    'Chronos: The Quantum Odyssey',
    'Neo Tokyo',
    'David Attenborough',
    'Apex Velocity',
    'Cyberpunk',
    'Little Fox'
  ];

  const availableLanguages = ['All', 'English', 'Spanish', 'Japanese', 'French', 'Hindi', 'German'];

  // Multi-facet search across:
  // - Title
  // - Synopsis & Tagline
  // - Cast members
  // - Director
  // - Genres
  // - Languages
  const searchResults = useMemo(() => {
    return filteredCatalog.filter((item) => {
      // Type filter
      if (selectedType !== 'all' && item.type !== selectedType) return false;

      // Genre filter
      if (selectedGenre !== 'All' && !item.genres.includes(selectedGenre)) return false;

      // Language filter
      if (selectedLanguage !== 'All' && !item.languages.includes(selectedLanguage)) return false;

      // Min rating
      if (minRating > 0 && item.rating < minRating) return false;

      // Text query
      if (!query.trim()) return true;

      const q = query.toLowerCase().trim();
      const inTitle = item.title.toLowerCase().includes(q);
      const inSynopsis = item.synopsis.toLowerCase().includes(q);
      const inDirector = item.director.toLowerCase().includes(q);
      const inGenres = item.genres.some((g) => g.toLowerCase().includes(q));
      const inLanguages = item.languages.some((l) => l.toLowerCase().includes(q));
      const inCast = item.cast.some((c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));

      return inTitle || inSynopsis || inDirector || inGenres || inLanguages || inCast;
    });
  }, [filteredCatalog, query, selectedType, selectedGenre, selectedLanguage, minRating]);

  const handleSearchSubmit = (text: string) => {
    setQuery(text);
    if (text && !recentSearches.includes(text)) {
      setRecentSearches((prev) => [text, ...prev.slice(0, 5)]);
    }
  };

  const removeRecentSearch = (item: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== item));
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-5xl mx-auto">
      {/* Search Input Bar */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit(query);
            }}
            placeholder="Search movies, series, actors, directors..."
            className="w-full h-12 pl-11 pr-10 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-rose-500 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Trigger Button */}
        <button
          onClick={() => setShowFiltersModal(!showFiltersModal)}
          className={`h-12 px-3.5 rounded-xl border flex items-center justify-center transition-colors ${
            selectedType !== 'all' || selectedGenre !== 'All' || selectedLanguage !== 'All' || minRating > 0
              ? 'bg-rose-600 border-rose-500 text-white'
              : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white'
          }`}
          aria-label="Filter Search"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Drawer / Panel */}
      {showFiltersModal && (
        <div className="mt-3 p-4 rounded-xl bg-zinc-900 border border-white/15 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="text-xs font-bold uppercase text-zinc-300 tracking-wider">Refine Search</h4>
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedGenre('All');
                setSelectedLanguage('All');
                setMinRating(0);
              }}
              className="text-xs text-rose-500 hover:underline"
            >
              Reset Filters
            </button>
          </div>

          {/* Content Type Filter */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase">Format</label>
            <div className="flex gap-2 mt-1">
              {[
                { id: 'all', label: 'All Formats' },
                { id: 'movie', label: 'Movies' },
                { id: 'series', label: 'Series' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedType === t.id ? 'bg-rose-600 text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Filter */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase">Genre</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {GENRE_LIST.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedGenre === g ? 'bg-rose-600 text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Language and Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="mt-1 w-full bg-zinc-800 text-zinc-200 text-xs rounded-lg p-2 border border-white/10 focus:outline-none focus:border-rose-500"
              >
                {availableLanguages.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="mt-1 w-full bg-zinc-800 text-zinc-200 text-xs rounded-lg p-2 border border-white/10 focus:outline-none focus:border-rose-500"
              >
                <option value={0}>Any Rating</option>
                <option value={8}>8.0+ Highly Rated</option>
                <option value={9}>9.0+ Masterpieces</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* When no query entered: Show Recent Searches & Trending Searches */}
      {!query && (
        <div className="mt-6 space-y-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <History className="w-3.5 h-3.5" />
                  Recent Searches
                </span>
                <button
                  onClick={() => setRecentSearches([])}
                  className="text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSearchSubmit(item)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 cursor-pointer border border-white/5 transition-colors"
                  >
                    <span>{item}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(item);
                      }}
                      className="text-zinc-500 hover:text-zinc-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-500 mb-2">
              <Flame className="w-3.5 h-3.5 fill-rose-500" />
              Trending Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((trend, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearchSubmit(trend)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-200 font-medium border border-white/5 transition-colors"
                >
                  {trend}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Grid */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
            {query ? `Results for "${query}"` : 'Discover All Titles'}
          </h3>
          <span className="text-xs text-zinc-500 font-mono tabular-nums">
            {searchResults.length} {searchResults.length === 1 ? 'title' : 'titles'}
          </span>
        </div>

        {searchResults.length === 0 ? (
          <div className="py-16 text-center">
            <SearchIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-zinc-200">No titles found</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              We couldn't find matches for "{query}". Try searching for another genre, actor name, or clear your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {searchResults.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
