# 🌿 Zero-Screen Dungeon Master (ZSDM)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest%202026-Touch%20Grass%20Challenge-blueviolet)](https://dev.to/challenges/hacktoberfest-2026)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Google%20Gemma%20(Open--Weight)-blue)](https://ai.google.dev/gemma)
[![Deployment](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-emerald)](https://vidishagupta.github.io/zero-screen-dungeon-master/)
[![Repository](https://img.shields.io/badge/GitHub-zero--screen--dungeon--master-blue)](https://github.com/vidishagupta/zero-screen-dungeon-master)

> **A voice-only walking RPG where your real-world physical steps drive the narrative. Put your headphones on, tuck your phone in your pocket, and touch grass.**

---

## 🧭 Overview

**Zero-Screen Dungeon Master** is an offline-capable, voice-driven audio RPG engineered for the **DEV Hacktoberfest Open-Source AI Challenge: Week 1 ("Touch Grass")**.

Instead of keeping players glued to screens, ZSDM turns the physical outdoors into an interactive audio canvas. The phone stays in your pocket while browser text-to-speech narrates your quest, advancing checkpoints as you walk real-world meters. When decision points arrive, big blind tactile tap zones (Left/Right half of the screen) and haptic vibrations let you choose paths without ever looking at your phone.

---

## ⚡ Core Features

- 🚶 **Dynamic GPS Step Engine**: Real-time `watchPosition` tracking with Haversine distance accumulation and speed/accuracy noise filters. Checkpoints trigger automatically based on distance walked from start (~80m per leg), functioning anywhere on Earth without hardcoded map pins.
- 🎧 **Pocket-First Offline Narration**: Built with the Web Speech API (`speechSynthesis`) and custom Web Audio API chimes for 100% offline audio synthesis.
- 📱 **Blind Pocket Interactions**: Split-screen tactile touch zones and vibration patterns (`navigator.vibrate`) allow hands-free/eyes-free choices through clothing fabric.
- 🔋 **Wake Lock & Pocket Mode**: Integrates `navigator.wakeLock` to prevent mobile OS sleep during walks, with an ultra-dim OLED black screen to preserve battery.
- 📊 **Touch Grass Score Meter**: Tracks screen-on time vs. pocket time, calculating an expedition score and physical stats (distance, pace, steps, calories).
- 🧠 **Story Forge (Open-Source AI)**: Node.js generator and API powered by local open-weight **Gemma** via **Ollama**, featuring Zod schema validation and automated self-repair loops.
- 📦 **Offline Bundled Expeditions**: Ships with 3 pre-generated Gemma adventures (*The Whispering Canopy*, *Signal in the Rain*, *The Forgotten Campus Bell*) plus custom JSON story import.

---

## 📂 Repository Structure

```
├── web/                  # Mobile-first React + Vite PWA (Offline-ready)
│   ├── src/              # Audio engine, GPS hooks, HUD, blind tap controls
│   └── public/           # Manifest, PWA icons, assets
├── forge/                # Local Open-Source AI Generator
│   ├── src/generator.js  # Gemma Ollama integration + retry logic
│   ├── src/schema.js     # Zod adventure schema & graph connectivity validation
│   ├── src/cli.js        # Interactive CLI generator
│   └── src/server.js     # Express API server
├── stories/              # Pre-generated Gemma adventure JSON files
├── DEV_POST.md           # DEV.to competition submission post
├── OUTDOOR_TEST.md       # 30-minute real outdoor test protocol
└── PLAN.md               # Architecture, component roadmap & design tokens
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **(Optional for custom forging)**: [Ollama](https://ollama.com) with Gemma (`ollama run gemma2:2b`)

### 1. Run the Web Application
```bash
cd web
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. (To test on your mobile phone, open the displayed network IP on the same Wi-Fi).

### 2. Run Story Forge with Local Gemma
To forge new adventures locally using Google Gemma:

1. Start your local Ollama instance:
   ```bash
   ollama run gemma2:2b
   ```
2. In a new terminal, launch the Forge CLI:
   ```bash
   cd forge
   npm install
   npm run forge
   ```
3. Follow the interactive prompts (theme, vibe, walk distance) to generate and auto-validate your new story JSON.

---

## 🧪 Testing Indoors

Don't have time to step outside right now?
The app includes a built-in **GPS Test Simulator drawer** at the bottom of the screen. Click **Enable Simulator** to test distance stepping (+20m, +50m, +80m) or activate **Auto-Walking** to experience the full audio flow from your desk!

---

## 🏆 Hacktoberfest 2026 Submission Notice

*This project was started, designed, and developed during the Hacktoberfest 2026 Week 1 Challenge window (October 2026) specifically addressing the "Touch Grass" theme.*

---

## 📄 License

Distributed under the [MIT License](LICENSE).
