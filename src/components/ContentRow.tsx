import React, { useRef } from 'react';
import { ContentItem } from '../types';
import { ContentCard } from './ContentCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  ranked?: boolean;
  aspect?: 'portrait' | 'landscape';
  subtitle?: string;
  onSeeAll?: () => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  items,
  ranked = false,
  aspect = 'portrait',
  subtitle,
  onSeeAll
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative my-4 sm:my-5 px-3.5 sm:px-4 group/row">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-2.5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-xs font-semibold text-rose-500 hover:text-rose-400 transition-colors"
          >
            Explore all
          </button>
        )}
      </div>

      {/* Left scroll button */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-30 w-9 h-14 bg-black/80 hover:bg-black/95 text-white items-center justify-center rounded-r border-r border-y border-white/10 opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-sm shadow-xl"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scrollable list */}
      <div
        ref={rowRef}
        className="flex items-start gap-2.5 sm:gap-3 overflow-x-auto scrollbar-none pb-2 pt-1 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, idx) => (
          <ContentCard
            key={item.id}
            item={item}
            rank={ranked ? idx + 1 : undefined}
            aspect={aspect}
            className={
              aspect === 'landscape'
                ? 'w-52 sm:w-60 md:w-68 shrink-0 min-w-0'
                : 'w-28 sm:w-32 md:w-36 shrink-0 min-w-0'
            }
          />
        ))}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-30 w-9 h-14 bg-black/80 hover:bg-black/95 text-white items-center justify-center rounded-l border-l border-y border-white/10 opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-sm shadow-xl"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
};
