import os
import subprocess
import wave
from PIL import Image, ImageDraw, ImageFont

BUILD_DIR = r"c:\Users\Asus\week 1\video_build"
OUTPUT_VIDEO = r"c:\Users\Asus\week 1\zero_screen_dungeon_master_demo.mp4"
TRAIL_IMG_PATH = r"c:\Users\Asus\week 1\web\public\trail_test_score.jpg"
GAMEPLAY_IMG_PATH = r"c:\Users\Asus\week 1\web\public\gameplay_demo.png"

# Colors
BG_COLOR = (9, 13, 22)
SURFACE_COLOR = (15, 23, 42)
CARD_COLOR = (30, 41, 59)
EMERALD = (16, 185, 129)
CYAN = (6, 182, 212)
AMBER = (245, 158, 11)
WHITE = (255, 255, 255)
SLATE_300 = (203, 213, 225)
SLATE_400 = (148, 163, 184)

def get_wav_duration(wav_path):
    with wave.open(wav_path, 'rb') as wf:
        frames = wf.getnframes()
        rate = wf.getframerate()
        return frames / float(rate)

def create_base_canvas():
    img = Image.new("RGB", (1920, 1080), BG_COLOR)
    draw = ImageDraw.Draw(img)
    # Background subtle grid / glow
    for y in range(0, 1080, 80):
        draw.line([(0, y), (1920, y)], fill=(15, 23, 42), width=1)
    for x in range(0, 1920, 80):
        draw.line([(x, 0), (x, 1080)], fill=(15, 23, 42), width=1)
    return img, draw

def get_fonts():
    try:
        title_f = ImageFont.truetype("arialbd.ttf", 64)
        subtitle_f = ImageFont.truetype("arialbd.ttf", 36)
        body_f = ImageFont.truetype("arial.ttf", 28)
        badge_f = ImageFont.truetype("arialbd.ttf", 22)
        code_f = ImageFont.truetype("consola.ttf", 26)
    except:
        title_f = ImageFont.load_default()
        subtitle_f = title_f
        body_f = title_f
        badge_f = title_f
        code_f = title_f
    return title_f, subtitle_f, body_f, badge_f, code_f

