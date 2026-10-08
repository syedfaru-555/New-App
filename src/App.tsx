import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { MoviesScreen } from './components/MoviesScreen';
import { SeriesScreen } from './components/SeriesScreen';
import { SearchScreen } from './components/SearchScreen';
import { MyListScreen } from './components/MyListScreen';
import { DownloadsScreen } from './components/DownloadsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ContentDetailsModal } from './components/ContentDetailsModal';
import { VideoPlayer } from './components/VideoPlayer';
import { ProfileSwitchModal } from './components/ProfileSwitchModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PaymentModal } from './components/PaymentModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';

const MainAppContent: React.FC = () => {
  const { activeTab, activePlayback, toastMessage } = useApp();

  // Full-screen video player takes over the mobile viewport
  if (activePlayback) {
    return (
      <MobileFrame>
        <VideoPlayer />
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      {/* Top Mobile App Header */}
      <TopHeader />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'movies' && <MoviesScreen />}
        {activeTab === 'series' && <SeriesScreen />}
        {activeTab === 'search' && <SearchScreen />}
        {activeTab === 'downloads' && <DownloadsScreen />}
        {activeTab === 'mylist' && <MyListScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </main>

      {/* Bottom Thumb Navigation Bar */}
      <BottomNav />

      {/* Modals & Overlays */}
      <ContentDetailsModal />
      <ProfileSwitchModal />
      <SubscriptionModal />
      <PaymentModal />
      <NotificationsModal />
      <AdminDashboard />
      <AuthModal />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-full border border-white/20 shadow-2xl backdrop-blur-md transition-all duration-200 animate-fade-in flex items-center gap-2 max-w-[90vw] truncate">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
