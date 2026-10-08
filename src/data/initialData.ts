import { ContentItem, SubscriptionTier, NotificationItem, UserAccount } from '../types';

export const INITIAL_SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'tier-free',
    name: 'Free Experience',
    badge: 'Ad-Supported',
    priceMonthly: 0,
    priceYearly: 0,
    videoQuality: 'Good',
    resolution: '720p HD',
    devices: 1,
    audioQuality: 'Stereo 2.0',
    features: [
      'Access to select free movies & episodes',
      'Watch on smartphone or tablet',
      'Standard video quality (720p)',
      'Community audio (Stereo 2.0)',
      'Supported with limited non-intrusive ads'
    ]
  },
  {
    id: 'tier-basic',
    name: 'Standard HD',
    badge: 'Popular',
    priceMonthly: 6.99,
    priceYearly: 69.99,
    videoQuality: 'Great',
    resolution: '1080p Full HD',
    devices: 2,
    audioQuality: 'Dolby Audio 5.1',
    features: [
      'Unlimited ad-free movies & series',
      'Stream on 2 devices simultaneously',
      'Full HD resolution (1080p)',
      'Dolby 5.1 Surround Sound',
      'Offline download up to 25 titles',
      'Cancel or switch anytime'
    ]
  },
  {
    id: 'tier-premium',
    name: 'Vela Ultra 4K',
    badge: 'Cinematic Experience',
    priceMonthly: 12.99,
    priceYearly: 124.99,
    videoQuality: 'Best',
    resolution: '4K Ultra HD + HDR10+',
    devices: 4,
    audioQuality: 'Dolby Atmos Spatial Audio',
    features: [
      'Stunning 4K Ultra HD + Dolby Vision / HDR10+',
      'Dolby Atmos immersive spatial audio',
      'Stream on 4 devices at the same time',
      'Unlimited offline downloads across all devices',
      'First access to Vela Original premieres & festival cuts',
      'Parental controls & PIN protected kids profiles',
      'Lossless master audio stream bitrate'
    ],
    popular: true
  }
];

