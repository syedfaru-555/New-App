import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroCarousel } from './HeroCarousel';
import { ContentRow } from './ContentRow';
import { ContentCard } from './ContentCard';
import { GENRE_LIST } from '../data/initialData';
import { Play, Sparkles } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    filteredCatalog,
    continueWatchingList,
    startPlayback,
    activeGenre,
    setActiveGenre,
    setActiveTab
  } = useApp();

  // Category slices
  const trendingNow = [...filteredCatalog]
    .filter((c) => c.trendingRank !== undefined)
    .sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99));

  const popularMovies = filteredCatalog.filter((c) => c.type === 'movie');
  const popularSeries = filteredCatalog.filter((c) => c.type === 'series');
  const topRated = [...filteredCatalog].sort((a, b) => b.rating - a.rating);
  const newReleases = [...filteredCatalog].sort((a, b) => (b.year || 0) - (a.year || 0));
  const recommendedForYou = [...filteredCatalog].filter((c) => c.rating >= 8.8);

  // Genre filtered items if user selected specific genre
  const genreItems = activeGenre === 'All'
    ? filteredCatalog
    : filteredCatalog.filter((c) => c.genres.includes(activeGenre));

  return (
    <div className="pb-24 overflow-x-hidden">
      {/* Featured Hero Carousel */}
      <HeroCarousel />

      {/* Genre Filter Chips (Interactive button controls) */}
      <div className="relative z-30 -mt-3 sm:-mt-6 px-4">
        <div
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {GENRE_LIST.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeGenre === genre
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50 scale-105'
                  : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-white/10 backdrop-blur-md'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* If a specific genre is selected, display that genre's curated collection first */}
      {activeGenre !== 'All' ? (
        <div className="px-4 mt-6">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-lg font-black text-white font-['Syne',sans-serif]">
              {activeGenre} Spotlight
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {genreItems.length} titles
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {genreItems.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Continue Watching Section (Automatically saves progress and lets users resume) */}
          {continueWatchingList.length > 0 && (
            <section className="mt-6 px-4">
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                  Continue Watching
                </h3>
                <span className="text-xs text-zinc-400">
                  {continueWatchingList.length} in progress
                </span>
              </div>

              <div
                className="flex items-start gap-3.5 overflow-x-auto scrollbar-none pb-2 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {continueWatchingList.map(({ item, progress }) => {
                  const progressPct = progress.totalSeconds > 0
                    ? Math.round((progress.watchedSeconds / progress.totalSeconds) * 100)
                    : 0;

                  return (
                    <div
                      key={item.id}
                      onClick={() => startPlayback(item, undefined, progress.watchedSeconds)}
                      className="group relative flex-shrink-0 cursor-pointer select-none transition-transform active:scale-95 w-56 sm:w-64"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-rose-500/50 transition-all">
                        <img
                          src={item.backdropUrl || item.posterUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-700">
                          <div
                            className="h-full bg-rose-600 transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-2">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-rose-400">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-0.5">
                          <span>{item.genres[0]}</span>
                          <span className="text-rose-400 font-medium">{progressPct}% watched</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Trending Now (Ranked 1 to 10) */}
          <ContentRow
            title="Top 10 Trending Today"
            subtitle="Most streamed original blockbusters and series"
            items={trendingNow.slice(0, 10)}
            ranked={true}
          />

          {/* Recommended For You */}
          <ContentRow
            title="Recommended For You"
            subtitle="Curated from your viewing history and genres"
            items={recommendedForYou}
          />

          {/* Popular Movies */}
          <ContentRow
            title="Popular Movies"
            subtitle="Box office sensations & festival selections"
            items={popularMovies}
            onSeeAll={() => setActiveTab('movies')}
          />

          {/* Popular Web Series */}
          <ContentRow
            title="Popular Web Series"
            subtitle="Binge-worthy multi-season sagas"
            items={popularSeries}
            onSeeAll={() => setActiveTab('series')}
          />

          {/* New Releases */}
          <ContentRow
            title="New Releases"
            subtitle="Fresh additions streaming in 4K Ultra HD"
            items={newReleases}
          />

          {/* Top Rated */}
          <ContentRow
            title="Critically Acclaimed & Top Rated"
            subtitle="Rated 9.0+ by global cinephiles"
            items={topRated}
          />

          {/* Genre Sections: Sci-Fi & Action & Thrillers */}
          <ContentRow
            title="Mind-Bending Sci-Fi & Cyberpunk"
            items={filteredCatalog.filter((c) => c.genres.includes('Sci-Fi'))}
          />

          <ContentRow
            title="Edge-of-Your-Seat Thrillers"
            items={filteredCatalog.filter((c) => c.genres.includes('Thriller'))}
          />

          <ContentRow
            title="Documentaries & Real Expeditions"
            items={filteredCatalog.filter((c) => c.genres.includes('Documentary'))}
          />
        </>
      )}
    </div>
  );
};
