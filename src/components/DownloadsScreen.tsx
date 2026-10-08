import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Download,
  Wifi,
  Radio,
  HardDrive,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DownloadQuality } from '../types';

export const DownloadsScreen: React.FC = () => {
  const {
    downloadedItems,
    downloadSettings,
    updateDownloadSettings,
    simulatedNetwork,
    toggleSimulatedNetwork,
    removeDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    deleteWatchedDownloads,
    deleteAllDownloads,
    startPlayback,
    getContentById,
    totalDownloadedMb,
    storageLimitMb,
    availableStorageMb,
    storagePercentUsed,
    setActiveTab,
    cellularDownloadPrompt,
    setCellularDownloadPrompt,
    storageLimitPrompt,
    setStorageLimitPrompt,
    downloadContent
  } = useApp();

  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const activeDownloads = downloadedItems.filter((d) => d.status === 'downloading' || d.status === 'paused');
  const completedDownloads = downloadedItems.filter((d) => d.status === 'completed');

  const totalDownloadedGb = (totalDownloadedMb / 1024).toFixed(1);
  const storageLimitGb = downloadSettings.storageLimitGb.toFixed(1);
  const availableGb = (availableStorageMb / 1024).toFixed(1);

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-5xl mx-auto space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-500 flex items-center justify-center border border-rose-500/30">
              <Download className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Syne',sans-serif]">
              Offline Downloads
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Watch your favorite movies and web series on airplanes or on the go without internet.
          </p>
        </div>

        {/* Network Simulator Badge & Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-900 border border-white/10">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                simulatedNetwork === 'wifi'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {simulatedNetwork === 'wifi' ? <Wifi className="w-3.5 h-3.5" /> : <Radio className="w-3.5 h-3.5" />}
              <span>{simulatedNetwork === 'wifi' ? 'Wi-Fi Active' : 'Cellular 5G'}</span>
            </div>

            <button
              onClick={toggleSimulatedNetwork}
              title="Switch Network Simulation"
              className="text-[11px] font-bold text-zinc-300 hover:text-white px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
            >
              Switch Net
            </button>
          </div>

          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`p-2 rounded-xl border transition-colors ${
              showSettingsDrawer ? 'bg-rose-600 border-rose-500 text-white' : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white'
            }`}
            title="Download & Storage Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Storage Limit Management Meter */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold text-zinc-200 uppercase tracking-wider">
            <HardDrive className="w-4 h-4 text-rose-500" />
            Storage Limit & Usage
          </span>
          <span className="text-zinc-300 font-mono text-[11px]">
            <strong className="text-white">{totalDownloadedGb} GB</strong> used of <strong>{storageLimitGb} GB</strong> limit ({availableGb} GB free)
          </span>
        </div>

        {/* Multi-Segment Storage Bar */}
        <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              storagePercentUsed > 90
                ? 'bg-rose-600'
                : storagePercentUsed > 70
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-rose-600 to-amber-500'
            }`}
            style={{ width: `${Math.max(2, storagePercentUsed)}%` }}
          />
        </div>

        {/* Storage Quick Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
              <span>Vela Downloads ({downloadedItems.length})</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-zinc-600 inline-block" />
              <span>Free Space</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={deleteWatchedDownloads}
              className="text-[11px] font-semibold text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Clean Watched Files
            </button>
            {downloadedItems.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Warning if nearing limit */}
        {storagePercentUsed > 85 && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>You're nearing your storage limit cap. Free up space or increase limit in settings below.</span>
          </div>
        )}
      </div>

      {/* Settings Drawer / Panel */}
      {showSettingsDrawer && (
        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/15 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-rose-500" />
              Download Policy & Storage Controls
            </h4>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Wi-Fi Only Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/5">
              <div>
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  Download Over Wi-Fi Only
                </h5>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Prevents consuming cellular mobile data allowance
                </p>
              </div>
              <button
                onClick={() => updateDownloadSettings({ wifiOnly: !downloadSettings.wifiOnly })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  downloadSettings.wifiOnly ? 'bg-rose-600' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    downloadSettings.wifiOnly ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Smart Downloads Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/5">
              <div>
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Smart Downloads
                </h5>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Auto-deletes watched episodes on Wi-Fi
                </p>
              </div>
              <button
                onClick={() => updateDownloadSettings({ smartDownloads: !downloadSettings.smartDownloads })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  downloadSettings.smartDownloads ? 'bg-rose-600' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    downloadSettings.smartDownloads ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Storage Limit Cap Selector */}
            <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex flex-col justify-between">
              <div>
                <h5 className="text-xs font-bold text-white">Storage Limit Quota</h5>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Maximum storage Vela can use on this device
                </p>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[8, 16, 32, 64].map((gb) => (
                  <button
                    key={gb}
                    onClick={() => updateDownloadSettings({ storageLimitGb: gb })}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      downloadSettings.storageLimitGb === gb
                        ? 'bg-rose-600 text-white'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {gb} GB
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Download Quality Setting */}
          <div className="p-3 rounded-xl bg-zinc-900 border border-white/5">
            <h5 className="text-xs font-bold text-white mb-1">Download Video Quality</h5>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'standard', label: 'Standard (720p)', sub: 'Fastest download (~450 MB/film)' },
                { id: 'high', label: 'High (1080p)', sub: 'Balanced quality (~1.4 GB/film)' },
                { id: 'ultra', label: 'Ultra 4K HDR', sub: 'Cinema master audio (~3.4 GB/film)' }
              ].map((q) => (
                <button
                  key={q.id}
                  onClick={() => updateDownloadSettings({ quality: q.id as DownloadQuality })}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    downloadSettings.quality === q.id
                      ? 'bg-rose-600/20 border-rose-500 text-white'
                      : 'bg-zinc-800/60 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold">{q.label}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{q.sub}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Downloading Queue */}
      {activeDownloads.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
            Active Downloads ({activeDownloads.length})
          </h3>

          <div className="space-y-2.5">
            {activeDownloads.map((item) => {
              const isPaused = item.status === 'paused';
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-zinc-900 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                >
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-12 rounded-lg object-cover bg-zinc-800 shrink-0"
                  />

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.title}</h4>
                      <span className="text-xs font-mono text-rose-400 font-bold">
                        {isPaused ? 'Paused' : `${item.progress}%`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden my-1.5">
                      <div
                        className={`h-full transition-all duration-300 ${isPaused ? 'bg-zinc-600' : 'bg-rose-600'}`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                      <span>{item.quality.toUpperCase()} · {item.fileSizeMb} MB</span>
                      <span>{isPaused ? 'Paused by Wi-Fi Rule' : `${item.downloadSpeedMb || 24.5} MB/s`}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {isPaused ? (
                      <button
                        onClick={() => resumeDownload(item.id)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        title="Resume Download"
                      >
                        <Play className="w-4 h-4 fill-white" />
                      </button>
                    ) : (
                      <button
                        onClick={() => pauseDownload(item.id)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        title="Pause Download"
                      >
                        <Pause className="w-4 h-4 fill-white" />
                      </button>
                    )}

                    <button
                      onClick={() => cancelDownload(item.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-rose-600/20 text-zinc-400 hover:text-rose-400 cursor-pointer"
                      title="Cancel Download"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Offline Downloads List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Downloaded & Ready Offline ({completedDownloads.length})
          </h3>
          <span className="text-xs text-zinc-500 font-mono">
            {totalDownloadedGb} GB
          </span>
        </div>

        {completedDownloads.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-zinc-900/40 border border-white/5">
            <Download className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <h4 className="text-base font-bold text-zinc-200">No Offline Downloads</h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Find movies and TV series you want to watch offline and tap the Download button.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="mt-4 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-950/50"
            >
              Explore Trending Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {completedDownloads.map((item) => {
              const parent = getContentById(item.contentId);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-white/5 hover:border-white/15 transition-colors group"
                >
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-12 rounded-lg object-cover bg-zinc-800 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-rose-400 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5 font-mono">
                      <span>{item.duration}</span>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span>{item.fileSizeMb} MB</span>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span className="text-emerald-400 font-sans font-medium">Ready Offline</span>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span className="uppercase text-zinc-500">{item.quality}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (parent) startPlayback(parent);
                      }}
                      className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-md shadow-rose-950/40"
                      title="Play Offline"
                    >
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </button>

                    <button
                      onClick={() => removeDownload(item.id)}
                      className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Download"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CELLULAR DOWNLOAD APPROVAL MODAL */}
      {cellularDownloadPrompt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 p-6 rounded-2xl border border-white/15 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Radio className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Download on Cellular Data?</h3>
              <p className="text-xs text-zinc-400 mt-1">
                You are currently on Cellular (5G/LTE) and <strong>Wi-Fi Only</strong> is enabled in your settings.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  const { item, episode, quality } = cellularDownloadPrompt;
                  setCellularDownloadPrompt(null);
                  downloadContent(item, episode, quality, true);
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow"
              >
                Download Anyway with Cellular
              </button>
              <button
                onClick={() => {
                  toggleSimulatedNetwork();
                  const { item, episode, quality } = cellularDownloadPrompt;
                  setCellularDownloadPrompt(null);
                  downloadContent(item, episode, quality);
                }}
                className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold rounded-xl text-xs border border-emerald-500/30 cursor-pointer"
              >
                Connect to Wi-Fi & Start
              </button>
              <button
                onClick={() => setCellularDownloadPrompt(null)}
                className="w-full py-2 text-zinc-400 hover:text-white text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STORAGE LIMIT EXCEEDED MODAL */}
      {storageLimitPrompt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 p-6 rounded-2xl border border-white/15 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <HardDrive className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Storage Limit Reached</h3>
              <p className="text-xs text-zinc-400 mt-1">
                "{storageLimitPrompt.itemTitle}" requires <strong>{storageLimitPrompt.neededMb} MB</strong>, which exceeds your {storageLimitGb} GB allocated limit.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  deleteWatchedDownloads();
                  setStorageLimitPrompt(null);
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow"
              >
                Clean Watched Files & Retry
              </button>
              <button
                onClick={() => {
                  updateDownloadSettings({ storageLimitGb: downloadSettings.storageLimitGb * 2 });
                  setStorageLimitPrompt(null);
                }}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs border border-white/15 cursor-pointer"
              >
                Increase Storage Limit to {downloadSettings.storageLimitGb * 2} GB
              </button>
              <button
                onClick={() => setStorageLimitPrompt(null)}
                className="w-full py-2 text-zinc-400 hover:text-white text-xs font-medium cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR ALL CONFIRM MODAL */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 p-6 rounded-2xl border border-white/15 max-w-xs w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete All Downloads?</h3>
            <p className="text-xs text-zinc-400">
              This will remove all {downloadedItems.length} offline titles and free up {totalDownloadedGb} GB of storage space.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteAllDownloads();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
