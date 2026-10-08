import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Smartphone, Monitor, ShieldAlert, Sparkles, User, Settings2, Play } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const {
    activeProfile,
    setShowProfileSwitchModal,
    unreadCount,
    setShowNotificationsModal,
    isMobileFrame,
    setIsMobileFrame,
    setShowAdminDashboard,
    setShowSubscriptionModal,
    playSampleVideo,
    user
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-black/85 backdrop-blur-md border-b border-white/10 px-4 py-2.5 transition-colors">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {/* Original Radiant Prism Logo Mark */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/40 transform group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 22h20L12 2zm0 4.8L18.2 19H5.8L12 6.8z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-widest text-white uppercase font-['Syne',sans-serif] leading-none">
                VELA
              </span>
              <span className="text-[9px] font-semibold text-rose-500 tracking-wider uppercase leading-tight">
                Stream
              </span>
            </div>
          </div>

          {/* Kids Mode indicator badge */}
          {activeProfile.isKids && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
              <ShieldAlert className="w-3 h-3" />
              <span>Kids Safe Mode</span>
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Direct Play Sample Video CTA */}
          <button
            onClick={playSampleVideo}
            title="Play Official 4K Sample Video"
            aria-label="Play 4K Sample Video"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-md shadow-rose-950/60 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Play className="w-3 h-3 fill-white" />
            <span className="text-[11px] sm:text-xs">Sample Video</span>
          </button>

          {/* Viewport Frame Toggle (Mobile Mockup vs Full Browser) */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? 'Expand to Full Viewport' : 'Switch to Mobile Frame'}
            aria-label="Toggle mobile device frame"
            className="hidden md:flex min-w-[40px] min-h-[40px] items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Subscription Tier quick button */}
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:border-amber-400/50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{user.currentTierId.replace('tier-', '')}</span>
          </button>

          {/* Admin Dashboard trigger */}
          {user.isAdmin && (
            <button
              onClick={() => setShowAdminDashboard(true)}
              title="Admin Studio CMS"
              aria-label="Open Admin Studio"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Settings2 className="w-4 h-4 text-rose-400" />
            </button>
          )}

          {/* Notifications Bell */}
          <button
            onClick={() => setShowNotificationsModal(true)}
            aria-label="Notifications"
            className="relative min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-black" />
            )}
          </button>

          {/* Active Profile Avatar */}
          <button
            onClick={() => setShowProfileSwitchModal(true)}
            aria-label={`Switch profile (current: ${activeProfile.name})`}
            className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/30 bg-slate-800">
              {activeProfile.avatarUrl ? (
                <img
                  src={activeProfile.avatarUrl}
                  alt={activeProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 m-1.5 text-slate-300" />
              )}
            </div>
            <span className="hidden lg:inline text-xs font-medium text-slate-200 max-w-[70px] truncate">
              {activeProfile.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