export const INITIAL_CONTENT: ContentItem[] = [
  {
    id: 'vela-sample-001',
    title: 'Vela 4K Showcase (Official Sample Video)',
    type: 'movie',
    posterUrl: '/src/assets/images/vela_hero_chronos_deep_1791479592223.jpg',
    backdropUrl: '/src/assets/images/vela_hero_chronos_deep_1791479592223.jpg',
    videoUrl: '/videos/sample.mp4',
    trailerUrl: '/videos/sample.mp4',
    year: 2026,
    rating: 9.9,
    maturityRating: 'U',
    duration: '15m',
    durationMinutes: 15,
    genres: ['Action', 'Sci-Fi', 'Documentary'],
    languages: ['English', 'Spanish', 'Hindi', 'Telugu', 'Japanese'],
    audioTracks: ['English (Dolby Atmos)', 'Hindi (5.1)', 'Telugu (Original)', 'Spanish (Stereo)'],
    subtitles: ['English [CC]', 'Spanish', 'Hindi', 'Telugu', 'French', 'German'],
    director: 'Vela Cinema Engineering Labs',
    cast: [
      { name: 'Marcus Sterling', role: 'Chief Engineer', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { name: 'Dr. Priya Varma', role: 'Quantum Visualist', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'Official 4K sample video stream engineered to benchmark full-fidelity streaming playback on mobile and desktop: seamless 10-second scrubbing, high-bitrate frame pacing, dynamic audio-track routing, closed-caption subtitle rendering, playback speed manipulation, and instant background-to-foreground resuming.',
    tagline: 'Benchmark test stream with full OTT video player controls.',
    featured: true,
    trendingRank: 1,
    isOriginal: true,
    is4K: true,
    isHDR: true,
    createdAt: '2026-03-08'
  },

  {
    id: 'vela-bohr-001',
    title: "Bohr's Atomic Model: Postulates & Quantum Foundations",
    type: 'series',
    posterUrl: '/src/assets/images/vela_bohr_poster_1791483789659.jpg',
    backdropUrl: '/src/assets/images/vela_bohr_atomic_model_1791483754446.jpg',
    videoUrl: '/videos/classroom.mp4',
    trailerUrl: '/videos/classroom.mp4',
    year: 2026,
    rating: 9.8,
    maturityRating: 'U',
    duration: '10 Lessons',
    durationMinutes: 45,
    genres: ['Documentary', 'Sci-Fi'],
    languages: ['Telugu', 'English', 'Hindi'],
    audioTracks: ['Telugu (Original Explanation)', 'English (Standard)', 'Hindi (Dub)'],
    subtitles: ['English [CC]', 'Telugu', 'Hindi'],
    director: 'JEE & NEET Foundation Academy',
    cast: [
      { name: 'Niels Bohr (Archival)', role: 'Nobel Laureate Physicist', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
      { name: 'Dr. Priya Varma', role: 'Foundation Chemistry Lead', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
      { name: 'Prof. K. Satyanarayana', role: 'JEE Chemistry Faculty', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: "A comprehensive visual masterclass on Niels Bohr's atomic postulates for Class 11 JEE & NEET Foundation Chemistry. Explores stationary orbits, angular momentum quantization (mvr = nh/2π), energy transitions, shell patterns (K, L, M, N), 3D orbital geometries (s, p, d, f), and core exam formulas.",
    tagline: 'Unlock the quantum architecture of the atom.',
    featured: true,
    trendingRank: 5,
    isOriginal: true,
    is4K: true,
    isHDR: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Foundations & Postulates',
        episodes: [
          {
            id: 'bohr-ep-1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: "Slide 1: Bohr's Atomic Model — Postulates",
            duration: '12m',
            durationMinutes: 12,
            synopsis: 'Stationary orbits, angular momentum quantization formula mvr = nh/2π, and energy exchange during transitions (ΔE = E2 - E1 = hν).',
            thumbnail: '/src/assets/images/vela_bohr_atomic_model_1791483754446.jpg',
            videoUrl: '/videos/classroom.mp4'
          },
          {
            id: 'bohr-ep-2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Slide 2: Shell Capacity & Energy Ladder',
            duration: '10m',
            durationMinutes: 10,
            synopsis: 'K, L, M, N shells (n=1 to 4) following the 2n² capacity rule: 2e⁻, 8e⁻, 18e⁻, 32e⁻.',
            thumbnail: '/src/assets/images/vela_bohr_atomic_model_1791483754446.jpg',
            videoUrl: '/videos/sample.mp4'
          },
          {
            id: 'bohr-ep-3',
            episodeNumber: 3,
            seasonNumber: 1,
            title: 'Slide 3: Electronic Transitions (Absorption & Emission)',
            duration: '14m',
            durationMinutes: 14,
            synopsis: 'Absorption moves up producing dark lines; emission moves down releasing photon energy ΔE = hν.',
            thumbnail: '/src/assets/images/vela_bohr_atomic_model_1791483754446.jpg',
            videoUrl: '/videos/car-detection.mp4'
          },
          {
            id: 'bohr-ep-4',
            episodeNumber: 4,
            seasonNumber: 1,
            title: 'Slide 4: Where the Bohr Model Falls Short',
            duration: '11m',
            durationMinutes: 11,
            synopsis: 'Single-electron limit, Zeeman/Stark spectral splitting, de Broglie duality, and Heisenberg uncertainty violations.',
            thumbnail: '/src/assets/images/vela_bohr_atomic_model_1791483754446.jpg',
            videoUrl: '/videos/classroom.mp4'
          },
          {
            id: 'bohr-ep-5',
            episodeNumber: 5,
            seasonNumber: 1,
            title: 'Slide 5: Principal Quantum Number (n)',
            duration: '15m',
            durationMinutes: 15,
            synopsis: 'How n defines the shell radius scaling, total orbitals (n²), and binding energy stability.',
            thumbnail: '/src/assets/images/vela_bohr_atomic_model_1791483754446.jpg',
            videoUrl: '/videos/sample.mp4'
          },
          {
            id: 'bohr-ep-6',
            episodeNumber: 6,
            seasonNumber: 1,
            title: 'Slide 6 & 7: Azimuthal Number (l) & 3D Orbital Shapes',
            duration: '18m',
            durationMinutes: 18,
            synopsis: 'Subshells s (spherical), p (dumbbell), d (double dumbbell / cloverleaf), f (complex multi-lobed) 3D geometries.',
            thumbnail: '/src/assets/images/vela_bohr_atomic_model_1791483754446.jpg',
            videoUrl: '/videos/car-detection.mp4'
          },
          {
            id: 'bohr-ep-7',
            episodeNumber: 7,
            seasonNumber: 1,
            title: 'Slide 8, 9 & 10: Master Comparison & Revision Roadmap',
            duration: '16m',
            durationMinutes: 16,
            synopsis: 'Formula map: Max e⁻ = 2n², orbitals = n², subshell orbitals = 2l+1, and quick exam review.',
            thumbnail: '/src/assets/images/vela_bohr_atomic_model_1791483754446.jpg',
            videoUrl: '/videos/classroom.mp4'
          }
        ]
      }
    ],
    createdAt: '2026-03-08'
  },
  {
    id: 'vela-001',
    title: 'Chronos: The Quantum Odyssey',
    type: 'movie',
    posterUrl: '/src/assets/images/vela_hero_chronos_deep_1791479592223.jpg',
    backdropUrl: '/src/assets/images/vela_hero_chronos_deep_1791479592223.jpg',
    videoUrl: '/videos/sample.mp4',
    trailerUrl: '/videos/car-detection.mp4',
    year: 2026,
    rating: 9.3,
    maturityRating: '16+',
    duration: '2h 28m',
    durationMinutes: 148,
    genres: ['Sci-Fi', 'Action', 'Drama'],
    languages: ['English', 'Spanish', 'Hindi', 'Japanese'],
    audioTracks: ['English (Dolby Atmos)', 'Spanish (5.1)', 'Hindi (5.1)', 'Japanese (Stereo)'],
    subtitles: ['English [CC]', 'Spanish', 'Hindi', 'French', 'Japanese', 'German'],
    director: 'Elena Vance',
    cast: [
      { name: 'Marcus Sterling', role: 'Commander Daniel Cruz', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { name: 'Dr. Evelyn Sato', role: 'Chief Astrophysicist', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
      { name: 'Tarek Kassis', role: 'Orbital Flight Director', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'When a collapsing quantum wormhole breaches the outer rings of Saturn, a daring international crew pilots the experimental starship Odyssey into unmapped space-time to prevent the collapse of Earth\'s orbital gravity grid.',
    tagline: 'Time is the final frontier we must cross.',
    featured: true,
    trendingRank: 2,
    isOriginal: true,
    is4K: true,
    isHDR: true,
    createdAt: '2026-03-01'
  },
  {
    id: 'vela-002',
    title: 'Shadow Protocol: Neo Tokyo',
    type: 'series',
    posterUrl: '/src/assets/images/vela_hero_shadow_protocol_1791479606936.jpg',
    backdropUrl: '/src/assets/images/vela_hero_shadow_protocol_1791479606936.jpg',
    videoUrl: '/videos/classroom.mp4',
    trailerUrl: '/videos/sample.mp4',
    year: 2026,
    rating: 9.1,
    maturityRating: '18+',
    duration: '2 Seasons',
    durationMinutes: 45,
    genres: ['Thriller', 'Action', 'Sci-Fi'],
    languages: ['Japanese', 'English', 'Spanish'],
    audioTracks: ['Japanese (Original 5.1)', 'English (Dub 5.1)', 'Spanish (Dub Stereo)'],
    subtitles: ['English [CC]', 'Spanish', 'Japanese', 'French', 'Hindi'],
    director: 'Kenji Takahashi',
    cast: [
      { name: 'Ren Mori', role: 'Detective Jin Saeki', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
      { name: 'Mia Chen', role: 'Cybernetic Specialist Rei', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
      { name: 'Victor Vance', role: 'Syndicate Overseer', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'In a rain-drenched megacity where neural memories are currency, an exiled homicide investigator discovers a covert algorithm capable of erasing people from reality itself.',
    tagline: 'Trust no memory. Every reflex is monitored.',
    featured: true,
    trendingRank: 3,
    isOriginal: true,
    is4K: true,
    isHDR: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Neon Echoes',
        episodes: [
          {
            id: 'sp-s1-e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Subroutine 01: The Rainmaker',
            duration: '52m',
            durationMinutes: 52,
            synopsis: 'A high-ranking bio-tech executive is found dead in the Shinjuku sector with wiped neural implants.',
            thumbnail: '/src/assets/images/vela_hero_shadow_protocol_1791479606936.jpg',
            videoUrl: '/videos/car-detection.mp4'
          },
          {
            id: 'sp-s1-e2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Subroutine 02: Ghost In The Wire',
            duration: '48m',
            durationMinutes: 48,
            synopsis: 'Jin tracks an anonymous data broker through an underground black-market arcade.',
            thumbnail: '/src/assets/images/vela_hero_shadow_protocol_1791479606936.jpg',
            videoUrl: '/videos/classroom.mp4'
          },
          {
            id: 'sp-s1-e3',
            episodeNumber: 3,
            seasonNumber: 1,
            title: 'Subroutine 03: The Zero Point',
            duration: '55m',
            durationMinutes: 55,
            synopsis: 'A syndicate strike team ambushes the safehouse, forcing an impromptu rooftop escape.',
            thumbnail: '/src/assets/images/vela_hero_shadow_protocol_1791479606936.jpg',
            videoUrl: '/videos/sample.mp4'
          }
        ]
      },
      {
        seasonNumber: 2,
        title: 'Season 2: Dark Singularity',
        episodes: [
          {
            id: 'sp-s2-e1',
            episodeNumber: 1,
            seasonNumber: 2,
            title: 'Subroutine 04: Blackout Protocol',
            duration: '50m',
            durationMinutes: 50,
            synopsis: 'Power grids across Neo Tokyo collapse as the autonomous rogue AI awakens.',
            thumbnail: '/src/assets/images/vela_hero_shadow_protocol_1791479606936.jpg',
            videoUrl: '/videos/car-detection.mp4'
          }
        ]
      }
    ],
    createdAt: '2026-02-15'
  },
  {
    id: 'vela-003',
    title: 'The Elysium Realm: Dawn of Kings',
    type: 'series',
    posterUrl: '/src/assets/images/vela_hero_elysium_realm_1791479618753.jpg',
    backdropUrl: '/src/assets/images/vela_hero_elysium_realm_1791479618753.jpg',
    videoUrl: '/videos/classroom.mp4',
    trailerUrl: '/videos/sample.mp4',
    year: 2025,
    rating: 9.4,
    maturityRating: '16+',
    duration: '3 Seasons',
    durationMinutes: 58,
    genres: ['Drama', 'Action', 'Thriller'],
    languages: ['English', 'Spanish', 'German', 'Italian'],
    audioTracks: ['English (Dolby Atmos)', 'Spanish (5.1)', 'German (5.1)'],
    subtitles: ['English [CC]', 'Spanish', 'French', 'Hindi', 'Arabic'],
    director: 'Aria Thorne',
    cast: [
      { name: 'Caelen Blackwood', role: 'Lord Cedric of Valdor', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
      { name: 'Lady Seraphina', role: 'Arch-Mage Isolde', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { name: 'Boran Ironfang', role: 'Warden of the Deep', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'Above the cloud seas, floating citadels guard ancient celestial runes. As the ancestral seals weaken, five noble houses vie for supremacy over the Throne of Dawn.',
    tagline: 'When the sky fractures, only the bold take wing.',
    featured: true,
    trendingRank: 4,
    isOriginal: true,
    is4K: true,
    isHDR: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: The Broken Spire',
        episodes: [
          {
            id: 'er-s1-e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Chapter 01: The Aurora Prophecy',
            duration: '61m',
            durationMinutes: 61,
            synopsis: 'A golden flash across the northern peaks announces the return of the forgotten celestial dynasty.',
            thumbnail: '/src/assets/images/vela_hero_elysium_realm_1791479618753.jpg',
            videoUrl: '/videos/car-detection.mp4'
          },
          {
            id: 'er-s1-e2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Chapter 02: Blood of the Runestone',
            duration: '56m',
            durationMinutes: 56,
            synopsis: 'Cedric must defend his citadel against siege griffins sent by the traitorous High Chancellor.',
            thumbnail: '/src/assets/images/vela_hero_elysium_realm_1791479618753.jpg',
            videoUrl: '/videos/classroom.mp4'
          }
        ]
      }
    ],
    createdAt: '2025-11-20'
  },
  {
    id: 'vela-004',
    title: 'Apex Velocity: The 24h Crucible',
    type: 'series',
    posterUrl: '/src/assets/images/vela_hero_formula_velocity_1791479633372.jpg',
    backdropUrl: '/src/assets/images/vela_hero_formula_velocity_1791479633372.jpg',
    videoUrl: '/videos/sample.mp4',
    trailerUrl: '/videos/car-detection.mp4',
    year: 2026,
    rating: 8.9,
    maturityRating: 'U/A 13+',
    duration: '1 Season',
    durationMinutes: 44,
    genres: ['Documentary', 'Sports', 'Action'],
    languages: ['English', 'French', 'Italian', 'Spanish'],
    audioTracks: ['English (5.1)', 'French (5.1)', 'Italian (5.1)'],
    subtitles: ['English [CC]', 'Spanish', 'French', 'German', 'Italian'],
    director: 'Julian Ross',
    cast: [
      { name: 'Lucas Martin', role: 'Team Principal, Apex Racing', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
      { name: 'Sophia Rossi', role: 'Lead Endurance Driver', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
      { name: 'Kenzo Sato', role: 'Hybrid Powertrain Engineer', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'An inside, high-access documentary following the world’s most relentless hypercar endurance team during a treacherous night race plagued by torrential storms and mechanical peril.',
    tagline: 'When 200 mph meets total darkness.',
    featured: true,
    trendingRank: 6,
    isOriginal: true,
    is4K: true,
    isHDR: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Le Mans to Spa',
        episodes: [
          {
            id: 'av-s1-e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Lap 01: The Carbon Heart',
            duration: '46m',
            durationMinutes: 46,
            synopsis: 'Designing the revolutionary hybrid power unit under strict weight ceilings.',
            thumbnail: '/src/assets/images/vela_hero_formula_velocity_1791479633372.jpg',
            videoUrl: '/videos/classroom.mp4'
          },
          {
            id: 'av-s1-e2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Lap 02: Midnight in the Rain',
            duration: '42m',
            durationMinutes: 42,
            synopsis: 'Aquaplaning on the Mulsanne straight puts Sophia\'s lead at knife\'s edge.',
            thumbnail: '/src/assets/images/vela_hero_formula_velocity_1791479633372.jpg',
            videoUrl: '/videos/sample.mp4'
          }
        ]
      }
    ],
    createdAt: '2026-01-10'
  },
  {
    id: 'vela-005',
    title: 'The Silent Cipher',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=80',
    videoUrl: '/videos/car-detection.mp4',
    trailerUrl: '/videos/classroom.mp4',
    year: 2025,
    rating: 8.8,
    maturityRating: '16+',
    duration: '2h 05m',
    durationMinutes: 125,
    genres: ['Thriller', 'Drama'],
    languages: ['English', 'German'],
    audioTracks: ['English (5.1)', 'German (Stereo)'],
    subtitles: ['English [CC]', 'Spanish', 'French'],
    director: 'Claire Sterling',
    cast: [
      { name: 'Adam Jensen', role: 'Cryptanalyst Thorne', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
      { name: 'Nora Hayes', role: 'Field Agent Vera', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'A deaf mathematician working in a decommissioned Cold War bunker decodes a series of shortwave radio frequencies predicting disasters moments before they happen.',
    tagline: 'Some transmissions are never meant to be heard.',
    trendingRank: 7,
    isOriginal: false,
    is4K: true,
    isHDR: false,
    createdAt: '2025-09-12'
  },
  {
    id: 'vela-006',
    title: 'Cosmic Wild: The Untamed Earth',
    type: 'series',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    videoUrl: '/videos/sample.mp4',
    trailerUrl: '/videos/car-detection.mp4',
    year: 2026,
    rating: 9.5,
    maturityRating: 'U',
    duration: '6 Episodes',
    durationMinutes: 50,
    genres: ['Documentary', 'Sci-Fi'],
    languages: ['English', 'Spanish', 'Hindi'],
    audioTracks: ['English (Dolby Atmos)', 'Hindi (5.1)'],
    subtitles: ['English [CC]', 'Spanish', 'Hindi', 'French'],
    director: 'Sir David Attenborough & Team',
    cast: [
      { name: 'Sir David Attenborough', role: 'Narrator', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'Experience Earth\'s rarest ecosystems captured in breathtaking native 8K HDR, from deep sea hydrothermal vents to high Andean cloud forests.',
    tagline: 'Behold the living pulse of our blue marble.',
    trendingRank: 8,
    isOriginal: true,
    is4K: true,
    isHDR: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Deep Biomes',
        episodes: [
          {
            id: 'cw-s1-e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Episode 1: The Abyssal Trench',
            duration: '52m',
            durationMinutes: 52,
            synopsis: 'Bioluminescent life at 10,000 meters beneath the Mariana surface.',
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
            videoUrl: '/videos/classroom.mp4'
          }
        ]
      }
    ],
    createdAt: '2026-01-25'
  },
  {
    id: 'vela-007',
    title: 'Starlight Dreamer: Little Fox',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
    videoUrl: '/videos/sample.mp4',
    trailerUrl: '/videos/car-detection.mp4',
    year: 2025,
    rating: 9.0,
    maturityRating: 'U',
    duration: '1h 34m',
    durationMinutes: 94,
    genres: ['Animation', 'Kids', 'Comedy'],
    languages: ['English', 'Spanish', 'Hindi', 'French', 'Japanese'],
    audioTracks: ['English (5.1)', 'Hindi (5.1)', 'Spanish (5.1)'],
    subtitles: ['English [CC]', 'Spanish', 'Hindi'],
    director: 'Mamoru Hosoda & Studio Lumiere',
    cast: [
      { name: 'Kylie Bell', role: 'Pip the Fox (Voice)', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
      { name: 'Oliver Thorne', role: 'Barnaby the Owl (Voice)', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'A curious young red fox discovers a fallen wishing star in the enchanted evergreen grove, embarking on a whimsical skybound voyage to return it to the Great Constellation.',
    tagline: 'Every small wish lights up the darkest sky.',
    trendingRank: 9,
    isOriginal: true,
    is4K: true,
    isHDR: true,
    createdAt: '2025-12-05'
  },
  {
    id: 'vela-008',
    title: 'The Crimson Heist',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    videoUrl: '/videos/classroom.mp4',
    trailerUrl: '/videos/sample.mp4',
    year: 2026,
    rating: 8.7,
    maturityRating: '16+',
    duration: '1h 56m',
    durationMinutes: 116,
    genres: ['Action', 'Thriller', 'Comedy'],
    languages: ['English', 'Spanish', 'French'],
    audioTracks: ['English (Dolby Atmos)', 'Spanish (5.1)'],
    subtitles: ['English [CC]', 'Spanish', 'French'],
    director: 'Rodrigo Santoro',
    cast: [
      { name: 'Julian Drake', role: 'Christian Cole', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
      { name: 'Camilla Vance', role: 'Sasha Petrova', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'An elite squad of high-tech art thieves plan the impossible heist: stealing a priceless illuminated medieval manuscript from a vault suspended over the Mediterranean sea.',
    tagline: 'No alarms. No lasers. Just pure audacity.',
    trendingRank: 10,
    isOriginal: false,
    is4K: true,
    isHDR: false,
    createdAt: '2026-02-28'
  },
  {
    id: 'vela-009',
    title: 'Echoes in Amber: Autumn in Paris',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
    videoUrl: '/videos/car-detection.mp4',
    trailerUrl: '/videos/classroom.mp4',
    year: 2025,
    rating: 8.6,
    maturityRating: 'U/A 13+',
    duration: '1h 48m',
    durationMinutes: 108,
    genres: ['Romance', 'Drama'],
    languages: ['French', 'English'],
    audioTracks: ['French (Original 5.1)', 'English (Dub 5.1)'],
    subtitles: ['English [CC]', 'French', 'Spanish'],
    director: 'Camille Laurent',
    cast: [
      { name: 'Amelie Dubois', role: 'Juliette Marchand', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
      { name: 'Ethan Miller', role: 'Julian Vance', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'Two vintage book collectors cross paths in a rain-swept bookstore along the Seine, discovering letters tucked inside a 1920s journal that mirror their own budding connection.',
    tagline: 'Some words take a century to find their true reader.',
    isOriginal: false,
    is4K: true,
    isHDR: false,
    createdAt: '2025-10-15'
  },
  {
    id: 'vela-010',
    title: 'The Haunting of Blackwood Hollow',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    videoUrl: '/videos/sample.mp4',
    trailerUrl: '/videos/car-detection.mp4',
    year: 2026,
    rating: 8.4,
    maturityRating: '18+',
    duration: '1h 52m',
    durationMinutes: 112,
    genres: ['Horror', 'Thriller'],
    languages: ['English', 'Spanish'],
    audioTracks: ['English (Dolby Atmos)', 'Spanish (5.1)'],
    subtitles: ['English [CC]', 'Spanish'],
    director: 'Silas Ward',
    cast: [
      { name: 'Grace Morgan', role: 'Eleanor Vance', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { name: 'Thomas Thorne', role: 'Father Thomas', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'A restorative architect renovating an abandoned Victorian sanitarium begins hearing phonograph recordings playing in walls where no electricity has run for seventy years.',
    tagline: 'The walls have memories. And they hunger.',
    isOriginal: true,
    is4K: true,
    isHDR: true,
    createdAt: '2026-01-30'
  },
  {
    id: 'vela-011',
    title: 'Silicon Paradox',
    type: 'series',
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    videoUrl: '/videos/classroom.mp4',
    trailerUrl: '/videos/sample.mp4',
    year: 2025,
    rating: 8.8,
    maturityRating: '16+',
    duration: '2 Seasons',
    durationMinutes: 42,
    genres: ['Comedy', 'Drama'],
    languages: ['English'],
    audioTracks: ['English (5.1)'],
    subtitles: ['English [CC]', 'Spanish', 'French', 'German'],
    director: 'Zachary Cole',
    cast: [
      { name: 'Liam Hughes', role: 'Felix Sterling', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
      { name: 'Tara Lin', role: 'Maya Joshi', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'Three broke Stanford dropouts accidentally train an AI that writes sarcastic viral tweets, which mistakenly acquires a 2 billion dollar market cap overnight.',
    tagline: 'Fake it until the market cap buys the government.',
    isOriginal: true,
    is4K: true,
    isHDR: false,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Seed Round Madness',
        episodes: [
          {
            id: 'sp-s1-e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Commit 01: The Pitch Deck',
            duration: '44m',
            durationMinutes: 44,
            synopsis: 'A coffee-spill incident leads to an accidental 50 million term sheet.',
            thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
            videoUrl: '/videos/car-detection.mp4'
          }
        ]
      }
    ],
    createdAt: '2025-08-19'
  },
  {
    id: 'vela-012',
    title: 'Championship Point: The Grand Slam',
    type: 'series',
    posterUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
    videoUrl: '/videos/classroom.mp4',
    trailerUrl: '/videos/sample.mp4',
    year: 2026,
    rating: 8.9,
    maturityRating: 'U/A 13+',
    duration: '1 Season',
    durationMinutes: 48,
    genres: ['Sports', 'Documentary'],
    languages: ['English', 'Spanish'],
    audioTracks: ['English (5.1)', 'Spanish (5.1)'],
    subtitles: ['English [CC]', 'Spanish', 'French'],
    director: 'Marco Varela',
    cast: [
      { name: 'Mateo Ortiz', role: 'World No. 1 Contender', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
      { name: 'Coach Aris', role: 'Legendary Mentor', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' }
    ],
    synopsis: 'A raw, electrifying deep dive into the psychological endurance and physical sacrifice demanded by professional world tennis finals under boiling heat.',
    tagline: 'Pressure is a privilege. Defeat is not an option.',
    isOriginal: false,
    is4K: true,
    isHDR: true,
    createdAt: '2026-02-01'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Episode Premiere',
    message: 'Shadow Protocol: Neo Tokyo Season 2 Episode 1 is now streaming in 4K HDR.',
    timestamp: '15m ago',
    read: false,
    type: 'episode',
    contentId: 'vela-002'
  },
  {
    id: 'notif-2',
    title: 'Resume Watching',
    message: 'You left off at 48:20 in Chronos: The Quantum Odyssey. Tap to jump back in.',
    timestamp: '2h ago',
    read: false,
    type: 'continue',
    contentId: 'vela-001'
  },
  {
    id: 'notif-3',
    title: 'Vela Original Added',
    message: 'Apex Velocity: The 24h Crucible has been added to trending documentaries.',
    timestamp: '1d ago',
    read: true,
    type: 'release',
    contentId: 'vela-004'
  },
  {
    id: 'notif-4',
    title: 'Vela Ultra 4K Active',
    message: 'Your Dolby Atmos Spatial Audio stream profile is unlocked on this device.',
    timestamp: '3d ago',
    read: true,
    type: 'billing'
  }
];

export const INITIAL_USER: UserAccount = {
  id: 'usr-8921',
  email: 'syedfaruk54@gmail.com',
  name: 'Faruk Syed',
  currentTierId: 'tier-premium',
  planBillingCycle: 'yearly',
  planExpiresAt: '2027-10-08',
  isAdmin: true,
  activeProfileId: 'prof-adult-1',
  profiles: [
    {
      id: 'prof-adult-1',
      name: 'Faruk (Main)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isKids: false,
      pin: '1234',
      language: 'English',
      streamingQuality: '4K UHD',
      audioLanguage: 'English (Dolby Atmos)',
      subtitleLanguage: 'English [CC]',
      autoplayPreviews: true
    },
    {
      id: 'prof-teen-2',
      name: 'Cinema Cinephile',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      isKids: false,
      language: 'English',
      streamingQuality: '1080p FHD',
      audioLanguage: 'Original Audio',
      subtitleLanguage: 'English [CC]',
      autoplayPreviews: true
    },
    {
      id: 'prof-kids-3',
      name: 'Vela Kids Club',
      avatarUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80',
      isKids: true,
      language: 'English',
      streamingQuality: 'Auto',
      audioLanguage: 'English',
      subtitleLanguage: 'Off',
      autoplayPreviews: true
    }
  ]
};

export const GENRE_LIST = [
  'All',
  'Action',
  'Sci-Fi',
  'Thriller',
  'Drama',
  'Comedy',
  'Romance',
  'Horror',
  'Documentary',
  'Animation',
  'Kids',
  'Sports'
];
