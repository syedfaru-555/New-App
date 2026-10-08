import React, { useState } from 'react';
import { ContentItem, Episode } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Play,
  Plus,
  Check,
  Star,
  Download,
  Share2,
  Film,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { ContentCard } from './ContentCard';

export const ContentDetailsModal: React.FC = () => {
  const {
    selectedContent,
    setSelectedContent,
    startPlayback,
    toggleMyList,
    isInMyList,
    downloadContent,
    isDownloaded,
    getRecommendations,
    showToast,
    getProgressForContent
  } = useApp();

  const [activeSeasonIndex, setActiveSeasonIndex] = useState(0);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  if (!selectedContent) return null;

  const item = selectedContent;
  const inList = isInMyList(item.id);
  const downloaded = isDownloaded(item.id);
  const progress = getProgressForContent(item.id);
  const recommendations = getRecommendations(item.id);

  const seasons = item.seasons || [];
  const currentSeason = seasons[activeSeasonIndex] || seasons[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: item.title,
          text: `Watch ${item.title} on Vela Stream!`,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="relative w-full max-w-4xl bg-zinc-950 sm:rounded-2xl border-t sm:border border-white/10 overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setSelectedContent(null)}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-transform active:scale-95"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 scrollbar-none pb-12">
          {/* Top Backdrop Banner with Video or Image */}
          <div className="relative w-full aspect-video sm:aspect-[21/9] bg-zinc-900">
            {isPlayingTrailer && item.trailerUrl ? (
              <video
                src={item.trailerUrl}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={item.backdropUrl || item.posterUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            )}

            {/* Backdrop Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

            {/* Quick Play Trigger over Backdrop if not playing trailer */}
            {!isPlayingTrailer && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => startPlayback(item, undefined, progress?.watchedSeconds)}
                  className="w-16 h-16 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl shadow-rose-950/80 transition-transform hover:scale-110 active:scale-95"
                  aria-label="Play title"
                >
                  <Play className="w-7 h-7 fill-white ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Details Body */}
          <div className="px-5 sm:px-8 -mt-6 sm:-mt-10 relative z-20">
            {/* Poster & Main Header info */}
            <div className="flex gap-4 sm:gap-6 items-start">
              <img
                src={item.posterUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-24 sm:w-36 rounded-lg shadow-2xl border border-white/10 shrink-0 object-cover aspect-[2/3] hidden sm:block"
              />

              <div className="flex-1">
                {/* Original badge */}
                {item.isOriginal && (
                  <div className="flex items-center gap-1 text-[11px] font-black text-rose-500 uppercase tracking-widest mb-1">
                    <Sparkles className="w-3.5 h-3.5 fill-rose-500" />
                    VELA ORIGINAL {item.type === 'series' ? 'SERIES' : 'FILM'}
                  </div>
                )}

                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight font-['Syne',sans-serif]">
                  {item.title}
                </h2>

                {item.tagline && (
                  <p className="text-xs sm:text-sm text-zinc-400 italic mt-0.5">
                    "{item.tagline}"
                  </p>
                )}

                {/* Metadata Line */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                  <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {item.rating.toFixed(1)} / 10
                  </span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span>{item.year}</span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="px-1.5 py-0.5 rounded border border-zinc-700 text-[10px] font-semibold text-zinc-300">
                    {item.maturityRating}
                  </span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span>{item.duration}</span>
                  {item.is4K && (
                    <>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span className="text-[10px] font-bold px-1 bg-white/10 rounded">4K UHD</span>
                    </>
                  )}
                  {item.isHDR && (
                    <span className="text-[10px] font-bold px-1 bg-white/10 rounded">HDR10+</span>
                  )}
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => startPlayback(item, undefined, progress?.watchedSeconds)}
                className="flex-1 sm:flex-initial min-w-[140px] h-11 px-6 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{progress && progress.watchedSeconds > 10 ? 'Resume' : 'Watch Now'}</span>
              </button>

              {item.trailerUrl && (
                <button
                  onClick={() => setIsPlayingTrailer(!isPlayingTrailer)}
                  className="h-11 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 border border-white/10 active:scale-95 transition-all"
                >
                  <Film className="w-4 h-4" />
                  <span>{isPlayingTrailer ? 'Hide Trailer' : 'Trailer'}</span>
                </button>
              )}

              <button
                onClick={() => toggleMyList(item.id)}
                className="h-11 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 border border-white/10 active:scale-95 transition-all"
              >
                {inList ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>My List</span>
                  </>
                )}
              </button>

              <button
                onClick={() => downloadContent(item)}
                className="h-11 px-3 sm:px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 border border-white/10 active:scale-95 transition-all"
                title="Download for offline viewing"
              >
                <Download className={`w-4 h-4 ${downloaded ? 'text-emerald-400' : ''}`} />
                <span className="hidden sm:inline">{downloaded ? 'Downloaded' : 'Download'}</span>
              </button>

              <button
                onClick={handleShare}
                className="h-11 w-11 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center border border-white/10 active:scale-95 transition-all"
                aria-label="Share title"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Synopsis */}
            <div className="mt-6">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Storyline
              </h3>
              <p className="text-sm text-zinc-200 leading-relaxed">
                {item.synopsis}
              </p>
            </div>

            {/* Specifications: Genres, Languages, Audio, Director */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-white/10 pt-4">
              <div>
                <span className="text-zinc-500">Director: </span>
                <span className="text-zinc-200 font-semibold">{item.director}</span>
              </div>
              <div>
                <span className="text-zinc-500">Genres: </span>
                <span className="text-zinc-200">{item.genres.join(', ')}</span>
              </div>
              <div>
                <span className="text-zinc-500">Audio: </span>
                <span className="text-zinc-200">{item.audioTracks.join(', ')}</span>
              </div>
              <div>
                <span className="text-zinc-500">Subtitles: </span>
                <span className="text-zinc-200">{item.subtitles.join(', ')}</span>
              </div>
            </div>

            {/* Cast section */}
            {item.cast && item.cast.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Starring Cast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {item.cast.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                      <img
                        src={c.avatarUrl}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-zinc-100 truncate">{c.name}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{c.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Series Seasons and Episodes */}
            {item.type === 'series' && seasons.length > 0 && (
              <div className="mt-8 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Episodes
                  </h3>

                  {/* Season Dropdown / Selector */}
                  {seasons.length > 1 && (
                    <div className="relative inline-block">
                      <select
                        value={activeSeasonIndex}
                        onChange={(e) => setActiveSeasonIndex(Number(e.target.value))}
                        className="appearance-none bg-zinc-900 text-zinc-200 text-xs font-semibold px-3 py-1.5 pr-8 rounded-lg border border-white/15 focus:outline-none focus:border-rose-500"
                      >
                        {seasons.map((s, idx) => (
                          <option key={idx} value={idx}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                    </div>
                  )}
                </div>

                {/* Episode List */}
                <div className="space-y-3">
                  {currentSeason?.episodes.map((ep: Episode) => (
                    <div
                      key={ep.id}
                      onClick={() => startPlayback(item, ep)}
                      className="group flex flex-col sm:flex-row gap-3 p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-white/5 hover:border-white/15 cursor-pointer transition-colors"
                    >
                      {/* Episode Thumbnail */}
                      <div className="relative w-full sm:w-40 aspect-video rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                        <img
                          src={ep.thumbnail || item.backdropUrl}
                          alt={ep.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-[10px] font-semibold text-zinc-300">
                          {ep.duration}
                        </span>
                      </div>

                      {/* Episode Info */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-zinc-100 group-hover:text-rose-400 transition-colors">
                            {ep.episodeNumber}. {ep.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadContent(item, ep);
                            }}
                            className="text-zinc-400 hover:text-white p-1"
                            title="Download episode"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                          {ep.synopsis}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* More Like This / Recommendations */}
            {recommendations.length > 0 && (
              <div className="mt-8 border-t border-white/10 pt-5">
                <h3 className="text-base font-bold text-white tracking-tight mb-3">
                  More Like This
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {recommendations.slice(0, 5).map((rec) => (
                    <ContentCard key={rec.id} item={rec} showProgress={false} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
