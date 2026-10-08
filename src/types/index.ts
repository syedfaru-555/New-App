export type ContentType = 'movie' | 'series';

export interface CastMember {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  durationMinutes: number;
  synopsis: string;
  thumbnail: string;
  videoUrl: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  trailerUrl?: string;
  year: number;
  rating: number; // e.g. 9.1
  maturityRating: 'U' | 'U/A 13+' | '16+' | '18+';
  duration: string; // e.g. "2h 15m" or "3 Seasons"
  durationMinutes?: number;
  genres: string[];
  languages: string[];
  audioTracks: string[];
  subtitles: string[];
  director: string;
  cast: CastMember[];
  synopsis: string;
  tagline: string;
  featured?: boolean;
  trendingRank?: number;
  isOriginal?: boolean;
  is4K?: boolean;
  isHDR?: boolean;
  seasons?: Season[];
  createdAt?: string;
}

export interface Profile {
  id: string;
  name: string;
  avatarUrl: string;
  isKids: boolean;
  pin?: string;
  language: string;
  streamingQuality: 'Auto' | '4K UHD' | '1080p FHD' | '720p HD' | 'Data Saver';
  audioLanguage: string;
  subtitleLanguage: string;
  autoplayPreviews: boolean;
}

export interface WatchProgress {
  contentId: string;
  episodeId?: string;
  watchedSeconds: number;
  totalSeconds: number;
  lastWatchedAt: string;
  completed: boolean;
}

export interface DownloadedItem {
  id: string;
  contentId: string;
  episodeId?: string;
  title: string;
  type: ContentType;
  fileSizeMb: number;
  downloadedAt: string;
  posterUrl: string;
  duration: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: number;
  priceYearly: number;
  videoQuality: string;
  resolution: string;
  devices: number;
  audioQuality: string;
  features: string[];
  popular?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'release' | 'episode' | 'continue' | 'billing' | 'recommendation';
  contentId?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  currentTierId: string;
  planBillingCycle: 'monthly' | 'yearly';
  planExpiresAt: string;
  isAdmin: boolean;
  profiles: Profile[];
  activeProfileId: string;
}
