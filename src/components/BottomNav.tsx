import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Film, Tv, Search, Bookmark, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, myListIds } = useApp();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'movies' as const, label: 'Movies', icon: Film },
    { id: 'series' as const, label: 'Series', icon: Tv },
    { id: 'search' as const, label: 'Search', icon: Search },
    { id: 'mylist' as const, label: 'My List', icon: Bookmark, badge: myListIds.length },
    { id: 'profile' as const, label: 'Profile', icon: User }
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-white/10 px-2 py-1 safe-area-bottom shadow-2xl"
    >
      <div className="grid grid-cols-6 items-center max-w-lg mx-auto h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`min-h-[48px] flex flex-col items-center justify-center relative transition-transform active:scale-95 ${
                isActive ? 'text-rose-500 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'stroke-[2.5px] text-rose-500' : 'stroke-[1.75px]'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[9px] font-bold px-1 min-w-[14px] h-3.5 rounded-full flex items-center justify-center leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-semibold text-rose-500' : 'font-normal'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
