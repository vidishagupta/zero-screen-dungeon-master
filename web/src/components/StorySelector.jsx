import React, { useState, useRef } from 'react';
import { Play, Compass, Upload, Sparkles, Footprints, Shield, Cpu, Clock, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';

export function StorySelector() {
  const { allStories, selectedStory, chooseStory, startAdventure, importStory } = useGame();
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        const res = importStory(json);
        if (res.success) {
          setImportStatus({ type: 'success', msg: `Imported "${json.title}" successfully!` });
        } else {
          setImportStatus({ type: 'error', msg: res.error });
        }
      } catch (err) {
        setImportStatus({ type: 'error', msg: 'Invalid JSON file format.' });
      }
    };
    reader.readAsText(file);
  };

  const getThemeIcon = (theme) => {
    switch (theme) {
      case 'sci-fi':
        return <Cpu size={18} color="var(--cyan-500)" />;
      case 'mystery':
        return <Clock size={18} color="var(--amber-500)" />;
      default:
        return <Sparkles size={18} color="var(--emerald-500)" />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.25rem', maxWidth: '640px', margin: '0 auto' }}>
      {/* Hero Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--emerald-400)',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            letterSpacing: '0.05em'
          }}
        >
          <Compass size={14} />
          HACKTOBERFEST 2026: TOUCH GRASS
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Your Steps Forge the Story
        </h2>
        <p style={{ color: 'var(--slate-300)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1rem' }}>
          Put your headphones on, tuck your phone in your pocket, and start walking.
          Checkpoints unlock automatically as you cover real-world ground.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--slate-400)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Footprints size={14} color="var(--emerald-400)" /> GPS Auto-Advance
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={14} color="var(--cyan-500)" /> 100% Offline PWA
          </span>
        </div>
      </div>

      {/* Story List Section */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Choose Your Expedition</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: 'transparent',
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '5px 10px',
            color: 'var(--slate-300)',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer'
          }}
        >
          <Upload size={13} /> Import JSON
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json,application/json"
          style={{ display: 'none' }}
        />
      </div>

      {importStatus && (
        <div
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            background: importStatus.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${importStatus.type === 'success' ? 'var(--emerald-500)' : 'var(--rose-500)'}`,
            color: importStatus.type === 'success' ? 'var(--emerald-400)' : 'var(--rose-500)'
          }}
        >
          {importStatus.msg}
        </div>
      )}

      {/* Stories Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
        {allStories.map((story) => {
          const isSelected = selectedStory?.id === story.id;
          return (
            <div
              key={story.id}
              onClick={() => chooseStory(story)}
              className="glass-card"
              style={{
                padding: '1.15rem',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--emerald-500)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(30, 41, 59, 0.5)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getThemeIcon(story.theme)}
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slate-400)', fontWeight: 700 }}>
                    {story.theme} • {story.vibe}
                  </span>
                </div>
                {isSelected && (
                  <span style={{
                    background: 'var(--emerald-500)',
                    color: '#090d16',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={13} strokeWidth={3} />
                  </span>
                )}
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.35rem', color: '#ffffff' }}>
                {story.title}
              </h4>
              <p style={{ color: 'var(--slate-300)', fontSize: '0.85rem', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                {story.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--slate-400)' }}>
                <span>🎯 ~{story.estimatedWalkMeters || 560}m walk (~{story.checkpoints?.length || 6} checkpoints)</span>
                <span style={{ fontStyle: 'italic', color: 'var(--emerald-400)' }}>Open-Weight Gemma AI</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Start Adventure Action Bar */}
      <div style={{ position: 'sticky', bottom: '1.25rem', zIndex: 30 }}>
        <button
          onClick={startAdventure}
          className="btn-primary"
          style={{ width: '100%', fontSize: '1.15rem', padding: '1.15rem' }}
        >
          <Play size={20} fill="#ffffff" />
          START EXPEDITION ({selectedStory?.title || 'Selected'})
        </button>
      </div>
    </div>
  );
}
