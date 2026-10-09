import React, { useState } from 'react';
import { AudioEngineProvider, useAudioEngine } from './context/AudioEngineContext';
import { GameProvider, useGame } from './context/GameContext';
import { useGeolocation } from './hooks/useGeolocation';
import { useWakeLock } from './hooks/useWakeLock';
import { useScreenTime } from './hooks/useScreenTime';
import { Header } from './components/Header';
import { StorySelector } from './components/StorySelector';
import { WalkHUD } from './components/WalkHUD';
import { BlindDecisionZone } from './components/BlindDecisionZone';
import { PocketModeOverlay } from './components/PocketModeOverlay';
import { TouchGrassReport } from './components/TouchGrassReport';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { GPSDebugSimulator } from './components/GPSDebugSimulator';

function MainGameContainer({ geo }) {
  const { gamePhase, isPocketMode } = useGame();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Screen time tracking
  const screenStats = useScreenTime({
    isActive: gamePhase === 'playing' || gamePhase === 'decision',
    isPocketMode
  });

  // Wake lock keeps the mobile screen alive during the outdoor walk
  const { isLocked: isWakeLocked } = useWakeLock(gamePhase === 'playing' || gamePhase === 'decision');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '70px' }}>
      <Header
        isWakeLocked={isWakeLocked}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {gamePhase === 'menu' && <StorySelector />}

        {gamePhase === 'playing' && (
          <WalkHUD
            totalDistance={geo.totalDistance}
            gpsStatus={geo.gpsStatus}
            speed={geo.speed}
            accuracy={geo.accuracy}
          />
        )}

        {gamePhase === 'decision' && <BlindDecisionZone />}

        {(gamePhase === 'ending' || gamePhase === 'finished') && (
          <TouchGrassReport
            totalDistance={geo.totalDistance}
            screenStats={screenStats}
          />
        )}
      </main>

      {/* Pocket Mode / Zero-Screen Dim Overlay */}
      <PocketModeOverlay />

      {/* Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* GPS Indoor Simulator Drawer */}
      <GPSDebugSimulator
        isSimulating={geo.isSimulating}
        setIsSimulating={geo.setIsSimulating}
        simulateStep={geo.simulateStep}
        totalDistance={geo.totalDistance}
      />
    </div>
  );
}

export default function App() {
  const geo = useGeolocation({ enabled: true });

  return (
    <AudioEngineProvider>
      <GameProvider
        totalDistance={geo.totalDistance}
        resetDistance={geo.resetDistance}
      >
        <MainGameContainer geo={geo} />
      </GameProvider>
    </AudioEngineProvider>
  );
}
