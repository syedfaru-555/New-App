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
  AudioLines,
  Loader2
} from 'lucide-react';

export const VideoPlayer: React.FC = () => {
  const { activePlayback, stopPlayback, updateWatchProgress, startPlayback, setSelectedContent } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<'fit' | 'contain' | 'cover'>('contain');

  // Skip badge animation
  const [skipFeedback, setSkipFeedback] = useState<string | null>(null);

  // Dropdown menus
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  // Active track selections
  const [selectedAudio, setSelectedAudio] = useState<string>('English (Dolby Atmos)');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('English [CC]');
  const [selectedQuality, setSelectedQuality] = useState<string>('4K Ultra HD');

  const { content, episode, resumeSeconds } = activePlayback || {};

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

  // Back button handler: stops playback and returns cleanly to catalog
  const handleBack = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    stopPlayback();
    setSelectedContent(null);
  };

  // Keep controls visible when active or reset auto-hide timer
  const keepControlsAlive = useCallback(() => {
    if (isLocked) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      // Don't auto-hide if paused or if any dropdown is open
      setShowControls(false);
      setShowSpeedMenu(false);
      setShowAudioMenu(false);
      setShowSubtitleMenu(false);
      setShowQualityMenu(false);
    }, 4500);
  }, [isLocked]);

  // Initial playback setup
  useEffect(() => {
    if (!videoRef.current) return;
    const v = videoRef.current;

    if (resumeSeconds && resumeSeconds > 0) {
      v.currentTime = resumeSeconds;
    }

    const tryPlay = async () => {
      try {
        await v.play();
        setIsPlaying(true);
        setIsBuffering(false);
      } catch {
        // If autoplay blocked by browser due to audio, mute and retry
        v.muted = true;
        setIsMuted(true);
        try {
          await v.play();
          setIsPlaying(true);
          setIsBuffering(false);
        } catch {
          setIsPlaying(false);
          setIsBuffering(false);
        }
      }
    };

    tryPlay();
    keepControlsAlive();

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [resumeSeconds, keepControlsAlive]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;
      if (e.key === 'Escape') {
        handleBack();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        skipTime(-10);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        skipTime(10);
      } else if (e.key === 'm') {
        toggleMute();
      } else if (e.key === 'f') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, isPlaying]);

  // Handle Play / Pause toggle
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const v = videoRef.current;

    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          v.muted = true;
          setIsMuted(true);
          v.play().then(() => setIsPlaying(true)).catch(() => {});
        });
    } else {
      v.pause();
      setIsPlaying(false);
    }
    keepControlsAlive();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || !content) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 100;
    setCurrentTime(curr);
    setDuration(dur);
    updateWatchProgress(content.id, episode?.id, curr, dur);
  };

  const skipTime = (offset: number) => {
    if (!videoRef.current) return;
    const target = Math.max(0, Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + offset));
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    setSkipFeedback(offset > 0 ? '+10s' : '-10s');
    setTimeout(() => setSkipFeedback(null), 800);
    keepControlsAlive();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const target = Number(e.target.value);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    keepControlsAlive();
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const next = !videoRef.current.muted;
    videoRef.current.muted = next;
    setIsMuted(next);
    keepControlsAlive();
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
    keepControlsAlive();
  };

  const handleSpeedChange = (newSpeed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
    setSpeed(newSpeed);
    setShowSpeedMenu(false);
    keepControlsAlive();
  };

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
  const showSkipIntro = currentTime >= 2 && currentTime <= 22;

  return (
    <div
      ref={containerRef}
      onMouseMove={keepControlsAlive}
      onTouchStart={keepControlsAlive}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* HTML5 Native Video Stream */}
      <video
        ref={videoRef}
        src={currentMediaUrl}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onEnded={handleNextEpisode}
        className={`w-full h-full cursor-pointer ${
          aspectRatio === 'cover' ? 'object-cover' : 'object-contain'
        }`}
        onClick={() => {
          if (isLocked) return;
          if (showControls) {
            togglePlay();
          } else {
            setShowControls(true);
            keepControlsAlive();
          }
        }}
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="p-4 rounded-2xl bg-black/70 backdrop-blur-md flex flex-col items-center gap-2 border border-white/10">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            <span className="text-xs font-semibold text-zinc-300">Buffering HD Stream...</span>
          </div>
        </div>
      )}

      {/* Skip ±10s Ripple Toast */}
      {skipFeedback && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <span className="text-3xl font-black text-white bg-black/75 px-5 py-2 rounded-2xl border border-white/20 animate-ping">
            {skipFeedback}
          </span>
        </div>
      )}

      {/* Unmute Prompt Pill if muted by browser policy */}
      {isMuted && isPlaying && (
        <button
          onClick={toggleMute}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full bg-rose-600/95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xl animate-bounce"
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Tap for Sound</span>
        </button>
      )}

      {/* Touch Lock Overlay Indicator */}
      {isLocked && (
        <div className="absolute top-6 left-6 z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLocked(false);
              setShowControls(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold shadow-2xl active:scale-95 transition-transform cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            <span>Tap to Unlock Screen</span>
          </button>
        </div>
      )}

      {/* Floating "Skip Intro" Button */}
      {!isLocked && showSkipIntro && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            skipTime(25);
          }}
          className="absolute bottom-24 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/85 hover:bg-black border border-white/30 text-white text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md active:scale-95 transition-all cursor-pointer"
        >
          <FastForward className="w-4 h-4 text-rose-500" />
          <span>Skip Intro</span>
        </button>
      )}

      {/* Floating Next Episode Prompt near end */}
      {!isLocked && nextEpisode && duration > 0 && currentTime > duration - 25 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNextEpisode();
          }}
          className="absolute bottom-24 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-2xl active:scale-95 transition-all cursor-pointer"
        >
          <SkipForward className="w-4 h-4 fill-white" />
          <span>Next: {nextEpisode.title}</span>
        </button>
      )}

      {/* Full Controls Overlay */}
      {!isLocked && (
        <div
          onClick={(e) => {
            // Clicking empty background toggles controls
            if (e.target === e.currentTarget) {
              setShowControls(!showControls);
            }
          }}
          className={`absolute inset-0 z-40 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/30 to-black/85 transition-opacity duration-200 ${
            showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between w-full">
            {/* Back Button & Title */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                aria-label="Back to catalog"
                className="min-w-[44px] min-h-[44px] rounded-full bg-white/15 hover:bg-white/25 active:scale-90 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer border border-white/20 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="max-w-[200px] sm:max-w-md">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  {content.title}
                </h3>
                {episode && (
                  <p className="text-xs text-zinc-300 truncate">
                    S{episode.seasonNumber} E{episode.episodeNumber}: {episode.title}
                  </p>
                )}
              </div>
            </div>

            {/* Top Right Controls */}
            <div className="flex items-center gap-1 sm:gap-2 relative">
              {/* Lock Controls Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLocked(true);
                  setShowControls(false);
                }}
                title="Lock Controls"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4" />
              </button>

              {/* Audio Tracks Selector */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAudioMenu(!showAudioMenu);
                  setShowSubtitleMenu(false);
                  setShowSpeedMenu(false);
                  setShowQualityMenu(false);
                }}
                title="Audio Languages"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <AudioLines className="w-4 h-4" />
              </button>

              {/* Subtitles Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubtitleMenu(!showSubtitleMenu);
                  setShowAudioMenu(false);
                  setShowSpeedMenu(false);
                  setShowQualityMenu(false);
                }}
                title="Subtitles"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Quality & Speed Settings */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQualityMenu(!showQualityMenu);
                  setShowAudioMenu(false);
                  setShowSubtitleMenu(false);
                  setShowSpeedMenu(false);
                }}
                title="Stream Settings"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Aspect Ratio Toggle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAspectRatio(aspectRatio === 'contain' ? 'cover' : 'contain');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
              >
                {aspectRatio === 'contain' ? '16:9' : 'Fill'}
              </button>
            </div>
          </div>

          {/* Menus Dropdowns */}
          {showAudioMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-16 right-6 z-50 bg-zinc-900 border border-white/15 rounded-xl p-3 shadow-2xl w-56"
            >
              <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Audio Language</h4>
              <div className="space-y-1">
                {(content.audioTracks.length > 0 ? content.audioTracks : ['English (Dolby Atmos)', 'Hindi (5.1)', 'Spanish', 'Japanese']).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedAudio(t);
                      setShowAudioMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-white/10 rounded transition-colors text-left cursor-pointer"
                  >
                    <span>{t}</span>
                    {selectedAudio === t && <Check className="w-3.5 h-3.5 text-rose-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showSubtitleMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-16 right-6 z-50 bg-zinc-900 border border-white/15 rounded-xl p-3 shadow-2xl w-52"
            >
              <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Subtitles</h4>
              <div className="space-y-1">
                {['Off', 'English [CC]', 'Spanish', 'Hindi', 'French', 'Japanese'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedSubtitle(sub);
                      setShowSubtitleMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-white/10 rounded transition-colors text-left cursor-pointer"
                  >
                    <span>{sub}</span>
                    {selectedSubtitle === sub && <Check className="w-3.5 h-3.5 text-rose-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showQualityMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-16 right-6 z-50 bg-zinc-900 border border-white/15 rounded-xl p-3 shadow-2xl w-60"
            >
              <div className="mb-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Playback Speed</h4>
                <div className="flex gap-1">
                  {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`flex-1 py-1 rounded text-xs font-semibold cursor-pointer ${
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
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-white/10 rounded transition-colors text-left cursor-pointer"
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
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                skipTime(-10);
              }}
              title="Rewind 10 seconds"
              className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center transition-all border border-white/20 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-90 text-white flex items-center justify-center shadow-2xl shadow-rose-950/80 transition-all cursor-pointer ring-4 ring-rose-600/30"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-white" />
              ) : (
                <Play className="w-8 h-8 fill-white ml-1" />
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                skipTime(10);
              }}
              title="Fast Forward 10 seconds"
              className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center transition-all border border-white/20 cursor-pointer shadow-lg"
            >
              <RotateCw className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Seek Slider, Timestamps, Audio Volume, Next Episode, Fullscreen */}
          <div className="space-y-2 w-full" onClick={(e) => e.stopPropagation()}>
            {/* Interactive Seek Slider */}
            <div className="relative group/seeker">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 hover:h-3 bg-zinc-700 accent-rose-600 rounded-lg cursor-pointer transition-all duration-150"
              />
            </div>

            {/* Bottom Row controls */}
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums font-semibold text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className="hidden sm:flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-zinc-300 hover:text-white cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
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
                {nextEpisode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextEpisode();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>Next Ep</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  title="Toggle Fullscreen"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
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
