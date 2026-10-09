Add-Type -AssemblyName System.Speech

$scenes = @(
  @{
    Name = "scene1"
    Text = "Welcome to Zero-Screen Dungeon Master, an open-source audio RPG designed for the Hacktoberfest Touch Grass Challenge. Most fitness apps keep your eyes glued to a screen. We built the exact opposite: an immersive voice adventure where your real-world walking drives the story while your phone stays in your pocket."
  },
  @{
    Name = "scene2"
    Text = "Here is how it works. Plug in your earphones, choose a quest, and hit Start Expedition. Our dynamic GPS engine tracks your steps with Haversine math and noise filtering. Every eighty meters you walk, the app triggers a new narrative checkpoint."
  },
  @{
    Name = "scene3"
    Text = "At the core of the experience is Story Forge, powered by Google's open-weight Gemma model running locally via Ollama. Gemma generates non-linear branching quests with Zod schema validation, creating endless outdoor adventures with zero cloud API fees and complete offline privacy."
  },
  @{
    Name = "scene4"
    Text = "When decision points arrive, you never have to pull your phone out. The screen splits into two massive touch zones. Simply tap the left or right half of your phone through your pocket, guided by haptic vibration cues and 3D spatial audio chimes."
  },
  @{
    Name = "scene5"
    Text = "At the end of your journey, the app calculates your Touch Grass Score, measuring how many minutes you walked without looking at your screen, along with your pace, steps, and calories burned."
  },
  @{
    Name = "scene6"
    Text = "Zero-Screen Dungeon Master is an offline-ready Progressive Web App, completely open-source and ready to play right now. Try the live demo, forge your own quests with Gemma, and go touch some grass today!"
  }
)

$outDir = "c:\Users\Asus\week 1\video_build"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = 0
$synth.Volume = 100

foreach ($s in $scenes) {
  $wavPath = Join-Path $outDir "$($s.Name).wav"
  $synth.SetOutputToWaveFile($wavPath)
  $synth.Speak($s.Text)
  $synth.SetOutputToNull()
  Write-Output "Generated: $wavPath"
}
