import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  Subtitles,
  SkipForward,
  Lock,
  Unlock,
  Check,
  FastForward,
  AudioLines
} from 'lucide-react';

export const VideoPlayer: React.FC = () => {
  const { activePlayback, stopPlayback, updateWatchProgress, startPlayback } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<'fit' | 'contain' | 'cover'>('contain');

  // Menus
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  // Selections
  const [selectedAudio, setSelectedAudio] = useState<string>('English (Dolby Atmos)');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('English [CC]');
  const [selectedQuality, setSelectedQuality] = useState<string>('4K Ultra HD');

  const { content, episode, resumeSeconds } = activePlayback || {};

  // Formatter for time display
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Initial resume setup
  useEffect(() => {
    if (videoRef.current && resumeSeconds && resumeSeconds > 0) {
      videoRef.current.currentTime = resumeSeconds;
    }
  }, [resumeSeconds]);

  // Controls auto-hide
  const resetControlsTimer = useCallback(() => {
    if (isLocked) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
        setShowAudioMenu(false);
        setShowSubtitleMenu(false);
        setShowQualityMenu(false);
      }
    }, 3800);
  }, [isPlaying, isLocked]);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [resetControlsTimer]);

  // Time & progress tracker
  const handleTimeUpdate = () => {
    if (!videoRef.current || !content) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 100;
    setCurrentTime(curr);
    setDuration(dur);

    // Save progress periodically
    updateWatchProgress(content.id, episode?.id, curr, dur);
  };

  // Skip 10s back and forward
  const skipTime = (offset: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + offset));
    resetControlsTimer();
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      resetControlsTimer();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const target = Number(e.target.value);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    resetControlsTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
    setSpeed(newSpeed);
    setShowSpeedMenu(false);
  };

  // Determine next episode
  const getNextEpisode = () => {
    if (!content || !content.seasons || !episode) return null;
    const allEpisodes = content.seasons.flatMap((s) => s.episodes);
    const currentIndex = allEpisodes.findIndex((e) => e.id === episode.id);
    if (currentIndex >= 0 && currentIndex < allEpisodes.length - 1) {
      return allEpisodes[currentIndex + 1];
    }
    return null;
  };

  const nextEpisode = getNextEpisode();

  const handleNextEpisode = () => {
    if (content && nextEpisode) {
      startPlayback(content, nextEpisode, 0);
    }
  };

  if (!content) return null;

  const currentMediaUrl = episode?.videoUrl || content.videoUrl;
  const showSkipIntro = currentTime >= 2 && currentTime <= 20;

  return (
    <div
      ref={containerRef}
      onMouseMove={resetControlsTimer}
      onClick={() => {
        if (!showControls && !isLocked) setShowControls(true);
      }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* HTML5 Native Video Stream */}
      <video
        ref={videoRef}
        src={currentMediaUrl}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onEnded={handleNextEpisode}
        className={`w-full h-full ${
          aspectRatio === 'cover' ? 'object-cover' : 'object-contain'
        }`}
      />

      {/* Touch Lock Overlay Indicator */}
      {isLocked && (
        <div className="absolute top-6 left-6 z-40">
          <button
            onClick={() => setIsLocked(false)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-600/90 text-white text-xs font-bold shadow-lg"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Tap to Unlock Screen</span>
          </button>
        </div>
      )}

      {/* Floating "Skip Intro" Button (Active in first 20s) */}
      {!isLocked && showSkipIntro && (
        <button
          onClick={() => skipTime(30)}
          className="absolute bottom-24 right-6 z-30 flex items-center gap-2 px-4 py-2 rounded-lg bg-black/75 hover:bg-black border border-white/25 text-white text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
        >
          <FastForward className="w-4 h-4 text-rose-500" />
          <span>Skip Intro</span>
        </button>
      )}

      {/* Floating Next Episode Prompt near end */}
      {!isLocked && nextEpisode && duration > 0 && currentTime > duration - 25 && (
        <button
          onClick={handleNextEpisode}
          className="absolute bottom-24 right-6 z-30 flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-2xl transition-transform hover:scale-105 active:scale-95"
        >
          <SkipForward className="w-4 h-4 fill-white" />
          <span>Next: {nextEpisode.title}</span>
        </button>
      )}

      {/* Controls Container Overlay */}
      {!isLocked && (
        <div
          className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/20 to-black/80 transition-opacity duration-300 pointer-events-none ${
            showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0'
          }`}
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between">
            {/* Back Button & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={stopPlayback}
                aria-label="Back to catalog"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1">
                  {content.title}
                </h3>
                {episode && (
                  <p className="text-xs text-zinc-300">
                    S{episode.seasonNumber} E{episode.episodeNumber}: {episode.title}
                  </p>
                )}
              </div>
            </div>

            {/* Top Right Controls: Lock, Audio/Subtitles, Speed, Settings */}
            <div className="flex items-center gap-2 relative">
              {/* Screen Lock Button */}
              <button
                onClick={() => {
                  setIsLocked(true);
                  setShowControls(false);
                }}
                title="Lock Controls"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <Lock className="w-4 h-4" />
              </button>

              {/* Audio & Track Selector */}
              <button
                onClick={() => {
                  setShowAudioMenu(!showAudioMenu);
                  setShowSubtitleMenu(false);
                  setShowSpeedMenu(false);
                  setShowQualityMenu(false);
                }}
                title="Audio Tracks"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <AudioLines className="w-4 h-4" />
              </button>

              {/* Subtitles Button */}
              <button
                onClick={() => {
                  setShowSubtitleMenu(!showSubtitleMenu);
                  setShowAudioMenu(false);
                  setShowSpeedMenu(false);
                  setShowQualityMenu(false);
                }}
                title="Subtitles"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Quality & Speed Settings */}
              <button
                onClick={() => {
                  setShowQualityMenu(!showQualityMenu);
                  setShowAudioMenu(false);
                  setShowSubtitleMenu(false);
                  setShowSpeedMenu(false);
                }}
                title="Stream Settings"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Aspect Ratio Toggle */}
              <button
                onClick={() => setAspectRatio(aspectRatio === 'contain' ? 'cover' : 'contain')}
                title="Aspect Ratio (Fit / Zoom)"
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold"
              >
                {aspectRatio === 'contain' ? '16:9' : 'Fill'}
              </button>
            </div>
          </div>

          {/* Audio Tracks Dropdown Menu */}
          {showAudioMenu && (
            <div className="absolute top-16 right-6 z-40 bg-zinc-900 border border-white/15 rounded-xl p-3 shadow-2xl w-56">
              <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Audio Language</h4>
              <div className="space-y-1">
                {(content.audioTracks.length > 0 ? content.audioTracks : ['English (Dolby Atmos)', 'Hindi (5.1)', 'Spanish', 'Japanese']).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedAudio(t);
                      setShowAudioMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-white/10 rounded transition-colors text-left"
                  >
                    <span>{t}</span>
                    {selectedAudio === t && <Check className="w-3.5 h-3.5 text-rose-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subtitles Dropdown Menu */}
          {showSubtitleMenu && (
            <div className="absolute top-16 right-6 z-40 bg-zinc-900 border border-white/15 rounded-xl p-3 shadow-2xl w-52">
              <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Subtitles</h4>
              <div className="space-y-1">
                {['Off', 'English [CC]', 'Spanish', 'Hindi', 'French', 'Japanese'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedSubtitle(sub);
                      setShowSubtitleMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-white/10 rounded transition-colors text-left"
                  >
                    <span>{sub}</span>
                    {selectedSubtitle === sub && <Check className="w-3.5 h-3.5 text-rose-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quality & Speed Settings Menu */}
          {showQualityMenu && (
            <div className="absolute top-16 right-6 z-40 bg-zinc-900 border border-white/15 rounded-xl p-3 shadow-2xl w-60">
              <div className="mb-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Playback Speed</h4>
                <div className="flex gap-1">
                  {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`flex-1 py-1 rounded text-xs font-semibold ${
                        speed === s ? 'bg-rose-600 text-white' : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Stream Quality</h4>
                <div className="space-y-1">
                  {['Auto (Adaptive)', '4K Ultra HD', '1080p Full HD', '720p HD', 'Data Saver'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setSelectedQuality(q);
                        setShowQualityMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-white/10 rounded transition-colors text-left"
                    >
                      <span>{q}</span>
                      {selectedQuality === q && <Check className="w-3.5 h-3.5 text-rose-500" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Center Playback Controls (Play/Pause, Rewind 10, FastForward 10) */}
          <div className="flex items-center justify-center gap-8 sm:gap-14 my-auto">
            <button
              onClick={() => skipTime(-10)}
              title="Rewind 10 seconds"
              className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-white/15"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl shadow-rose-950/80 transition-transform hover:scale-110 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-white" />
              ) : (
                <Play className="w-8 h-8 fill-white ml-1" />
              )}
            </button>

            <button
              onClick={() => skipTime(10)}
              title="Fast Forward 10 seconds"
              className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-white/15"
            >
              <RotateCw className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Seek Slider, Timestamps, Audio Volume, Next Episode, Fullscreen */}
          <div className="space-y-2">
            {/* Custom Interactive Seek Slider */}
            <div className="relative group/seeker">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 hover:h-2.5 bg-zinc-700 accent-rose-600 rounded-lg cursor-pointer transition-all duration-150"
              />
            </div>

            {/* Bottom Row controls */}
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-3">
                {/* Time Display */}
                <span className="font-mono tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Volume Slider */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                        setIsMuted(!isMuted);
                      }
                    }}
                    className="text-zinc-300 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setVolume(val);
                      if (videoRef.current) {
                        videoRef.current.volume = val;
                        videoRef.current.muted = false;
                        setIsMuted(false);
                      }
                    }}
                    className="w-16 h-1 bg-zinc-700 accent-rose-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Next Episode Button */}
                {nextEpisode && (
                  <button
                    onClick={handleNextEpisode}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>Next Ep</span>
                  </button>
                )}

                {/* Fullscreen Toggle */}
                <button
                  onClick={toggleFullscreen}
                  title="Toggle Fullscreen"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
