import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ContentItem,
  Profile,
  UserAccount,
  WatchProgress,
  DownloadedItem,
  DownloadSettings,
  DownloadQuality,
  NotificationItem,
  SubscriptionTier,
  Episode
} from '../types';
import {
  INITIAL_CONTENT,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUBSCRIPTION_TIERS,
  INITIAL_USER
} from '../data/initialData';

interface AppContextType {
  // Navigation & UI state
  activeTab: 'home' | 'movies' | 'series' | 'search' | 'downloads' | 'mylist' | 'profile';
  setActiveTab: (tab: 'home' | 'movies' | 'series' | 'search' | 'downloads' | 'mylist' | 'profile') => void;
  activeGenre: string;
  setActiveGenre: (genre: string) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;

  // Catalog & Recommendations
  catalog: ContentItem[];
  filteredCatalog: ContentItem[];
  getContentById: (id: string) => ContentItem | undefined;
  getRecommendations: (contentId?: string) => ContentItem[];

  // Selection & Video Playback
  selectedContent: ContentItem | null;
  setSelectedContent: (content: ContentItem | null) => void;
  activePlayback: { content: ContentItem; episode?: Episode; resumeSeconds?: number } | null;
  startPlayback: (content: ContentItem, episode?: Episode, resumeSeconds?: number) => void;
  stopPlayback: () => void;

  // Watch Progress & Continue Watching
  watchProgress: Record<string, WatchProgress>;
  updateWatchProgress: (contentId: string, episodeId: string | undefined, watchedSeconds: number, totalSeconds: number) => void;
  getProgressForContent: (contentId: string) => WatchProgress | undefined;
  continueWatchingList: { item: ContentItem; progress: WatchProgress }[];

  // My List
  myListIds: string[];
  toggleMyList: (contentId: string) => void;
  isInMyList: (contentId: string) => boolean;

  // Offline Downloads & Storage Limit Logic
  downloadedItems: DownloadedItem[];
  downloadSettings: DownloadSettings;
  updateDownloadSettings: (settings: Partial<DownloadSettings>) => void;
  simulatedNetwork: 'wifi' | 'cellular';
  setSimulatedNetwork: (net: 'wifi' | 'cellular') => void;
  toggleSimulatedNetwork: () => void;
  downloadContent: (item: ContentItem, episode?: Episode, quality?: DownloadQuality, allowCellular?: boolean) => { success: boolean; reason?: string };
  removeDownload: (downloadId: string) => void;
  pauseDownload: (downloadId: string) => void;
  resumeDownload: (downloadId: string) => void;
  cancelDownload: (downloadId: string) => void;
  deleteWatchedDownloads: () => number;
  deleteAllDownloads: () => void;
  isDownloaded: (contentId: string, episodeId?: string) => boolean;
  getDownloadItem: (contentId: string, episodeId?: string) => DownloadedItem | undefined;
  totalDownloadedMb: number;
  storageLimitMb: number;
  availableStorageMb: number;
  storagePercentUsed: number;

  // Storage and Network alerts
  cellularDownloadPrompt: { item: ContentItem; episode?: Episode; quality?: DownloadQuality } | null;
  setCellularDownloadPrompt: (data: { item: ContentItem; episode?: Episode; quality?: DownloadQuality } | null) => void;
  storageLimitPrompt: { neededMb: number; itemTitle: string } | null;
  setStorageLimitPrompt: (data: { neededMb: number; itemTitle: string } | null) => void;

  // Profiles & User
  user: UserAccount;
  activeProfile: Profile;
  switchProfile: (profileId: string) => void;
  addProfile: (newProf: Omit<Profile, 'id'>) => void;
  updateProfile: (profile: Profile) => void;
  deleteProfile: (profileId: string) => void;

  // Modals & Sheets
  showProfileSwitchModal: boolean;
  setShowProfileSwitchModal: (show: boolean) => void;
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
  paymentModalData: { tier: SubscriptionTier; billingCycle: 'monthly' | 'yearly' } | null;
  setPaymentModalData: (data: { tier: SubscriptionTier; billingCycle: 'monthly' | 'yearly' } | null) => void;
  showNotificationsModal: boolean;
  setShowNotificationsModal: (show: boolean) => void;
  showAdminDashboard: boolean;
  setShowAdminDashboard: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Subscriptions & Checkout
  subscriptionTiers: SubscriptionTier[];
  upgradeSubscription: (tierId: string, billingCycle: 'monthly' | 'yearly') => void;

