import React, { useState, useEffect, useRef } from 'react';
import { ContentItem } from '../types';
import { useApp } from '../context/AppContext';
import { Play, Plus, Check, Info, Volume2, VolumeX, Star, Sparkles } from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const { catalog, startPlayback, toggleMyList, isInMyList, setSelectedContent, getProgressForContent } = useApp();
  const featuredItems = catalog.filter((c) => c.featured);
  const items = featuredItems.length > 0 ? featuredItems : catalog.slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = items[currentIndex] || items[0];
  const inList = current ? isInMyList(current.id) : false;
  const progress = current ? getProgressForContent(current.id) : undefined;

  // Auto rotate banner every 8 seconds if not interacting
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [items.length]);

  // Video preview auto-start after 1.5s
  useEffect(() => {
    setIsPlayingPreview(false);
    const previewTimer = setTimeout(() => {
      setIsPlayingPreview(true);
    }, 1500);
    return () => clearTimeout(previewTimer);
  }, [currentIndex]);

  if (!current) return null;

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] max-h-[580px] overflow-hidden select-none">
      {/* Background Media */}
      <div className="absolute inset-0 bg-zinc-950">
        {/* Background Image */}
        <img
          src={current.backdropUrl || current.posterUrl}
          alt={current.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isPlayingPreview ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Video Trailer Preview */}
        {current.trailerUrl && isPlayingPreview && (
          <video
            ref={videoRef}
            src={current.trailerUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-100"
          />
        )}

        {/* Cinematic Vignette & Gradients (WCAG AA Contrast Compliant) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Audio Mute/Unmute Toggle */}
      {isPlayingPreview && current.trailerUrl && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          aria-label={isMuted ? 'Unmute video trailer' : 'Mute video trailer'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}

      {/* Content Meta & Call to Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-20 max-w-2xl">
        {/* Original Series/Film Kicker */}
        <div className="flex items-center gap-2 mb-2">
          {current.isOriginal && (
            <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-rose-500">
              <Sparkles className="w-3.5 h-3.5 fill-rose-500" />
              VELA ORIGINAL
            </span>
          )}
          {current.is4K && (
            <span className="text-[10px] font-bold text-zinc-300 bg-white/10 px-1.5 py-0.5 rounded border border-white/15">
              4K ULTRA HD
            </span>
          )}
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-['Syne',sans-serif] drop-shadow-md">
          {current.title}
        </h1>

        {/* Clean Unboxed Metadata */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-300 font-medium">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {current.rating.toFixed(1)}
          </span>
          <span aria-hidden="true" className="text-zinc-500">·</span>
          <span>{current.year}</span>
          <span aria-hidden="true" className="text-zinc-500">·</span>
          <span className="px-1 border border-zinc-600 rounded text-[10px] leading-tight">
            {current.maturityRating}
          </span>
          <span aria-hidden="true" className="text-zinc-500">·</span>
          <span>{current.duration}</span>
          <span aria-hidden="true" className="text-zinc-500">·</span>
          <span className="text-zinc-400">{current.genres.join(' / ')}</span>
        </div>

        {/* Synopsis snippet */}
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow">
          {current.synopsis}
        </p>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2.5">
          <button
            onClick={() => startPlayback(current, undefined, progress?.watchedSeconds)}
            className="flex-1 sm:flex-none h-11 px-6 rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{progress && progress.watchedSeconds > 10 ? 'Resume' : 'Watch Now'}</span>
          </button>

          <button
            onClick={() => toggleMyList(current.id)}
            className="h-11 px-4 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 backdrop-blur-md border border-white/15 transition-all"
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
            onClick={() => setSelectedContent(current)}
            className="h-11 w-11 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all"
            aria-label="Content Details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-3 right-5 z-20 flex items-center gap-1.5">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-6 bg-rose-500' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
