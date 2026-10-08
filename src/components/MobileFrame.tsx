import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, Battery, Smartphone, Monitor } from 'lucide-react';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobileFrame, setIsMobileFrame, activePlayback } = useApp();
  const [currentTimeStr, setCurrentTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      setCurrentTimeStr(`${h % 12 || 12}:${m < 10 ? '0' : ''}${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // When mobile frame is off, render full viewport
  if (!isMobileFrame) {
    return (
      <div className="min-h-screen bg-black text-slate-100 flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-0 md:p-6 lg:p-10 select-none">
      {/* Floating Viewport Switcher for Desktop Testers */}
      <div className="fixed top-4 right-4 z-50 hidden md:flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-zinc-300 shadow-2xl">
        <span className="text-zinc-400">Device Mode:</span>
        <button
          onClick={() => setIsMobileFrame(false)}
          className="flex items-center gap-1 text-white hover:text-rose-400 transition-colors cursor-pointer"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full Browser</span>
        </button>
      </div>

      {/* Realistic Mobile Device Mockup Frame */}
      <div className="relative w-full max-w-[430px] h-screen md:h-[880px] bg-black md:rounded-[48px] shadow-[0_0_60px_rgba(225,29,72,0.15),0_25px_50px_-12px_rgba(0,0,0,0.9)] md:border-[10px] md:border-zinc-800/90 flex flex-col overflow-hidden ring-1 ring-white/10">
        {/* Hardware Notch / Dynamic Island & Status Bar (Hidden during full video playback) */}
        {!activePlayback && (
          <div className="w-full h-11 bg-black/90 backdrop-blur-md px-6 flex items-center justify-between text-white text-[12px] font-semibold shrink-0 select-none z-50 border-b border-white/5">
            {/* Time */}
            <span className="font-medium tracking-tight">{currentTimeStr}</span>

            {/* Dynamic Island Pill */}
            <div className="w-24 h-5 bg-black rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-white/20 mr-2" />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </div>

            {/* Icons: Signal, WiFi, Battery */}
            <div className="flex items-center gap-1.5 text-zinc-300">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M2 17h3v5H2v-5zm5-4h3v9H7v-9zm5-4h3v13h-3V9zm5-4h3v17h-3V5zm5-4h3v21h-3V1z" />
              </svg>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-current" />
            </div>
          </div>
        )}

        {/* Mobile Screen Body */}
        <div className={`flex-1 relative bg-black flex flex-col ${
          activePlayback ? 'overflow-hidden h-full' : 'overflow-y-auto overflow-x-hidden scrollbar-none'
        }`}>
          {children}
        </div>

        {/* Mobile Home Bar Indicator (Hidden during full video playback) */}
        {!activePlayback && (
          <div className="w-full h-5 bg-black shrink-0 flex items-center justify-center pointer-events-none z-50">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
