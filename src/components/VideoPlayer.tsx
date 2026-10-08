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
  Loader2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Film,
  Sparkles
} from 'lucide-react';

const BOHR_SLIDES = [
  {
    slideNumber: 1,
    title: "Bohr's Atomic Model — Postulates",
    subtitle: "Class 11 · JEE & NEET Foundation Chemistry",
    bulletPoints: [
      "Stationary Orbits: Electrons occupy permitted, discrete circular paths and do not radiate energy in stable orbits.",
      "Angular Momentum Quantization: mvr = nh / (2π)",
      "Energy Exchange During Transitions: ΔE = E₂ - E₁ = hν"
    ],
    formula: "mvr = nh / 2π · ΔE = E₂ - E₁ = hν",
    tag: "Core Postulates"
  },
  {
    slideNumber: 2,
    title: "Energy Levels Follow the Shell Pattern",
    subtitle: "Shell Capacity (2n²) & Energy Ladder",
    bulletPoints: [
      "n = 1: K Shell → Max 2 e⁻ (Closest to nucleus, lowest energy, highest stability)",
      "n = 2: L Shell → Max 8 e⁻ (First excited shell grouping)",
      "n = 3: M Shell → Max 18 e⁻ (Holds s, p, d subshells)",
      "n = 4: N Shell → Max 32 e⁻ (Holds s, p, d, f subshells)"
    ],
    formula: "Max Capacity = 2n² electrons",
    tag: "Shell Pattern"
  },
  {
    slideNumber: 3,
    title: "Electronic Transitions: Absorption & Emission",
    subtitle: "Absorption Moves Up; Emission Moves Down",
    bulletPoints: [
      "Absorption Transition: Lower state (E₁) → Higher state (E₂). Electron absorbs photon (hν), producing dark absorption spectral lines.",
      "Emission Transition: Higher state (E₂) → Lower state (E₁). Unstable excited electron drops down, releasing energy as radiation (hν), producing bright emission spectral lines.",
      "Transition Energy Formula: ΔE = E₂ - E₁ = hν = hc / λ"
    ],
    formula: "ΔE = E₂ - E₁ = hν = hc / λ",
    tag: "Transitions"
  },
  {
    slideNumber: 4,
    title: "Where the Bohr Model Falls Short",
    subtitle: "Critical Limitations & Quantum Breakpoints",
    bulletPoints: [
      "1. Hydrogen-Like Only: Valid strictly for single-electron species (H, He⁺, Li²⁺). Fails for multi-electron atoms due to e⁻-e⁻ repulsion.",
      "2. Multi-Electron Spectra: Cannot explain fine structure splitting of spectral lines under high-resolution spectrometers.",
      "3. Zeeman & Stark Effects: Fails to explain spectral line splitting in external magnetic (Zeeman) or electric (Stark) fields.",
      "4. Ignores de Broglie Duality: Treats electron as classical localized particle, ignoring matter-wave properties.",
      "5. Violates Heisenberg Uncertainty: Specifying fixed circular orbits with exact r and v directly contradicts Δx·Δp ≥ h / (4π).",
      "6. No 3D Chemical Bonding: Flat 2D coplanar rings cannot account for directional covalent bonds or 3D molecular geometry."
    ],
    formula: "Zeeman Effect (B-field) · Stark Effect (E-field)",
    tag: "Limitations"
  },
  {
    slideNumber: 5,
    title: "Principal Quantum Number (n) Defines the Shell",
    subtitle: "Effective Orbital Size & Average Electron Distance",
    bulletPoints: [
      "n = 1 (K Shell): Max 2 e⁻, radius scaling r₁ = 0.529 Å",
      "n = 2 (L Shell): Max 8 e⁻, radius scaling r₂ = 4 × 0.529 Å",
      "n = 3 (M Shell): Max 18 e⁻, expanding orbital volume",
      "n = 4 (N Shell): Max 32 e⁻, outermost principal shell",
      "Key Rules: Total orbitals in shell = n² | Total electrons = 2n²"
    ],
    formula: "r_n = 0.529 × (n² / Z) Å · Orbitals = n²",
    tag: "Quantum Number n"
  },
  {
    slideNumber: 6,
    title: "Azimuthal Quantum Number (l) Defines Subshell",
    subtitle: "Geometric Shape of Electron Cloud",
    bulletPoints: [
      "Permissible range: l = 0, 1, 2, ..., (n - 1)",
      "l = 0: s Subshell (Sharp, Spherical) → 1 orbital, max 2 e⁻",
      "l = 1: p Subshell (Principal, Dumbbell) → 3 orbitals, max 6 e⁻",
      "l = 2: d Subshell (Diffuse, Double Dumbbell) → 5 orbitals, max 10 e⁻",
      "l = 3: f Subshell (Fundamental, Complex) → 7 orbitals, max 14 e⁻"
    ],
    formula: "l ∈ [0, n-1] · Orbitals in subshell = 2l + 1",
    tag: "Quantum Number l"
  },
  {
    slideNumber: 7,
    title: "3D Probability Geometry: Orbital Shapes",
    subtitle: "s, p, d, and f Orbital Geometry",
    bulletPoints: [
      "s Orbital (l = 0): Spherical, non-directional cloud centered on nucleus.",
      "p Orbitals (l = 1): Three directional lobes (px, py, pz) separated by a nodal plane.",
      "d Orbitals (l = 2): Five double-dumbbell / cloverleaf orbitals (dxy, dyz, dxz, dx²-y², dz²).",
      "f Orbitals (l = 3): Seven multi-lobed complex 3D structures with 3 nodal planes."
    ],
    formula: "3D Boundary Surface where P(e⁻) ≥ 90%",
    tag: "3D Geometry"
  },
  {
    slideNumber: 8,
    title: "Core Exam Formulas: The Formula Map to Remember",
    subtitle: "High-yield formulas tested in JEE Main, NEET & Class 11",
    bulletPoints: [
      "01. Max Electrons in Shell: N = 2n²",
      "02. Subshell Quantum Range: l = 0, 1, ..., (n - 1)",
      "03. Orbitals in Subshell: N_orb = 2l + 1",
      "04. Max Electrons in Subshell: N_e = 2(2l + 1)",
      "05. Bohr Frequency Rule: ΔE = E₂ - E₁ = hν",
      "06. Quantized Angular Momentum: mvr = nh / (2π)"
    ],
    formula: "mvr = nh/2π · ΔE = hν · N = 2n² · N_orb = 2l+1",
    tag: "Formula Map"
  },
  {
    slideNumber: 9,
    title: "Shells Expand into Subshells: Master Comparison",
    subtitle: "Detailed structural breakdown from Shell down to Orbitals",
    bulletPoints: [
      "n = 1 (K): l=0 → 1s (1 orbital) → 2 e⁻",
      "n = 2 (L): l=0, 1 → 2s, 2p (1+3=4 orbitals) → 8 e⁻",
      "n = 3 (M): l=0, 1, 2 → 3s, 3p, 3d (1+3+5=9 orbitals) → 18 e⁻",
      "n = 4 (N): l=0, 1, 2, 3 → 4s, 4p, 4d, 4f (1+3+5+7=16 orbitals) → 32 e⁻",
      "Key Rule: Number of subshells in any shell = n"
    ],
    formula: "Subshells in shell n = n · Total capacity = 2n²",
    tag: "Comparison"
  },
  {
    slideNumber: 10,
    title: "Quick Revision Roadmap: From Shell to Orbital",
    subtitle: "Complete synthesis from macroscopic models down to 3D wave mechanics",
    bulletPoints: [
      "Step 01 Foundation: Bohr Model (mvr = nh/2π, discrete stationary orbits, transitions via ΔE = hν)",
      "Step 02 Shell Level: Principal 'n' (identifies K, L, M, N; sets distance and 2n² capacity)",
      "Step 03 Subshell Level: Azimuthal 'l' (s, p, d, f subshells and orbital count 2l+1)",
      "Step 04 3D Orbital: Spatial Geometry (spherical s, dumbbell p, cloverleaf d, complex f, 2 e⁻ per orbital)"
    ],
    formula: "Bohr Model → Shell (n) → Subshell (l) → 3D Orbital",
    tag: "Revision Roadmap"
  }
];

