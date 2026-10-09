---
title: "Zero-Screen Dungeon Master: The Voice-Only RPG Where Your Real Walk Drives the Story"
published: false
description: "A pocket-first, offline-ready audio RPG powered by open-weight Gemma AI and GPS distance tracking that gets you outside touching grass."
tags: "devchallenge, hf26challenge, webdev, ai, opensource"
cover_image: "https://raw.githubusercontent.com/vidishagupta/zero-screen-dungeon-master/main/web/public/cover.png"
canonical_url: "https://vidishagupta.github.io/zero-screen-dungeon-master/"
---

*This is a submission for the [DEV Hacktoberfest Open-Source AI Challenge: Week 1 - Touch Grass](https://dev.to/challenges/hacktoberfest-2026).*

---

## 🌿 What I Built

Most fitness apps and location games scream for your visual attention. They give you bright maps, pop-up rewards, and intricate menus that glue your eyes right back to the glass screen while you are supposedly "enjoying nature."

I wanted the exact opposite. I wanted an adventure where **the screen is the shortest, least important part of the experience.**

Meet **Zero-Screen Dungeon Master (ZSDM)**: a voice-narrated, pocket-first audio RPG where your **real-world physical footsteps drive the story forward**.

Here is how a walk works:
1. **Choose an Adventure** (or forge a custom one locally using open-weight Gemma AI).
2. **Put on your headphones, tap Start, and slide your phone into your pocket.**
3. **Walk forward.** As you cover physical ground, GPS distance calculations trigger atmospheric story checkpoints (e.g. every ~80 meters).
4. **Blind Tactical Decisions**: When you reach a fork in the narrative, the narrator describes two paths and your phone vibrates in your pocket. Without pulling the phone out, you tap the **left half** or **right half** of your pocketed screen to make your choice.
5. **Touch Grass Score**: When your walk is finished, the app reveals your expedition metrics—measuring exactly how many minutes your screen was off vs. on, rewarding you with a "Touch Grass Score" (aiming for >90% screen-off time!).

---

## 🚀 Live Demo & Code

- 🌐 **Live Web Application (PWA)**: [https://vidishagupta.github.io/zero-screen-dungeon-master/](https://vidishagupta.github.io/zero-screen-dungeon-master/)
- 💻 **Open-Source GitHub Repository**: [https://github.com/vidishagupta/zero-screen-dungeon-master](https://github.com/vidishagupta/zero-screen-dungeon-master)

<!-- PLACEHOLDER: INSERT SHORT 30-SEC DEMO VIDEO CLIP OR GIF HERE -->
> **[Video Demo / GIF]**: *[Insert screen recording or video walking clip of the app in action here]*

---

## 🛠️ How I Built It

The project is structured into two core open-source components:

```
├── /web      # Mobile-first React + Vite PWA (Offline-ready via Service Worker)
├── /forge    # Local Open-Source AI Generator (Gemma via Ollama + Zod schema validation)
└── /stories  # Gemma-generated interactive branching JSON adventures
```

### 1. Zero-Screen Audio UI & Offline PWA (`/web`)
- **Web Speech API (`speechSynthesis`)**: Delivers offline voice narration with pitch, rate, and device voice controls. Zero cloud latency, zero external speech API bills.
- **Synthesized Web Audio API**: In-app chime and spatial audio feedback synthesized purely with math and oscillators—no heavy audio asset downloads required.
- **Adaptive Geolocation Tracking**: Uses `navigator.geolocation.watchPosition` with Haversine distance accumulation, GPS noise filtering, and speed sanity checks (dropping jitter jumps >6 m/s or accuracy >35m). It works anywhere on Earth with no fixed predefined map coordinates.
- **Pocket Mode & Wake Lock**: Uses the Screen Wake Lock API to prevent mobile browsers from suspending background audio during walks, coupled with an ultra-low-power OLED black pocket overlay.
- **Blind Split-Screen Controls**: Massive 50/50 split-screen touch zones paired with `navigator.vibrate` patterns so players can make decisions blindly by tapping through fabric or inside their pocket.

### 2. Story Forge: Open-Source AI at the Core (`/forge`)
To create endless, non-linear adventures, I built **Story Forge** using **Gemma** (Google's lightweight, high-performance open-weight model) running locally via **Ollama**.

- **Branching Adventure Schema**: We enforce strict Zod schemas ensuring every story forms a valid directed acyclic graph (DAG) with checkpoints, 2 binary choices per node, and 3 distinct climactic endings.
- **Automated Repair Loop**: If local model output has malformed JSON or broken graph references, the forge automatically feeds the specific validation error back into Gemma for zero-intervention self-correction.
- **Offline Bundling**: The deployed PWA comes pre-bundled with 3 Gemma adventures (*The Whispering Canopy*, *Signal in the Rain*, *The Forgotten Campus Bell*) and includes a JSON importer so anyone can load community-forged stories with zero internet connection on remote trails.

```javascript
// Validating local Gemma story structure with Zod
export const StorySchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  theme: z.string(),
  vibe: z.string(),
  checkpointDistanceMeters: z.number().default(80),
  intro: z.object({ text: z.string(), nextCheckpointId: z.string() }),
  checkpoints: z.array(CheckpointSchema).min(3),
  endings: z.array(EndingSchema).min(2)
});
```

---

## 🌲 The Real Outdoor Field Test

<!-- PLACEHOLDER: INSERT YOUR REAL FIELD WALK DETAILS -->
> **Where I Walked**: *[e.g., Local Community Park Trail / University Quadrangle / Neighborhood Greenbelt]*
>
> **Weather & Vibe**: *[e.g., Crisp autumn morning, slight fog, 14°C]*
>
> **What Happened**: *[e.g., I put on my AirPods, selected 'The Whispering Canopy', and tucked my phone into my jacket pocket. Hearing the ancient grove story unfold as I paced through the pine trees was uncanny—the crunch of leaves matched the narration. When the chime signaled a checkpoint, I tapped the left side of my jacket pocket to take the willow tunnel. Finished a 580-meter walk in 9 minutes with a 94% Touch Grass Score!]*
>
> **Photo from the Trail**:
>
> *[Insert photo of your trail with phone screen showing the Touch Grass Score badge]*

---

## 💡 Why Does Open Innovation & Open-Weight AI Matter?

This project highlights why **open-weight, locally runnable AI** is fundamentally transformative:

1. **True Offline Independence on Remote Trails**: When you are hiking in a dense national forest or a canyon with zero cellular reception, closed cloud APIs simply fail. Gemma running locally on a laptop or bundled into static open graph files means the game never cuts out.
2. **Zero Surveillance & Absolute Privacy**: Location data and GPS tracks are among the most sensitive personal data points. Because Zero-Screen Dungeon Master runs local speech synthesis and client-side GPS processing, **not a single byte of location data ever leaves your device**.
3. **No Metered Costs or Token Anxiety**: Story Forge generates rich multi-checkpoint adventures for free on commodity hardware without surprise API bills.
4. **Community Moddability & Fine-Tuning**: Anyone can clone the repository, fork the forge prompts, fine-tune a Gemma model for localized folklore, and share adventure JSONs with the open-source community.

---

## 🏆 Prize Categories

- **Google Gemma**: Story Forge is designed from the ground up to utilize open-weight Gemma models (`gemma2:2b`) running locally via Ollama with structured JSON schema repair.
- **Render Deployment**: Frontend PWA statically deployed and served worldwide via Render's free tier.

---

*Project created and open-sourced during the Hacktoberfest 2026 "Touch Grass" challenge window (October 2026).*