def render_slides():
    title_f, subtitle_f, body_f, badge_f, code_f = get_fonts()
    slides = []

    # --- SLIDE 1: Title & Vision ---
    img1, draw1 = create_base_canvas()
    # Top Tag
    draw1.rounded_rectangle([100, 70, 680, 120], radius=25, fill=(16, 185, 129, 40), outline=EMERALD, width=2)
    draw1.text((125, 82), "HACKTOBERFEST 2026: TOUCH GRASS CHALLENGE", font=badge_f, fill=EMERALD)
    
    draw1.text((100, 150), "Zero-Screen Dungeon Master", font=title_f, fill=WHITE)
    draw1.text((100, 235), "The Voice-Only Audio RPG Where Your Real Walk Drives the Story", font=subtitle_f, fill=CYAN)
    
    # Left Card
    draw1.rounded_rectangle([100, 320, 950, 950], radius=20, fill=SURFACE_COLOR, outline=(51, 65, 85), width=2)
    draw1.text((140, 360), "THE PROBLEM WITH LOCATION GAMES", font=subtitle_f, fill=AMBER)
    draw1.text((140, 430), "• Modern apps keep your eyes glued to glass screens.", font=body_f, fill=SLATE_300)
    draw1.text((140, 490), "• Constant menus, notifications, and popups ruin outdoor walks.", font=body_f, fill=SLATE_300)
    draw1.text((140, 550), "• Players end up missing the nature they came to enjoy.", font=body_f, fill=SLATE_300)
    
    draw1.text((140, 640), "THE ZERO-SCREEN SOLUTION", font=subtitle_f, fill=EMERALD)
    draw1.text((140, 710), "✔ Earphones in, phone in pocket: 100% voice-narrated.", font=body_f, fill=SLATE_300)
    draw1.text((140, 770), "✔ Real-world GPS footsteps advance story checkpoints (~80m).", font=body_f, fill=SLATE_300)
    draw1.text((140, 830), "✔ Hands-free 50/50 blind split-screen decisions in your pocket.", font=body_f, fill=SLATE_300)
    draw1.text((140, 890), "✔ Touch Grass Score measures screen-off time (>90% target).", font=body_f, fill=EMERALD)

    # Right Image
    if os.path.exists(TRAIL_IMG_PATH):
        trail = Image.open(TRAIL_IMG_PATH).resize((800, 630))
        img1.paste(trail, (1000, 320))

    s1_path = os.path.join(BUILD_DIR, "slide1.png")
    img1.save(s1_path)
    slides.append(s1_path)

    # --- SLIDE 2: GPS Engine ---
    img2, draw2 = create_base_canvas()
    draw2.rounded_rectangle([100, 70, 520, 120], radius=25, fill=(6, 182, 212, 40), outline=CYAN, width=2)
    draw2.text((125, 82), "CORE MECHANIC: ADAPTIVE GPS", font=badge_f, fill=CYAN)
    draw2.text((100, 150), "Dynamic Step Engine & Haversine Tracking", font=title_f, fill=WHITE)
    draw2.text((100, 235), "Works anywhere on Earth with zero pre-mapped pins or fixed coordinates", font=subtitle_f, fill=EMERALD)

    draw2.rounded_rectangle([100, 320, 880, 950], radius=20, fill=SURFACE_COLOR, outline=(51, 65, 85), width=2)
    draw2.text((140, 360), "HOW DISTANCE UNLOCKS NARRATIVE", font=subtitle_f, fill=CYAN)
    draw2.text((140, 440), "1. watchPosition Continuous GPS Monitoring", font=body_f, fill=WHITE)
    draw2.text((160, 485), "• Filters out GPS noise & jitter (>35m precision rejected)", font=body_f, fill=SLATE_400)
    draw2.text((140, 550), "2. Haversine Distance Accumulation", font=body_f, fill=WHITE)
    draw2.text((160, 595), "• Measures real ground covered from start point in meters", font=body_f, fill=SLATE_400)
    draw2.text((140, 660), "3. Automatic Story Triggers", font=body_f, fill=WHITE)
    draw2.text((160, 705), "• Narration resumes at checkpoints (e.g. 80m, 160m, 240m)", font=body_f, fill=SLATE_400)
    draw2.text((140, 770), "4. Screen Wake Lock & OLED Pocket Dimmer", font=body_f, fill=WHITE)
    draw2.text((160, 815), "• Keeps audio thread alive with zero battery drain", font=body_f, fill=SLATE_400)
    draw2.text((140, 880), "5. Built-in Desktop Simulator for Indoor Testing", font=body_f, fill=EMERALD)

    if os.path.exists(GAMEPLAY_IMG_PATH):
        gp = Image.open(GAMEPLAY_IMG_PATH).resize((860, 630))
        img2.paste(gp, (940, 320))

    s2_path = os.path.join(BUILD_DIR, "slide2.png")
    img2.save(s2_path)
    slides.append(s2_path)

    # --- SLIDE 3: Story Forge (Open-Source AI) ---
    img3, draw3 = create_base_canvas()
    draw3.rounded_rectangle([100, 70, 560, 120], radius=25, fill=(16, 185, 129, 40), outline=EMERALD, width=2)
    draw3.text((125, 82), "OPEN-SOURCE AI: GOOGLE GEMMA", font=badge_f, fill=EMERALD)
    draw3.text((100, 150), "Story Forge: Local Open-Weight Generation", font=title_f, fill=WHITE)
    draw3.text((100, 235), "Endless branching RPG quests generated locally via Ollama with strict Zod validation", font=subtitle_f, fill=CYAN)

    draw3.rounded_rectangle([100, 320, 920, 950], radius=20, fill=SURFACE_COLOR, outline=(51, 65, 85), width=2)
    draw3.text((140, 360), "WHY OPEN-WEIGHT AI MATTERS", font=subtitle_f, fill=EMERALD)
    draw3.text((140, 440), "🌲 True Offline Independence on Remote Trails", font=body_f, fill=WHITE)
    draw3.text((160, 485), "• No cloud dependencies; runs on mountain trails with 0 cell bars", font=body_f, fill=SLATE_400)
    draw3.text((140, 550), "🔒 Zero Surveillance & 100% Location Privacy", font=body_f, fill=WHITE)
    draw3.text((160, 595), "• GPS data stays strictly on-device; never uploaded to servers", font=body_f, fill=SLATE_400)
    draw3.text((140, 660), "💸 Zero API Fees & Infinite Replayability", font=body_f, fill=WHITE)
    draw3.text((160, 705), "• Run gemma2:2b locally on standard laptops for free", font=body_f, fill=SLATE_400)
    draw3.text((140, 770), "🛡️ Self-Correcting Graph & Schema Repair", font=body_f, fill=WHITE)
    draw3.text((160, 815), "• Automated validation retries ensure 100% valid story graphs", font=body_f, fill=SLATE_400)

    # Right side: Architecture card
    draw3.rounded_rectangle([960, 320, 1820, 950], radius=20, fill=CARD_COLOR, outline=EMERALD, width=2)
    draw3.text((1000, 360), "STORY FORGE ARCHITECTURE", font=subtitle_f, fill=CYAN)
    arch_text = [
        "Prompt Engine (Theme, Vibe, Walk Distance, Pace)",
        "                    │",
        "                    ▼",
        "Ollama Local Inference: gemma2:2b (Open-Weight)",
        "                    │",
        "                    ▼",
        "Zod Schema Validator & Graph Connectivity Checker",
        "    ├── Valid: Output adventure JSON -> /stories",
        "    └── Error: Automated Repair Prompt Feedback Loop",
        "",
        "Bundled Expeditions:",
        "• The Whispering Canopy (Fantasy Forest / Park)",
        "• Signal in the Rain (Sci-Fi Cyberpunk / City)",
        "• The Forgotten Campus Bell (Mystery / Campus)"
    ]
    for idx, line in enumerate(arch_text):
        draw3.text((1000, 430 + idx * 36), line, font=code_f, fill=WHITE if "•" in line else SLATE_300)

    s3_path = os.path.join(BUILD_DIR, "slide3.png")
    img3.save(s3_path)
    slides.append(s3_path)

    # --- SLIDE 4: Blind Tactical Decision Controls ---
    img4, draw4 = create_base_canvas()
    draw4.rounded_rectangle([100, 70, 540, 120], radius=25, fill=(245, 158, 11, 40), outline=AMBER, width=2)
    draw4.text((125, 82), "EYES-FREE INTERACTION DESIGN", font=badge_f, fill=AMBER)
    draw4.text((100, 150), "50/50 Blind Split-Screen Tap Zones", font=title_f, fill=WHITE)
    draw4.text((100, 235), "Make branching tactical decisions without taking your phone out of your pocket", font=subtitle_f, fill=EMERALD)

    draw4.rounded_rectangle([100, 320, 920, 950], radius=20, fill=SURFACE_COLOR, outline=(51, 65, 85), width=2)
    draw4.text((140, 360), "HOW BLIND CONTROLS WORK", font=subtitle_f, fill=AMBER)
    draw4.text((140, 440), "🎧 Audio Narration Prompts the Choices", font=body_f, fill=WHITE)
    draw4.text((160, 485), "• 'Tap Left to enter willow tunnel, or Right to climb ridge'", font=body_f, fill=SLATE_400)
    draw4.text((140, 550), "📳 Haptic Vibration Alert in Pocket", font=body_f, fill=WHITE)
    draw4.text((160, 595), "• Distinct pulse pattern alerts player a decision has arrived", font=body_f, fill=SLATE_400)
    draw4.text((140, 660), "📱 Massive Left / Right Screen Touch Targets", font=body_f, fill=WHITE)
    draw4.text((160, 705), "• Tap anywhere on the top/left or bottom/right half of phone", font=body_f, fill=SLATE_400)
    draw4.text((140, 770), "🔔 Web Audio Spatial Tone Feedback", font=body_f, fill=WHITE)
    draw4.text((160, 815), "• Confirms choice with satisfying stereo snap click", font=body_f, fill=SLATE_400)

    # Right side: Decision zone illustration
    draw4.rounded_rectangle([960, 320, 1370, 950], radius=20, fill=(13, 34, 24), outline=EMERALD, width=3)
    draw4.text((1040, 500), "TAP LEFT HALF", font=subtitle_f, fill=EMERALD)
    draw4.text((1000, 580), "Enter Willow Tunnel", font=body_f, fill=WHITE)
    draw4.text((1000, 630), "(Left Ear Tone)", font=code_f, fill=SLATE_400)

    draw4.rounded_rectangle([1410, 320, 1820, 950], radius=20, fill=(39, 27, 11), outline=AMBER, width=3)
    draw4.text((1480, 500), "TAP RIGHT HALF", font=subtitle_f, fill=AMBER)
    draw4.text((1460, 580), "Climb Slate Ridge", font=body_f, fill=WHITE)
    draw4.text((1460, 630), "(Right Ear Tone)", font=code_f, fill=SLATE_400)

    s4_path = os.path.join(BUILD_DIR, "slide4.png")
    img4.save(s4_path)
    slides.append(s4_path)

    # --- SLIDE 5: Touch Grass Score & Metrics ---
    img5, draw5 = create_base_canvas()
    draw5.rounded_rectangle([100, 70, 520, 120], radius=25, fill=(16, 185, 129, 40), outline=EMERALD, width=2)
    draw5.text((125, 82), "TOUCH GRASS SCORE METER", font=badge_f, fill=EMERALD)
    draw5.text((100, 150), "Expedition Summary & Outdoor Scoring", font=title_f, fill=WHITE)
    draw5.text((100, 235), "Rewarding players who spend the maximum time with their screens in their pocket", font=subtitle_f, fill=CYAN)

    # Score Card
    draw5.rounded_rectangle([100, 320, 880, 950], radius=20, fill=SURFACE_COLOR, outline=EMERALD, width=3)
    draw5.text((140, 370), "TOUCH GRASS SCORE", font=subtitle_f, fill=SLATE_400)
    draw5.text((140, 440), "94%", font=ImageFont.truetype("arialbd.ttf", 100), fill=EMERALD)
    draw5.text((140, 560), "★ Legendary Grass Toucher ★", font=subtitle_f, fill=WHITE)
    draw5.text((140, 620), "Pure zero-screen master! Eyes stayed on the path.", font=body_f, fill=SLATE_300)

    draw5.text((140, 710), "EXPEDITION METRICS:", font=subtitle_f, fill=CYAN)
    draw5.text((140, 770), "• Total Distance: 580 meters (~7 Checkpoints)", font=body_f, fill=WHITE)
    draw5.text((140, 820), "• Walk Duration: 9 minutes (8m 30s in pocket)", font=body_f, fill=WHITE)
    draw5.text((140, 870), "• Estimated Steps: 754 | Calories: 26 kcal", font=body_f, fill=WHITE)

    if os.path.exists(TRAIL_IMG_PATH):
        trail = Image.open(TRAIL_IMG_PATH).resize((860, 630))
        img5.paste(trail, (940, 320))

    s5_path = os.path.join(BUILD_DIR, "slide5.png")
    img5.save(s5_path)
    slides.append(s5_path)

    # --- SLIDE 6: Conclusion & Links ---
    img6, draw6 = create_base_canvas()
    draw6.rounded_rectangle([100, 70, 560, 120], radius=25, fill=(6, 182, 212, 40), outline=CYAN, width=2)
    draw6.text((125, 82), "OPEN-SOURCE & PLAYABLE TODAY", font=badge_f, fill=CYAN)
    draw6.text((100, 150), "Zero-Screen Dungeon Master", font=title_f, fill=WHITE)
    draw6.text((100, 235), "Installable Offline PWA • 100% Free & Open-Source (MIT License)", font=subtitle_f, fill=EMERALD)

    draw6.rounded_rectangle([100, 320, 1820, 950], radius=20, fill=SURFACE_COLOR, outline=EMERALD, width=2)
    
    draw6.text((160, 380), "🌐 LIVE PWA WEB APP:", font=subtitle_f, fill=CYAN)
    draw6.text((160, 435), "https://vidishagupta.github.io/zero-screen-dungeon-master/", font=code_f, fill=WHITE)

    draw6.text((160, 520), "💻 OPEN-SOURCE GITHUB REPOSITORY:", font=subtitle_f, fill=CYAN)
    draw6.text((160, 575), "https://github.com/vidishagupta/zero-screen-dungeon-master", font=code_f, fill=WHITE)

    draw6.text((160, 660), "🚀 KEY HIGHLIGHTS:", font=subtitle_f, fill=AMBER)
    draw6.text((160, 720), "✔ 100% Offline-Ready via Workbox Service Worker", font=body_f, fill=SLATE_300)
    draw6.text((160, 770), "✔ Local Open-Weight AI (Google Gemma via Ollama)", font=body_f, fill=SLATE_300)
    draw6.text((160, 820), "✔ Web Speech API + Web Audio Synthesizer (0 external audio files)", font=body_f, fill=SLATE_300)
    draw6.text((160, 870), "✔ Built for Hacktoberfest 2026 'Touch Grass' Challenge", font=body_f, fill=EMERALD)

    s6_path = os.path.join(BUILD_DIR, "slide6.png")
    img6.save(s6_path)
    slides.append(s6_path)

    return slides