export const VideoPlayer: React.FC = () => {
  const { activePlayback, stopPlayback, updateWatchProgress, startPlayback, setSelectedContent, showToast } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const initialMediaUrl = activePlayback?.episode?.videoUrl || activePlayback?.content?.videoUrl;
  const [mediaSrc, setMediaSrc] = useState<string>(() => {
    if (!initialMediaUrl || initialMediaUrl.includes('commondatastorage.googleapis.com')) {
      return '/videos/sample.mp4';
    }
    return initialMediaUrl;
  });

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

  // Keep mediaSrc in sync when content/episode changes
  useEffect(() => {
    const nextUrl = episode?.videoUrl || content?.videoUrl;
    if (!nextUrl || nextUrl.includes('commondatastorage.googleapis.com')) {
      setMediaSrc('/videos/sample.mp4');
    } else {
      setMediaSrc(nextUrl);
    }
  }, [episode, content]);

  const switchMediaSource = (newUrl: string, label?: string) => {
    setMediaSrc(newUrl);
    setIsBuffering(false);
    const v = videoRef.current;
    if (v) {
      v.src = newUrl;
      v.load();
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          v.muted = true;
          setIsMuted(true);
          v.play().catch(() => {});
        });
    }
    if (label) showToast(`Playing ${label}`);
  };

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
        src={mediaSrc}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
        onLoadedData={() => setIsBuffering(false)}
        onError={() => {
          setIsBuffering(false);
          if (mediaSrc !== '/videos/sample.mp4') {
            switchMediaSource('/videos/sample.mp4', 'Sample Video');
          }
        }}
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
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Quick Sample Switcher Pill */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettingsModal(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white text-[11px] font-bold border border-rose-400/40 shadow-lg active:scale-95 transition-all cursor-pointer"
                title="Switch Sample Stream"
              >
                <Film className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Sample Videos</span>
              </button>

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

            {/* Sample Video Streams Selector */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>Sample Video Streams</span>
              </label>
              <div className="space-y-1.5">
                {[
                  { url: '/videos/sample.mp4', label: 'Sample 1: 4K Ultra HD Showcase', sub: 'High-fidelity test stream' },
                  { url: '/videos/classroom.mp4', label: 'Sample 2: Academy Lecture', sub: 'Classroom & presentation footage' },
                  { url: '/videos/car-detection.mp4', label: 'Sample 3: Velocity & Motion', sub: 'Dynamic movement & vehicle track' }
                ].map((s) => (
                  <button
                    key={s.url}
                    type="button"
                    onClick={() => {
                      switchMediaSource(s.url, s.label);
                      setShowSettingsModal(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      mediaSrc === s.url
                        ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40'
                        : 'bg-zinc-900/60 text-zinc-300 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{s.label}</p>
                      <p className="text-[10px] text-zinc-400">{s.sub}</p>
                    </div>
                    {mediaSrc === s.url && <Check className="w-4 h-4 text-rose-500 shrink-0" />}
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
