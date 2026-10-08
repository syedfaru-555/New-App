import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Users,
  Sparkles,
  CreditCard,
  Settings,
  Globe,
  Sliders,
  Bell,
  HelpCircle,
  LogOut,
  Clock,
  Trash2,
  ShieldCheck,
  ChevronRight,
  ShieldAlert,
  Play,
  Download
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    activeProfile,
    setShowProfileSwitchModal,
    setShowSubscriptionModal,
    updateProfile,
    watchProgress,
    getContentById,
    startPlayback,
    setShowAuthModal,
    showToast,
    resetAllData,
    setActiveTab
  } = useApp();

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);

  // Watch history list
  const historyList = Object.values(watchProgress)
    .sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime())
    .map((wp) => {
      const item = getContentById(wp.contentId);
      return item ? { item, wp } : null;
    })
    .filter(Boolean) as { item: any; wp: any }[];

  const handleToggleAutoplay = () => {
    updateProfile({
      ...activeProfile,
      autoplayPreviews: !activeProfile.autoplayPreviews
    });
  };

  const handleQualityChange = (q: any) => {
    updateProfile({
      ...activeProfile,
      streamingQuality: q
    });
  };

  const currentTierFormatted = user.currentTierId.replace('tier-', '').toUpperCase();

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-4xl mx-auto space-y-6">
      {/* Profile Header Hero */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <img
            src={activeProfile.avatarUrl}
            alt={activeProfile.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-rose-500/60 shadow-xl"
          />
          {activeProfile.isKids && (
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {activeProfile.name}
            </h2>
            <span className="inline-block text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              {activeProfile.isKids ? 'Kids Profile' : 'Adult Profile'}
            </span>
          </div>

          <p className="text-xs text-zinc-400 mt-1">{user.email}</p>

          <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              onClick={() => setShowProfileSwitchModal(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Switch Profile</span>
            </button>

            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 hover:border-amber-400/60 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Plan: {currentTierFormatted}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Vela {currentTierFormatted}</h4>
            <p className="text-xs text-zinc-400">
              Billing cycle: {user.planBillingCycle} · Valid until {user.planExpiresAt}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSubscriptionModal(true)}
          className="text-xs font-semibold text-rose-500 hover:text-rose-400"
        >
          Manage Plan
        </button>
      </div>

      {/* Watch History Section */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-rose-500" />
            Recently Watched History
          </h3>
          {historyList.length > 0 && (
            <button
              onClick={() => setShowClearHistoryConfirm(true)}
              className="text-xs text-zinc-500 hover:text-rose-400"
            >
              Clear
            </button>
          )}
        </div>

        {historyList.length === 0 ? (
          <p className="text-xs text-zinc-500 py-3">No watch history on this profile yet.</p>
        ) : (
          <div className="space-y-2">
            {historyList.slice(0, 4).map(({ item, wp }) => (
              <div
                key={item.id}
                onClick={() => startPlayback(item, undefined, wp.watchedSeconds)}
                className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/40 hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-8 rounded object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-200 truncate">{item.title}</h4>
                  <p className="text-[10px] text-zinc-400">
                    Left off at {Math.floor(wp.watchedSeconds / 60)} mins
                  </p>
                </div>
                <Play className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* App & Playback Settings */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-rose-500" />
          Stream & App Preferences
        </h3>

        {/* Quality preference */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">Default Video Quality</h4>
            <p className="text-[11px] text-zinc-400">Controls maximum stream bitrate on cellular & Wi-Fi</p>
          </div>
          <select
            value={activeProfile.streamingQuality}
            onChange={(e) => handleQualityChange(e.target.value)}
            className="bg-zinc-800 text-xs text-zinc-200 p-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-rose-500"
          >
            {['Auto', '4K UHD', '1080p FHD', '720p HD', 'Data Saver'].map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        {/* Autoplay toggle */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">Autoplay Video Previews</h4>
            <p className="text-[11px] text-zinc-400">Play trailer previews automatically while browsing</p>
          </div>
          <button
            onClick={handleToggleAutoplay}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              activeProfile.autoplayPreviews ? 'bg-rose-600' : 'bg-zinc-700'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                activeProfile.autoplayPreviews ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Audio Language */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">Preferred Audio Track</h4>
            <p className="text-[11px] text-zinc-400">Default audio channel language</p>
          </div>
          <span className="text-xs text-zinc-300 font-medium">{activeProfile.audioLanguage}</span>
        </div>

        {/* Subtitles Language */}
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">Default Subtitles</h4>
            <p className="text-[11px] text-zinc-400">Captions displayed during playback</p>
          </div>
          <span className="text-xs text-zinc-300 font-medium">{activeProfile.subtitleLanguage}</span>
        </div>
      </div>

      {/* Support & Account Actions */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
        <button
          onClick={() => setActiveTab('downloads')}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-zinc-200 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold">Offline Downloads & Storage Limits</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        <button
          onClick={() => setShowSupportModal(true)}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-zinc-200 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-semibold">Help Center & FAQs</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        <button
          onClick={resetAllData}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-amber-400 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-semibold">Restore Demo Data & Seed Catalog</span>
          </div>
          <span className="text-[10px] text-zinc-500">Reset</span>
        </button>

        <button
          onClick={() => setShowAuthModal(true)}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-rose-400 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-semibold">Sign Out of Vela Account</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {/* Help Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 p-6 rounded-2xl border border-white/10 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white font-['Syne',sans-serif]">Vela Help & Support</h3>
            <div className="space-y-3 text-xs text-zinc-300">
              <div>
                <p className="font-bold text-white">How do I stream in 4K HDR?</p>
                <p className="text-zinc-400">Ensure your Vela Ultra subscription is active and your mobile display supports HDR10.</p>
              </div>
              <div>
                <p className="font-bold text-white">How does Kids Safe Mode work?</p>
                <p className="text-zinc-400">Kids profiles automatically restrict titles rated 16+ and 18+ and require parental PIN to exit.</p>
              </div>
              <div>
                <p className="font-bold text-white">Can I download movies for flights?</p>
                <p className="text-zinc-400">Yes, tap the Download button on any title. Downloads are stored in the My List section.</p>
              </div>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 bg-rose-600 text-white font-bold rounded-lg text-xs"
            >
              Close Help
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
