import React, { useState } from 'react';
import { ContentItem } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Play, Plus, Check } from 'lucide-react';

interface ContentCardProps {
  item: ContentItem;
  rank?: number;
  showProgress?: boolean;
  aspect?: 'portrait' | 'landscape';
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  rank,
  showProgress = true,
  aspect = 'portrait'
}) => {
  const { setSelectedContent, startPlayback, toggleMyList, isInMyList, getProgressForContent } = useApp();
  const [imgError, setImgError] = useState(false);

  const inList = isInMyList(item.id);
  const progress = getProgressForContent(item.id);
  const progressPercent = progress && progress.totalSeconds > 0
    ? Math.min(100, Math.round((progress.watchedSeconds / progress.totalSeconds) * 100))
    : 0;

  const isLandscape = aspect === 'landscape';

  return (
    <div
      onClick={() => setSelectedContent(item)}
      className="group relative flex-shrink-0 cursor-pointer select-none transition-transform duration-200 active:scale-95"
    >
      {/* Top 10 Rank Number Display (if provided) */}
      {rank !== undefined && (
        <div className="absolute -left-3 bottom-0 z-20 pointer-events-none">
          <span
            className="text-6xl font-black italic tracking-tighter text-transparent"
            style={{
              WebkitTextStroke: '2px rgba(255,255,255,0.6)',
              textShadow: '0 4px 14px rgba(0,0,0,0.9)'
            }}
          >
            {rank}
          </span>
        </div>
      )}

      {/* Card Visual Container */}
      <div
        className={`relative overflow-hidden rounded-xl bg-zinc-900 border border-white/10 transition-all duration-300 group-hover:border-rose-500/50 group-hover:shadow-lg group-hover:shadow-rose-950/20 ${
          isLandscape ? 'w-64 sm:w-72 aspect-video' : 'w-36 sm:w-44 aspect-[2/3]'
        }`}
      >
        {!imgError ? (
          <img
            src={isLandscape ? item.backdropUrl : item.posterUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-950 p-3 flex flex-col justify-end">
            <span className="text-xs font-semibold text-zinc-300">{item.title}</span>
          </div>
        )}

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Badges on Top */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {item.isOriginal && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md">
              Vela
            </span>
          )}
          {item.is4K && (
            <span className="ml-auto text-[9px] font-bold text-zinc-200 bg-black/70 px-1 rounded backdrop-blur-md border border-white/20">
              4K UHD
            </span>
          )}
        </div>

        {/* Quick Action Overlay on Hover / Focus */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              startPlayback(item, undefined, progress?.watchedSeconds);
            }}
            title="Play now"
            className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMyList(item.id);
            }}
            title={inList ? 'Remove from My List' : 'Add to My List'}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
          >
            {inList ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Watch Progress Bar */}
        {showProgress && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
            <div
              className="h-full bg-rose-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Card Metadata info */}
      <div className="mt-2 w-full">
        <h4 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate group-hover:text-rose-400 transition-colors">
          {item.title}
        </h4>

        {/* Clean unboxed metadata with separators */}
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {item.rating.toFixed(1)}
          </span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>{item.year}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>{item.genres[0]}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>{item.duration}</span>
        </div>

        {/* Language and maturity rating */}
        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-zinc-500">
          <span>{item.languages[0]}</span>
          <span aria-hidden="true" className="text-zinc-700">·</span>
          <span>{item.maturityRating}</span>
          {showProgress && progressPercent > 0 && (
            <>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span className="text-rose-400">{progressPercent}% watched</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