  // Admin CMS Actions
  addContentItem: (item: ContentItem) => void;
  updateContentItem: (item: ContentItem) => void;
  deleteContentItem: (id: string) => void;
  toggleFeaturedContent: (id: string) => void;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CATALOG: 'vela_catalog_v1',
  USER: 'vela_user_v1',
  MY_LIST: 'vela_mylist_v1',
  WATCH_PROGRESS: 'vela_progress_v1',
  DOWNLOADS: 'vela_downloads_v1',
  DOWNLOAD_SETTINGS: 'vela_dl_settings_v1',
  SIM_NETWORK: 'vela_network_mode_v1',
  NOTIFICATIONS: 'vela_notifs_v1',
  IS_MOBILE_FRAME: 'vela_mobile_frame_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Frame
  const [activeTab, setActiveTab] = useState<'home' | 'movies' | 'series' | 'search' | 'downloads' | 'mylist' | 'profile'>('home');
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(() => {
    // Default to mobile frame on wider screens so user gets the mobile app experience right away
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.IS_MOBILE_FRAME);
      if (saved !== null) return saved === 'true';
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Catalog
  const [catalog, setCatalog] = useState<ContentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATALOG);
      return saved ? JSON.parse(saved) : INITIAL_CONTENT;
    } catch {
      return INITIAL_CONTENT;
    }
  });

  // User & Profiles
  const [user, setUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // My List
  const [myListIds, setMyListIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MY_LIST);
      return saved ? JSON.parse(saved) : ['vela-001', 'vela-002', 'vela-007'];
    } catch {
      return ['vela-001', 'vela-002', 'vela-007'];
    }
  });

  // Watch Progress
  const [watchProgress, setWatchProgress] = useState<Record<string, WatchProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATCH_PROGRESS);
      return saved ? JSON.parse(saved) : {
        'vela-001': {
          contentId: 'vela-001',
          watchedSeconds: 2890,
          totalSeconds: 8880,
          lastWatchedAt: new Date(Date.now() - 3600000).toISOString(),
          completed: false
        },
        'vela-002': {
          contentId: 'vela-002',
          episodeId: 'sp-s1-e1',
          watchedSeconds: 1450,
          totalSeconds: 3120,
          lastWatchedAt: new Date(Date.now() - 86400000).toISOString(),
          completed: false
        }
      };
    } catch {
      return {};
    }
  });

  // Download Settings
  const [downloadSettings, setDownloadSettings] = useState<DownloadSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOWNLOAD_SETTINGS);
      return saved ? JSON.parse(saved) : {
        wifiOnly: true,
        smartDownloads: true,
        storageLimitGb: 16,
        quality: 'high'
      };
    } catch {
      return {
        wifiOnly: true,
        smartDownloads: true,
        storageLimitGb: 16,
        quality: 'high'
      };
    }
  });

  // Simulated Network mode (Wi-Fi vs Cellular 5G)
  const [simulatedNetwork, setSimulatedNetwork] = useState<'wifi' | 'cellular'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIM_NETWORK);
      return (saved as 'wifi' | 'cellular') || 'wifi';
    } catch {
      return 'wifi';
    }
  });

  // Downloads with rich status
  const [downloadedItems, setDownloadedItems] = useState<DownloadedItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOWNLOADS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'dl-1',
          contentId: 'vela-001',
          title: 'Chronos: The Quantum Odyssey',
          type: 'movie',
          fileSizeMb: 1480,
          downloadedAt: '2026-03-02',
          posterUrl: '/src/assets/images/vela_hero_chronos_deep_1791479592223.jpg',
          duration: '2h 28m',
          quality: 'high',
          status: 'completed',
          progress: 100,
          downloadSpeedMb: 24.5,
          watched: false
        }
      ];
    } catch {
      return [];
    }
  });

  // Cellular prompt modal and Storage prompt modal states
  const [cellularDownloadPrompt, setCellularDownloadPrompt] = useState<{
    item: ContentItem;
    episode?: Episode;
    quality?: DownloadQuality;
  } | null>(null);

  const [storageLimitPrompt, setStorageLimitPrompt] = useState<{
    neededMb: number;
    itemTitle: string;
  } | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Modals & Active playback
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [activePlayback, setActivePlayback] = useState<{ content: ContentItem; episode?: Episode; resumeSeconds?: number } | null>(null);
  const [showProfileSwitchModal, setShowProfileSwitchModal] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [paymentModalData, setPaymentModalData] = useState<{ tier: SubscriptionTier; billingCycle: 'monthly' | 'yearly' } | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MY_LIST, JSON.stringify(myListIds));
  }, [myListIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCH_PROGRESS, JSON.stringify(watchProgress));
  }, [watchProgress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloadedItems));
  }, [downloadedItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOWNLOAD_SETTINGS, JSON.stringify(downloadSettings));
  }, [downloadSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIM_NETWORK, simulatedNetwork);
  }, [simulatedNetwork]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_MOBILE_FRAME, String(isMobileFrame));
  }, [isMobileFrame]);

  // Toast auto-clear
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Active Profile calculation
  const activeProfile = user.profiles.find((p) => p.id === user.activeProfileId) || user.profiles[0];

  // Kids Filter: Filter out 16+ and 18+ titles if kids mode is active
  const filteredCatalog = catalog.filter((item) => {
    if (activeProfile?.isKids) {
      return item.maturityRating === 'U' || item.maturityRating === 'U/A 13+';
    }
    return true;
  });

  const getContentById = (id: string) => catalog.find((c) => c.id === id);

  // Continue Watching items sorted by recent timestamp
  const continueWatchingList = Object.values(watchProgress)
    .filter((wp) => !wp.completed && wp.watchedSeconds > 15)
    .sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime())
    .map((wp) => {
      const item = getContentById(wp.contentId);
      return item ? { item, progress: wp } : null;
    })
    .filter(Boolean) as { item: ContentItem; progress: WatchProgress }[];

  // Recommendation engine
  const getRecommendations = (currentContentId?: string) => {
    const current = currentContentId ? getContentById(currentContentId) : null;
    if (current) {
      // Find items matching same genres or director
      return filteredCatalog
        .filter((c) => c.id !== current.id)
        .sort((a, b) => {
          const matchA = a.genres.filter((g) => current.genres.includes(g)).length;
          const matchB = b.genres.filter((g) => current.genres.includes(g)).length;
          return matchB - matchA;
        })
        .slice(0, 10);
    }
    // Default smart recommendations: blend of rating and user's watched genres
    return [...filteredCatalog].sort((a, b) => b.rating - a.rating).slice(0, 10);
  };

  // Playback handlers
  const startPlayback = (content: ContentItem, episode?: Episode, resumeSeconds?: number) => {
    // If not specified, check saved watch progress
    const key = episode ? `${content.id}_${episode.id}` : content.id;
    const existing = watchProgress[key] || watchProgress[content.id];
    const initialSeconds = resumeSeconds !== undefined ? resumeSeconds : (existing ? existing.watchedSeconds : 0);

    setActivePlayback({
      content,
      episode,
      resumeSeconds: initialSeconds
    });
  };

  const stopPlayback = () => {
    setActivePlayback(null);
  };

  const updateWatchProgress = (
    contentId: string,
    episodeId: string | undefined,
    watchedSeconds: number,
    totalSeconds: number
  ) => {
    const key = episodeId ? `${contentId}_${episodeId}` : contentId;
    const completed = totalSeconds > 0 && watchedSeconds / totalSeconds > 0.92;

    setWatchProgress((prev) => ({
      ...prev,
      [key]: {
        contentId,
        episodeId,
        watchedSeconds: Math.floor(watchedSeconds),
        totalSeconds: Math.floor(totalSeconds),
        lastWatchedAt: new Date().toISOString(),
        completed
      },
      // Also update base contentId for movie
      [contentId]: {
        contentId,
        episodeId,
        watchedSeconds: Math.floor(watchedSeconds),
        totalSeconds: Math.floor(totalSeconds),
        lastWatchedAt: new Date().toISOString(),
        completed
      }
    }));
  };

  const getProgressForContent = (contentId: string) => {
    return watchProgress[contentId];
  };

  // My List
  const toggleMyList = (contentId: string) => {
    const item = getContentById(contentId);
    if (!item) return;
    if (myListIds.includes(contentId)) {
      setMyListIds((prev) => prev.filter((id) => id !== contentId));
      showToast(`Removed "${item.title}" from My List`);
    } else {
      setMyListIds((prev) => [...prev, contentId]);
      showToast(`Added "${item.title}" to My List`);
    }
  };

  const isInMyList = (contentId: string) => myListIds.includes(contentId);

  // Storage Limit Math & Metrics
  const totalDownloadedMb = downloadedItems.reduce((acc, curr) => acc + curr.fileSizeMb, 0);
  const storageLimitMb = downloadSettings.storageLimitGb * 1024;
  const availableStorageMb = Math.max(0, storageLimitMb - totalDownloadedMb);
  const storagePercentUsed = storageLimitMb > 0
    ? Math.min(100, Math.round((totalDownloadedMb / storageLimitMb) * 100))
    : 0;

  // Toggle Network simulation
  const toggleSimulatedNetwork = () => {
    const next = simulatedNetwork === 'wifi' ? 'cellular' : 'wifi';
    setSimulatedNetwork(next);
    showToast(`Network switched to ${next === 'wifi' ? 'Home_5G Wi-Fi' : 'Cellular Mobile 5G'}`);
  };

  const updateDownloadSettings = (settings: Partial<DownloadSettings>) => {
    setDownloadSettings((prev) => ({ ...prev, ...settings }));
    showToast('Download settings updated');
  };

  // Estimate file size in MB based on quality and duration
  const calculateEstimatedSizeMb = (isMovie: boolean, quality: DownloadQuality): number => {
    switch (quality) {
      case 'standard':
        return isMovie ? 520 : 240;
      case 'ultra':
        return isMovie ? 3400 : 1350;
      case 'high':
      default:
        return isMovie ? 1480 : 580;
    }
  };

  // Active Download Simulation Loop
  useEffect(() => {
    const hasDownloading = downloadedItems.some((d) => d.status === 'downloading');
    if (!hasDownloading) return;

    // Check if network is cellular and wifiOnly is turned on: auto-pause downloading items
    if (simulatedNetwork === 'cellular' && downloadSettings.wifiOnly) {
      setDownloadedItems((prev) =>
        prev.map((d) => (d.status === 'downloading' ? { ...d, status: 'paused' } : d))
      );
      showToast('Downloads paused: Connected to Cellular and Wi-Fi Only is enabled.');
      return;
    }

    const interval = setInterval(() => {
      setDownloadedItems((prev) =>
        prev.map((d) => {
          if (d.status !== 'downloading') return d;
          const step = simulatedNetwork === 'wifi' ? 18 : 8; // Wi-Fi is faster than cellular
          const newProgress = Math.min(100, d.progress + step);
          const isDone = newProgress >= 100;

          if (isDone) {
            // Trigger completion toast
            setTimeout(() => {
              showToast(`"${d.title}" download complete! Ready for offline viewing.`);
            }, 100);
          }

          return {
            ...d,
            progress: newProgress,
            status: isDone ? 'completed' : 'downloading',
            downloadSpeedMb: simulatedNetwork === 'wifi' ? 24.8 : 7.4
          };
        })
      );
    }, 450);

    return () => clearInterval(interval);
  }, [downloadedItems, simulatedNetwork, downloadSettings.wifiOnly]);

  // Offline Downloads Manager
  const downloadContent = (
    item: ContentItem,
    episode?: Episode,
    qualityParam?: DownloadQuality,
    allowCellular: boolean = false
  ): { success: boolean; reason?: string } => {
    const downloadId = episode ? `dl-${item.id}-${episode.id}` : `dl-${item.id}`;
    const targetQuality = qualityParam || downloadSettings.quality;

    // 1. Check if already downloaded or in queue
    const existing = downloadedItems.find((d) => d.id === downloadId);
    if (existing) {
      if (existing.status === 'completed') {
        showToast(`"${episode ? episode.title : item.title}" is already downloaded`);
        return { success: false, reason: 'already_downloaded' };
      }
      if (existing.status === 'downloading') {
        showToast('Download is currently in progress');
        return { success: false, reason: 'in_progress' };
      }
    }

    // 2. Wi-Fi Only Network Check
    if (simulatedNetwork === 'cellular' && downloadSettings.wifiOnly && !allowCellular) {
      setCellularDownloadPrompt({ item, episode, quality: targetQuality });
      showToast('Wi-Fi Only enabled. Connect to Wi-Fi or approve cellular data.');
      return { success: false, reason: 'cellular_blocked' };
    }

    // 3. Storage Limit Quota Check
    const estimatedSizeMb = calculateEstimatedSizeMb(item.type === 'movie', targetQuality);
    if (totalDownloadedMb + estimatedSizeMb > storageLimitMb) {
      setStorageLimitPrompt({
        neededMb: estimatedSizeMb,
        itemTitle: episode ? `${item.title}: ${episode.title}` : item.title
      });
      showToast(`Storage limit reached (${downloadSettings.storageLimitGb} GB). Free up space to continue.`);
      return { success: false, reason: 'storage_full' };
    }

    // 4. Create and start download
    const title = episode ? `${item.title}: ${episode.title}` : item.title;
    const newItem: DownloadedItem = {
      id: downloadId,
      contentId: item.id,
      episodeId: episode?.id,
      title,
      type: item.type,
      fileSizeMb: estimatedSizeMb,
      downloadedAt: new Date().toISOString().split('T')[0],
      posterUrl: episode ? episode.thumbnail : item.posterUrl,
      duration: episode ? episode.duration : item.duration,
      quality: targetQuality,
      status: 'downloading',
      progress: 6,
      downloadSpeedMb: simulatedNetwork === 'wifi' ? 24.5 : 7.2,
      watched: false
    };

    setDownloadedItems((prev) => [newItem, ...prev.filter((d) => d.id !== downloadId)]);
    showToast(`Downloading "${title}" (${estimatedSizeMb} MB)...`);
    return { success: true };
  };

  const removeDownload = (downloadId: string) => {
    setDownloadedItems((prev) => prev.filter((d) => d.id !== downloadId));
    showToast('Download deleted from storage');
  };

  const pauseDownload = (downloadId: string) => {
    setDownloadedItems((prev) =>
      prev.map((d) => (d.id === downloadId ? { ...d, status: 'paused' } : d))
    );
    showToast('Download paused');
  };

  const resumeDownload = (downloadId: string) => {
    if (simulatedNetwork === 'cellular' && downloadSettings.wifiOnly) {
      showToast('Cannot resume: on Cellular data with Wi-Fi Only enabled.');
      return;
    }
    setDownloadedItems((prev) =>
      prev.map((d) => (d.id === downloadId ? { ...d, status: 'downloading' } : d))
    );
    showToast('Download resumed');
  };

  const cancelDownload = (downloadId: string) => {
    setDownloadedItems((prev) => prev.filter((d) => d.id !== downloadId));
    showToast('Download cancelled');
  };

  const deleteWatchedDownloads = (): number => {
    const watchedIds = downloadedItems.filter((d) => {
      const progress = getProgressForContent(d.contentId);
      return d.watched || (progress && progress.completed);
    });

    if (watchedIds.length === 0) {
      showToast('No watched downloads found to clean up');
      return 0;
    }

    const freedMb = watchedIds.reduce((sum, item) => sum + item.fileSizeMb, 0);
    setDownloadedItems((prev) => prev.filter((d) => !watchedIds.some((w) => w.id === d.id)));
    showToast(`Freed ${(freedMb / 1024).toFixed(1)} GB by deleting ${watchedIds.length} watched files`);
    return freedMb;
  };

  const deleteAllDownloads = () => {
    const totalFreed = totalDownloadedMb;
    setDownloadedItems([]);
    showToast(`Cleared all downloads. Freed ${(totalFreed / 1024).toFixed(1)} GB`);
  };

  const isDownloaded = (contentId: string, episodeId?: string) => {
    const id = episodeId ? `dl-${contentId}-${episodeId}` : `dl-${contentId}`;
    return downloadedItems.some((d) => (d.id === id || (d.contentId === contentId && !episodeId)) && d.status === 'completed');
  };

  const getDownloadItem = (contentId: string, episodeId?: string) => {
    const id = episodeId ? `dl-${contentId}-${episodeId}` : `dl-${contentId}`;
    return downloadedItems.find((d) => d.id === id || (d.contentId === contentId && !episodeId));
  };

  // Profile Switching & Management
  const switchProfile = (profileId: string) => {
    const target = user.profiles.find((p) => p.id === profileId);
    if (target) {
      setUser((prev) => ({ ...prev, activeProfileId: profileId }));
      showToast(`Switched to profile: ${target.name}`);
      setShowProfileSwitchModal(false);
    }
  };

  const addProfile = (newProf: Omit<Profile, 'id'>) => {
    const id = `prof-${Date.now()}`;
    const created: Profile = { ...newProf, id };
    setUser((prev) => ({
      ...prev,
      profiles: [...prev.profiles, created],
      activeProfileId: id
    }));
    showToast(`Profile "${created.name}" created`);
  };

  const updateProfile = (profile: Profile) => {
    setUser((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => (p.id === profile.id ? profile : p))
    }));
    showToast('Profile settings saved');
  };

  const deleteProfile = (profileId: string) => {
    if (user.profiles.length <= 1) {
      showToast('Cannot delete the only remaining profile');
      return;
    }
    setUser((prev) => {
      const remaining = prev.profiles.filter((p) => p.id !== profileId);
      return {
        ...prev,
        profiles: remaining,
        activeProfileId: prev.activeProfileId === profileId ? remaining[0].id : prev.activeProfileId
      };
    });
    showToast('Profile deleted');
  };

  // Notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  // Subscription upgrade
  const upgradeSubscription = (tierId: string, billingCycle: 'monthly' | 'yearly') => {
    const tier = INITIAL_SUBSCRIPTION_TIERS.find((t) => t.id === tierId);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + (billingCycle === 'yearly' ? 1 : 0));
    if (billingCycle === 'monthly') nextYear.setMonth(nextYear.getMonth() + 1);

    setUser((prev) => ({
      ...prev,
      currentTierId: tierId,
      planBillingCycle: billingCycle,
      planExpiresAt: nextYear.toISOString().split('T')[0]
    }));

    // Add celebratory notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Subscription Activated!',
      message: `You are now on the ${tier?.name || 'Upgraded'} plan. Enjoy 4K HDR & spatial audio streaming!`,
      timestamp: 'Just now',
      read: false,
      type: 'billing'
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Subscribed to ${tier?.name || 'new plan'} successfully!`);
    setPaymentModalData(null);
    setShowSubscriptionModal(false);
  };

  // Admin Catalog actions
  const addContentItem = (item: ContentItem) => {
    setCatalog((prev) => [item, ...prev]);
    showToast(`Published "${item.title}" to Vela catalog`);
  };

  const updateContentItem = (item: ContentItem) => {
    setCatalog((prev) => prev.map((c) => (c.id === item.id ? item : c)));
    showToast(`Updated "${item.title}"`);
  };

  const deleteContentItem = (id: string) => {
    const item = getContentById(id);
    setCatalog((prev) => prev.filter((c) => c.id !== id));
    showToast(`Removed "${item?.title || 'Title'}"`);
  };

  const toggleFeaturedContent = (id: string) => {
    setCatalog((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    );
    showToast('Updated featured status');
  };

  const resetAllData = () => {
    setCatalog(INITIAL_CONTENT);
    setUser(INITIAL_USER);
    setNotifications(INITIAL_NOTIFICATIONS);
    setMyListIds(['vela-001', 'vela-002', 'vela-007']);
    setDownloadedItems([]);
    showToast('Catalog and profile restored to defaults');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeGenre,
        setActiveGenre,
        isMobileFrame,
        setIsMobileFrame,
        catalog,
        filteredCatalog,
        getContentById,
        getRecommendations,
        selectedContent,
        setSelectedContent,
        activePlayback,
        startPlayback,
        stopPlayback,
        watchProgress,
        updateWatchProgress,
        getProgressForContent,
        continueWatchingList,
        myListIds,
        toggleMyList,
        isInMyList,
        downloadedItems,
        downloadSettings,
        updateDownloadSettings,
        simulatedNetwork,
        setSimulatedNetwork,
        toggleSimulatedNetwork,
        downloadContent,
        removeDownload,
        pauseDownload,
        resumeDownload,
        cancelDownload,
        deleteWatchedDownloads,
        deleteAllDownloads,
        isDownloaded,
        getDownloadItem,
        totalDownloadedMb,
        storageLimitMb,
        availableStorageMb,
        storagePercentUsed,
        cellularDownloadPrompt,
        setCellularDownloadPrompt,
        storageLimitPrompt,
        setStorageLimitPrompt,
        user,
        activeProfile,
        switchProfile,
        addProfile,
        updateProfile,
        deleteProfile,
        showProfileSwitchModal,
        setShowProfileSwitchModal,
        showSubscriptionModal,
        setShowSubscriptionModal,
        paymentModalData,
        setPaymentModalData,
        showNotificationsModal,
        setShowNotificationsModal,
        showAdminDashboard,
        setShowAdminDashboard,
        showAuthModal,
        setShowAuthModal,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        subscriptionTiers: INITIAL_SUBSCRIPTION_TIERS,
        upgradeSubscription,
        addContentItem,
        updateContentItem,
        deleteContentItem,
        toggleFeaturedContent,
        toastMessage,
        showToast,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
