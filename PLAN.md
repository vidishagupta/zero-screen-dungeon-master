# PLAN: Zero-Screen Dungeon Master (Hacktoberfest 2026 "Touch Grass" Entry)

## 1. Vision & Architecture Overview
**Zero-Screen Dungeon Master (ZSDM)** is an offline-capable, voice-driven audio RPG where player real-world movement advances the interactive narrative. The phone is designed to stay in the pocket with headphones on.

### Key Architectural Pillars:
1. **Pocket-First Audio UI (/web)**: React + Vite + Vanilla CSS PWA. Full offline support (Service Worker via Workbox/Vite-PWA), Web Speech API (`speechSynthesis`) for local TTS, Wake Lock API to prevent sleep, Geolocation API (`watchPosition` + Haversine distance tracking + speed/accuracy noise filter), and huge split-screen blind tap zones (Left/Right) + device motion (shake) for hands-free/eyes-free choices.
2. **Screen-Time & Touch Grass Metrics**: Tracks display active time vs total walking time. Outputs a "Touch Grass Score" (0–100%) and walk statistics (distance, pace, calories estimate).
3. **Story Forge (/forge)**: Node.js CLI & lightweight Express API integrating local open-weight LLMs via Ollama (e.g., `gemma:2b` or `gemma2:2b`). Generates branching story structures with JSON schema validation (Zod) and automated repair/retry logic.
4. **Offline Bundled Adventures (/stories)**: Ships with 3 rich, pre-generated Gemma adventures (Fantasy, Sci-Fi Cyberpunk, Campus/Park Urban Mystery) + Custom JSON Importer.

---

## 2. Directory Structure & File Tree
```
week 1/
├── PLAN.md                          # Project implementation roadmap & architecture
├── README.md                        # Project documentation, quickstart, demo & open-source AI details
├── DEV_POST.md                      # Complete DEV.to competition post (with placeholders)
├── OUTDOOR_TEST.md                  # 30-minute real outdoor test protocol
├── LICENSE                          # MIT License
├── .gitignore                       # Git ignore rules for node_modules, dist, temp files
├── stories/                         # Pre-generated Gemma adventures
│   ├── fantasy_ancient_grove.json   # The Whispering Canopy (Fantasy/Forest vibe)
│   ├── scifi_neon_exile.json        # Signal in the Rain (Sci-Fi/Urban vibe)
│   └── mystery_clocktower.json      # The Forgotten Campus Bell (Mystery/Park vibe)
├── forge/                           # Local Open-Source AI Generator
│   ├── package.json
│   ├── src/
│   │   ├── schema.js                # Zod schema for adventure graphs
│   │   ├── prompts.js               # Gemma prompt templates & system instructions
│   │   ├── generator.js             # Ollama API client + retry logic
│   │   ├── cli.js                   # Interactive CLI generator tool
│   │   └── server.js                # Local API endpoint for forge generation
│   └── stories/                     # Output destination for forged stories
└── web/                             # React + Vite PWA (Offline-ready)
    ├── package.json
    ├── vite.config.js               # Vite config with PWA plugin
    ├── index.html
    ├── public/
    │   ├── favicon.svg
    │   ├── icon-192.png
    │   ├── icon-512.png
    │   └── manifest.json
    └── src/
        ├── index.css                # Ultra-clean, dark tactical HUD theme
        ├── main.jsx
        ├── App.jsx
        ├── context/
        │   ├── StoryContext.jsx     # Active adventure state, node progression
        │   └── AudioContext.jsx     # SpeechSynthesis engine & queue management
        ├── hooks/
        │   ├── useGeolocation.js    # GPS tracking, noise filtering, distance accumulator
        │   ├── useWakeLock.js       # Screen Wake Lock controller
        │   ├── useHaptics.js        # Vibration API patterns
        │   └── useScreenTime.js     # Screen-on vs walk-time tracker
        ├── components/
        │   ├── StorySelector.jsx    # Pick bundled story or import custom JSON
        │   ├── WalkHUD.jsx          # Live distance, checkpoints, screen timer
        │   ├── BlindDecisionZone.jsx# Giant half-screen tap zones + haptic cues
        │   ├── AudioSettings.jsx    # Voice picker, rate, pitch controls
        │   ├── TouchGrassReport.jsx # End-of-walk stats & Touch Grass Score
        │   └── GPSDebugSimulator.jsx# In-app distance stepper for indoor testing
        └── utils/
            ├── haversine.js         # Distance & filter math
            └── soundEffects.js      # Web Audio synthesized sound cues (chimes, alerts)
```

---

## 3. Adventure JSON Schema
```json
{
  "id": "fantasy_ancient_grove",
  "title": "The Whispering Canopy",
  "theme": "fantasy",
  "vibe": "park/trail",
  "checkpointDistanceMeters": 80,
  "intro": {
    "text": "...",
    "nextCheckpointId": "cp_1"
  },
  "checkpoints": [
    {
      "id": "cp_1",
      "distanceMeters": 80,
      "narration": "...",
      "prompt": "Two paths lie ahead.",
      "choices": [
        { "key": "left", "label": "Take overgrown creek path", "nextCheckpointId": "cp_2a" },
        { "key": "right", "label": "Climb rocky ridge", "nextCheckpointId": "cp_2b" }
      ]
    }
  ],
  "endings": [
    { "id": "end_victory", "title": "Dawn Ascendant", "narration": "..." }
  ]
}
```

---

## 4. Risks & Mitigations
| Risk | Potential Impact | Mitigation |
| :--- | :--- | :--- |
| **GPS Noise / Drift indoors** | False checkpoints triggering without walking | Distance smoothing filter + minimum accuracy threshold (< 25m) + in-app simulator switch for testing |
| **Mobile OS killing background Web Speech** | Narration cuts out when screen dims | Screen Wake Lock API + high-contrast dim pocket mode option + explicit audio unlock button on touch |
| **SpeechSynthesis voice latency/offline** | Fallback to default system voice | Use local built-in voices only; queue voice events safely with audio resume handling |
| **LLM Output formatting errors** | Invalid JSON breaking runtime | Zod schema validation in `/forge`, markdown codeblock stripping, and multi-round automated repair prompts |
| **Offline trail operation** | No network available | Vite PWA caching all assets, stories bundled as static JSON, zero external runtime CDN dependencies |

---

## 5. Execution Plan
1. Check local environment (node, git, gh, ollama).
2. Initialize git repository with initial commit.
3. Build `/stories` with 3 high-quality Gemma adventure scripts.
4. Build `/forge` tool (generator, schema, prompts, CLI).
5. Build `/web` React PWA with full GPS, Web Speech, Touch Grass Meter, blind tap controls, and simulation controls.
6. Verify and test the application end-to-end with the browser subagent.
7. Craft `DEV_POST.md` and `OUTDOOR_TEST.md`.
8. Request user confirmation for GitHub repository creation and deployment.
