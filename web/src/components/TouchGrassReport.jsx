import React, { useState } from 'react';
import { Award, Footprints, Clock, Flame, Share2, RotateCcw, CheckCircle, Sparkles, Smartphone } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAudioEngine } from '../context/AudioEngineContext';

export function TouchGrassReport({ totalDistance = 0, screenStats }) {
  const { selectedStory, currentEnding, storyHistory, startAdventure, quitAdventure } = useGame();
  const { speak } = useAudioEngine();
  const [copied, setCopied] = useState(false);

  const { totalWalkSeconds = 0, screenOnSeconds = 0, pocketSeconds = 0, touchGrassScore = 100 } = screenStats || {};

  const minutesWalked = Math.max(1, Math.round(totalWalkSeconds / 60));
  const estimatedSteps = Math.round(totalDistance * 1.3);
  const estimatedCalories = Math.round(totalDistance * 0.045);

  const getScoreBadge = (score) => {
    if (score >= 90) return { title: 'Legendary Grass Toucher', color: 'var(--emerald-400)', desc: 'Pure zero-screen master! Your eyes stayed on the path.' };
    if (score >= 70) return { title: 'Wilderness Ranger', color: 'var(--cyan-500)', desc: 'Excellent pocket discipline during your journey.' };
    if (score >= 50) return { title: 'Trail Wanderer', color: 'var(--amber-400)', desc: 'Good balance of audio navigation and HUD checks.' };
    return { title: 'Screen Peeker', color: 'var(--rose-500)', desc: 'Try keeping your phone deeper in your pocket next time!' };
  };

  const badge = getScoreBadge(touchGrassScore);

  const handleShare = () => {
    const text = `🌿 I touched grass with Zero-Screen Dungeon Master!\n` +
      `📖 Adventure: "${selectedStory?.title}"\n` +
      `🏆 Touch Grass Score: ${touchGrassScore}% (${badge.title})\n` +
      `🚶 Distance: ${Math.round(totalDistance)}m | ⏱️ Duration: ${minutesWalked} mins | 👟 Steps: ${estimatedSteps}\n` +
      `✨ Voice-driven walking RPG powered by open-weight AI (Gemma)!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.25rem', maxWidth: '580px', margin: '0 auto' }}>
      {/* Ending Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem 1.25rem',
          marginBottom: '1.25rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--emerald-500), var(--cyan-500))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
          }}
        >
          <Award size={32} color="#090d16" />
        </div>

        <span style={{ fontSize: '0.75rem', color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
          Expedition Complete
        </span>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.25rem', color: '#ffffff' }}>
          {currentEnding?.title || 'Adventure Concluded'}
        </h2>
      </div>

      {/* TOUCH GRASS SCORE HIGHLIGHT */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          marginBottom: '1.25rem',
          textAlign: 'center',
          border: `2px solid ${badge.color}`,
          boxShadow: `0 0 30px ${badge.color}22`
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          TOUCH GRASS SCORE
        </span>
        <div className="mono" style={{ fontSize: '3.5rem', fontWeight: 900, color: badge.color, lineHeight: 1, margin: '0.35rem 0' }}>
          {touchGrassScore}%
        </div>
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.25rem' }}>
          {badge.title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-300)' }}>
          {badge.desc}
        </p>

        {/* Screen time split bar */}
        <div style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-400)', marginBottom: '0.35rem' }}>
            <span>In-Pocket / Screen-Off: {Math.round(pocketSeconds)}s</span>
            <span>Screen-On: {Math.round(screenOnSeconds)}s</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(239, 68, 68, 0.4)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${touchGrassScore}%`,
                height: '100%',
                background: 'var(--emerald-500)',
                borderRadius: '999px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Walk Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Footprints size={24} color="var(--emerald-400)" />
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>TOTAL DISTANCE</span>
            <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{Math.round(totalDistance)} m</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={24} color="var(--cyan-500)" />
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>WALK TIME</span>
            <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{minutesWalked} min</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={24} color="var(--amber-400)" />
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>ESTIMATED STEPS</span>
            <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{estimatedSteps}</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Flame size={24} color="var(--rose-500)" />
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>ENERGY BURNED</span>
            <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{estimatedCalories} kcal</span>
          </div>
        </div>
      </div>

      {/* Journey Choices Log */}
      {storyHistory.length > 1 && (
        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
            YOUR PATH TAKEN
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {storyHistory.filter((h) => h.type === 'choice').map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--slate-300)' }}>
                <CheckCircle size={14} color="var(--emerald-400)" />
                <span>Leg {i + 1}: Chose <strong>"{h.label}"</strong> ({h.key})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button onClick={handleShare} className="btn-secondary" style={{ width: '100%', fontSize: '1rem' }}>
          <Share2 size={16} /> {copied ? 'Copied Walk Summary to Clipboard!' : 'Share Walk Score'}
        </button>
        <button onClick={quitAdventure} className="btn-primary" style={{ width: '100%', fontSize: '1rem' }}>
          <RotateCcw size={16} /> Walk Another Story
        </button>
      </div>
    </div>
  );
}
