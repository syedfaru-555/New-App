import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, CheckCheck, Film, Tv, Clock, Sparkles, CreditCard } from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const {
    showNotificationsModal,
    setShowNotificationsModal,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    getContentById,
    setSelectedContent
  } = useApp();

  if (!showNotificationsModal) return null;

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.contentId) {
      const item = getContentById(notif.contentId);
      if (item) {
        setSelectedContent(item);
        setShowNotificationsModal(false);
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'episode':
        return <Tv className="w-4 h-4 text-cyan-400" />;
      case 'continue':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'billing':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'release':
      default:
        return <Sparkles className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-zinc-950 rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-500" />
            <h3 className="text-base font-bold text-white font-['Syne',sans-serif]">
              Activity & Notifications
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Read all</span>
            </button>
            <button
              onClick={() => setShowNotificationsModal(false)}
              className="text-zinc-400 hover:text-white ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto divide-y divide-white/5 py-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No new alerts or releases right now.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  notif.read ? 'opacity-70 hover:opacity-100 hover:bg-white/5' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="mt-0.5 p-2 rounded-lg bg-zinc-900 border border-white/10 shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{notif.title}</h4>
                    <span className="text-[10px] text-zinc-500 shrink-0 font-mono">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-0.5 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-rose-500 self-center shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
