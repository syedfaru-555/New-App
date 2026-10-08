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
  X,
  Loader2
} from 'lucide-react';

export const VideoPlayer: React.FC = () => {
  const { activePlayback, stopPlayback, updateWatchProgress, startPlayback, setSelectedContent } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<'fit' | 'contain' | 'cover'>('contain');

  // Skip feedback ripple
  const [skipFeedback, setSkipFeedback] = useState<string | null>(null);

  // Modal sheets for Audio/Subtitles and Settings
  const [showAudioSubtitlesModal, setShowAudioSubtitlesModal] = useState(false);
  const [audioSubModalTab, setAudioSubModalTab] = useState<'audio' | 'subtitles'>('subtitles');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Selections
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

  // Back button: exits video player and returns to catalog
  const handleBack = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    stopPlayback();
    setSelectedContent(null);
  };

  // Keep controls visible when interacting
  const keepControlsAlive = useCallback(() => {
    if (isLocked) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      // Don't auto-hide controls if paused or if modal is open
      if (!showAudioSubtitlesModal && !showSettingsModal) {
        setShowControls(false);
      }
    }, 4500);
  }, [isLocked, showAudioSubtitlesModal, showSettingsModal]);

  // Initial playback attempt on mount
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (resumeSeconds && resumeSeconds > 0) {
      v.currentTime = resumeSeconds;
    }

    const tryAutoPlay = async () => {
      try {
        v.muted = false;
        await v.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch {
        // Fallback to muted playback if browser autoplay policy blocks unmuted audio
        v.muted = true;
        setIsMuted(true);
        try {
          await v.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      }
    };

    tryAutoPlay();
    keepControlsAlive();

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [resumeSeconds, keepControlsAlive]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;
      if (showAudioSubtitlesModal || showSettingsModal) {
        if (e.key === 'Escape') {
          setShowAudioSubtitlesModal(false);
          setShowSettingsModal(false);
        }
        return;
      }
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
  }, [isLocked, showAudioSubtitlesModal, showSettingsModal]);

  // Play / Pause toggle
  const togglePlay = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;

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
    const v = videoRef.current;
    if (!v || !content) return;
    const curr = v.currentTime;
    const dur = v.duration || 100;
    setCurrentTime(curr);
    setDuration(dur);
    updateWatchProgress(content.id, episode?.id, curr, dur);
  };

  const skipTime = (offset: number) => {
    const v = videoRef.current;
    if (!v) return;
    const target = Math.max(0, Math.min(v.duration || 0, v.currentTime + offset));
    v.currentTime = target;
    setCurrentTime(target);
    setSkipFeedback(offset > 0 ? '+10s' : '-10s');
    setTimeout(() => setSkipFeedback(null), 800);
    keepControlsAlive();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const target = Number(e.target.value);
    v.currentTime = target;
    setCurrentTime(target);
    keepControlsAlive();
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
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
    const v = videoRef.current;
    if (v) {
      v.playbackRate = newSpeed;
    }
    setSpeed(newSpeed);
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
      className="relative w-full h-full min-h-[500px] bg-black flex items-center justify-center select-none overflow-hidden"
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

      {/* Buffering Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="p-3.5 rounded-2xl bg-black/75 backdrop-blur-md flex flex-col items-center gap-2 border border-white/10">
            <Loader2 className="w-7 h-7 text-rose-500 animate-spin" />
            <span className="text-[11px] font-semibold text-zinc-300">Buffering...</span>
          </div>
        </div>
      )}

      {/* Skip ±10s Ripple Feedback */}
      {skipFeedback && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <span className="text-2xl sm:text-3xl font-black text-white bg-black/80 px-4 py-2 rounded-2xl border border-white/20 animate-ping">
            {skipFeedback}
          </span>
        </div>
      )}

      {/* Unmute Prompt Pill */}
      {isMuted && isPlaying && (
        <button
          onClick={toggleMute}
          className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xl animate-bounce cursor-pointer"
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Tap for Sound</span>
        </button>
      )}

      {/* Touch Lock Indicator */}
      {isLocked && (
        <div className="absolute top-5 left-5 z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLocked(false);
              setShowControls(true);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-2xl active:scale-95 transition-transform cursor-pointer"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Tap to Unlock</span>
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
          className="absolute bottom-20 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/85 hover:bg-black border border-white/30 text-white text-xs font-bold shadow-2xl backdrop-blur-md active:scale-95 transition-all cursor-pointer"
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
          className="absolute bottom-20 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-2xl active:scale-95 transition-all cursor-pointer"
        >
          <SkipForward className="w-4 h-4 fill-white" />
          <span>Next: {nextEpisode.title}</span>
        </button>
      )}

      {/* Controls Overlay */}
      {!isLocked && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowControls(!showControls);
            }
          }}
          className={`absolute inset-0 z-30 flex flex-col justify-between p-3.5 sm:p-5 bg-gradient-to-t from-black/95 via-black/35 to-black/85 transition-opacity duration-200 ${
            showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between w-full pt-1">
            {/* Back Button & Title */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <button
                type="button"
                onClick={handleBack}
                aria-label="Back to catalog"
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer border border-white/25 shadow-xl shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-white stroke-[2.5]" />
              </button>
              <div className="min-w-0 pr-2">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                  {content.title}
                </h3>
                {episode && (
                  <p className="text-[11px] text-zinc-300 truncate">
                    S{episode.seasonNumber} E{episode.episodeNumber}: {episode.title}
                  </p>
                )}
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Lock Controls Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLocked(true);
                  setShowControls(false);
                }}
                title="Lock Controls"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4" />
              </button>

              {/* Audio & Subtitles Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAudioSubtitlesModal(true);
                  setAudioSubModalTab('subtitles');
                }}
                title="Audio and Subtitles"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Stream Settings Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettingsModal(true);
                }}
                title="Playback Settings"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-colors cursor-pointer"
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
                className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold cursor-pointer"
              >
                {aspectRatio === 'contain' ? '16:9' : 'Fill'}
              </button>
            </div>
          </div>

          {/* Center Playback Controls */}
          <div className="flex items-center justify-center gap-7 sm:gap-12 my-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                skipTime(-10);
              }}
              title="Rewind 10 seconds"
              className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center transition-all border border-white/20 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-90 text-white flex items-center justify-center shadow-2xl shadow-rose-950/90 transition-all cursor-pointer ring-4 ring-rose-600/30"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-white" />
              ) : (
                <Play className="w-7 h-7 fill-white ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                skipTime(10);
              }}
              title="Fast Forward 10 seconds"
              className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center transition-all border border-white/20 cursor-pointer shadow-lg"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Bar Controls */}
          <div className="space-y-1.5 w-full pb-1" onClick={(e) => e.stopPropagation()}>
            {/* Seek Bar */}
            <div className="relative group/seeker">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 hover:h-2 bg-zinc-700 accent-rose-600 rounded-lg cursor-pointer transition-all duration-150"
              />
            </div>

            {/* Bottom Row controls */}
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-2.5">
                <span className="font-mono tabular-nums font-semibold text-white text-[11px]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className="hidden sm:flex items-center gap-1.5">
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
                    className="w-14 h-1 bg-zinc-700 accent-rose-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {nextEpisode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextEpisode();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <SkipForward className="w-3 h-3" />
                    <span>Next Ep</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  title="Toggle Fullscreen"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIO & SUBTITLES MODAL SHEET */}
      {showAudioSubtitlesModal && (
        <div
          onClick={() => setShowAudioSubtitlesModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-zinc-950 rounded-t-3xl sm:rounded-2xl border border-white/15 p-5 shadow-2xl space-y-4 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Subtitles className="w-4 h-4 text-rose-500" />
                <span>Audio & Subtitles</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAudioSubtitlesModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Tab Switcher */}
            <div className="flex p-1 bg-zinc-900 rounded-xl border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAudioSubModalTab('subtitles')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  audioSubModalTab === 'subtitles' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Subtitles ({selectedSubtitle})
              </button>
              <button
                type="button"
                onClick={() => setAudioSubModalTab('audio')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  audioSubModalTab === 'audio' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Audio Tracks
              </button>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto space-y-1.5 flex-1 max-h-56 pr-1">
              {audioSubModalTab === 'subtitles' ? (
                <>
                  {['Off', 'English [CC]', 'Spanish', 'Hindi', 'French', 'Japanese', 'German'].map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => {
                        setSelectedSubtitle(sub);
                        setShowAudioSubtitlesModal(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        selectedSubtitle === sub
                          ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                          : 'bg-zinc-900/60 text-zinc-300 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span>{sub}</span>
                      {selectedSubtitle === sub && <Check className="w-4 h-4 text-rose-500" />}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {(content.audioTracks.length > 0 ? content.audioTracks : ['English (Dolby Atmos)', 'Hindi (5.1)', 'Spanish', 'Japanese']).map((aud) => (
                    <button
                      key={aud}
                      type="button"
                      onClick={() => {
                        setSelectedAudio(aud);
                        setShowAudioSubtitlesModal(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        selectedAudio === aud
                          ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                          : 'bg-zinc-900/60 text-zinc-300 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span>{aud}</span>
                      {selectedAudio === aud && <Check className="w-4 h-4 text-rose-500" />}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Close / Apply button */}
            <button
              type="button"
              onClick={() => setShowAudioSubtitlesModal(false)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS (SPEED & QUALITY) MODAL SHEET */}
      {showSettingsModal && (
        <div
          onClick={() => setShowSettingsModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-zinc-950 rounded-t-3xl sm:rounded-2xl border border-white/15 p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-rose-500" />
                <span>Stream & Playback Settings</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Selector */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Playback Speed
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSpeedChange(s)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      speed === s ? 'bg-rose-600 text-white shadow' : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Selector */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Video Stream Quality
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'Auto (Adaptive)', label: 'Auto (Adaptive)', sub: 'Balances data & resolution' },
                  { id: '4K Ultra HD', label: '4K Ultra HD (HDR10+)', sub: 'Cinema master bitrate' },
                  { id: '1080p Full HD', label: '1080p Full HD', sub: 'High definition streaming' },
                  { id: '720p HD', label: '720p Standard HD', sub: 'Faster buffering' },
                  { id: 'Data Saver', label: 'Data Saver (Mobile)', sub: 'Saves cellular allowance' }
                ].map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setSelectedQuality(q.id);
                      setShowSettingsModal(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      selectedQuality === q.id
                        ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                        : 'bg-zinc-900/60 text-zinc-300 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{q.label}</p>
                      <p className="text-[10px] text-zinc-500">{q.sub}</p>
                    </div>
                    {selectedQuality === q.id && <Check className="w-4 h-4 text-rose-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