def build_full_video(slides):
    ffmpeg_path = r"D:\tools\ffmpeg\ffmpeg.exe"
    segment_files = []

    for i in range(1, 7):
        slide_img = os.path.join(BUILD_DIR, f"slide{i}.png")
        audio_wav = os.path.join(BUILD_DIR, f"scene{i}.wav")
        duration = get_wav_duration(audio_wav) + 0.5  # pad 0.5s for clean audio decay
        seg_mp4 = os.path.join(BUILD_DIR, f"seg{i}.mp4")

        cmd = [
            ffmpeg_path, "-y",
            "-framerate", "25",
            "-loop", "1", "-i", slide_img,
            "-i", audio_wav,
            "-c:v", "libx264", "-preset", "ultrafast",
            "-c:a", "aac", "-b:a", "128k",
            "-pix_fmt", "yuv420p",
            "-t", str(duration),
            seg_mp4
        ]
        print(f"Rendering Segment {i} (duration: {duration:.2f}s)...")
        subprocess.run(cmd, check=True)
        segment_files.append(seg_mp4)

    # Concat file
    concat_list_path = os.path.join(BUILD_DIR, "concat_list.txt")
    with open(concat_list_path, "w") as f:
        for s in segment_files:
            # Escape path for ffmpeg concat
            f.write(f"file '{s.replace(chr(92), '/')}'\n")

    print(f"Stitching full video to {OUTPUT_VIDEO}...")
    concat_cmd = [
        ffmpeg_path, "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list_path,
        "-c", "copy",
        OUTPUT_VIDEO
    ]
    subprocess.run(concat_cmd, check=True)
    print(f"DONE! Video saved at: {OUTPUT_VIDEO}")

if __name__ == "__main__":
    print("Generating slide frames...")
    slides = render_slides()
    print("Building video with ffmpeg...")
    build_full_video(slides)
