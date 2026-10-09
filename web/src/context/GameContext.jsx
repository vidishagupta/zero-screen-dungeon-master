import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import fantasyStory from '../../../stories/fantasy_ancient_grove.json';
import scifiStory from '../../../stories/scifi_neon_exile.json';
import mysteryStory from '../../../stories/mystery_clocktower.json';
import { useAudioEngine } from './AudioEngineContext';
import { useHaptics } from '../hooks/useHaptics';
import { sfx } from '../utils/soundEffects';

const GameContext = createContext(null);

export const BUNDLED_STORIES = [fantasyStory, scifiStory, mysteryStory];

export function GameProvider({ children, totalDistance = 0, resetDistance }) {
  const { speak, stop: stopAudio, isSpeaking } = useAudioEngine();
  const haptics = useHaptics();

  // Story state
  const [allStories, setAllStories] = useState(BUNDLED_STORIES);
  const [selectedStory, setSelectedStory] = useState(fantasyStory);
  const [gamePhase, setGamePhase] = useState('menu'); // menu | playing | decision | ending | finished
  
  // Progression inside active story
  const [currentNodeId, setCurrentNodeId] = useState(null); // 'intro' | cp_id | end_id
  const [currentCheckpoint, setCurrentCheckpoint] = useState(null);
  const [currentEnding, setCurrentEnding] = useState(null);
  const [storyHistory, setStoryHistory] = useState([]);
  
  // Distance tracking for checkpoints
  const [checkpointStartDistance, setCheckpointStartDistance] = useState(0);
  const [targetDistanceForNextNode, setTargetDistanceForNextNode] = useState(80);
  const [walkMode, setWalkMode] = useState('gps'); // 'gps' | 'simulator'
  const [isPocketMode, setIsPocketMode] = useState(false);

  // Audio unlock banner
  const [hasStartedAudio, setHasStartedAudio] = useState(false);

  // Import custom story JSON
  const importStory = useCallback((storyJson) => {
    try {
      if (!storyJson.id || !storyJson.title || !storyJson.checkpoints) {
        throw new Error('Invalid adventure format. Missing id, title, or checkpoints.');
      }
      setAllStories((prev) => [storyJson, ...prev.filter((s) => s.id !== storyJson.id)]);
      setSelectedStory(storyJson);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Select a story
  const chooseStory = useCallback((story) => {
    setSelectedStory(story);
    setGamePhase('menu');
  }, []);

  // Start the Adventure
  const startAdventure = useCallback(() => {
    if (!selectedStory) return;
    sfx.init();
    if (resetDistance) resetDistance();

    setCheckpointStartDistance(0);
    const firstDistance = selectedStory.checkpointDistanceMeters || 80;
    setTargetDistanceForNextNode(firstDistance);
    setCurrentNodeId('intro');
    setCurrentCheckpoint(null);
    setCurrentEnding(null);
    setStoryHistory([{ type: 'start', text: selectedStory.title, time: Date.now() }]);
    setGamePhase('playing');
    setHasStartedAudio(true);

    // Speak intro narration
    speak(selectedStory.intro.text, {
      priority: true,
      onEnd: () => {
        // After intro, tell user to start walking
        console.log('[Game] Intro narration finished. Waiting for distance target...');
      }
    });
  }, [selectedStory, resetDistance, speak]);

  // Handle reaching a checkpoint node
  const triggerCheckpoint = useCallback(
    (cp) => {
      sfx.playCheckpointReached();
      haptics.checkpointReached();
      setCurrentCheckpoint(cp);
      setGamePhase('decision');

      // Narration: first narrate what happened, then the choice prompt
      const fullText = `${cp.narration} ${cp.prompt}`;
      speak(fullText, {
        priority: true,
        onEnd: () => {
          sfx.playDecisionPrompt();
          haptics.decisionAlert();
        }
      });
    },
    [speak, haptics]
  );

  // Handle reaching an ending
  const triggerEnding = useCallback(
    (ending) => {
      sfx.playVictoryFanfare();
      haptics.endingFanfare();
      setCurrentEnding(ending);
      setGamePhase('ending');

      speak(ending.narration, {
        priority: true,
        onEnd: () => {
          setGamePhase('finished');
        }
      });
    },
    [speak, haptics]
  );

  // Evaluate distance progress
  useEffect(() => {
    if (gamePhase !== 'playing' || !selectedStory) return;

    const segmentWalked = totalDistance - checkpointStartDistance;

    // Check if target reached
    if (segmentWalked >= targetDistanceForNextNode) {
      // Find what comes next
      let nextId = null;
      if (currentNodeId === 'intro') {
        nextId = selectedStory.intro.nextCheckpointId;
      }

      if (!nextId && currentCheckpoint) {
        // Default to first choice if somehow unresolved
        nextId = currentCheckpoint.choices[0].nextCheckpointId;
      }

      if (nextId) {
        // Is it an ending or a checkpoint?
        const foundEnding = selectedStory.endings.find((e) => e.id === nextId);
        if (foundEnding) {
          triggerEnding(foundEnding);
          return;
        }

        const foundCp = selectedStory.checkpoints.find((c) => c.id === nextId);
        if (foundCp) {
          setCurrentNodeId(foundCp.id);
          triggerCheckpoint(foundCp);
        }
      }
    }
  }, [
    totalDistance,
    gamePhase,
    selectedStory,
    currentNodeId,
    currentCheckpoint,
    checkpointStartDistance,
    targetDistanceForNextNode,
    triggerCheckpoint,
    triggerEnding
  ]);

  // Make a Choice (Left or Right)
  const makeChoice = useCallback(
    (choiceKey) => {
      if (gamePhase !== 'decision' || !currentCheckpoint) return;

      const choice = currentCheckpoint.choices.find((c) => c.key === choiceKey);
      if (!choice) return;

      const isLeft = choiceKey === 'left';
      sfx.playChoiceSelected(isLeft);
      haptics.tapFeedback();

      // Log choice history
      setStoryHistory((prev) => [
        ...prev,
        {
          type: 'choice',
          checkpointId: currentCheckpoint.id,
          label: choice.label,
          key: choiceKey,
          distance: totalDistance
        }
      ]);

      const nextTargetId = choice.nextCheckpointId;
      const targetEnding = selectedStory.endings.find((e) => e.id === nextTargetId);

      if (targetEnding) {
        triggerEnding(targetEnding);
        return;
      }

      const targetCp = selectedStory.checkpoints.find((c) => c.id === nextTargetId);
      if (targetCp) {
        // Reset distance anchor for next leg
        setCheckpointStartDistance(totalDistance);
        setTargetDistanceForNextNode(targetCp.distanceMeters || selectedStory.checkpointDistanceMeters || 80);
        setCurrentNodeId(targetCp.id);
        setCurrentCheckpoint(null);
        setGamePhase('playing');

        // Confirm choice via audio
        const confirmNarration = `You chose: ${choice.label}. Keep walking forward.`;
        speak(confirmNarration, { priority: true });
      }
    },
    [gamePhase, currentCheckpoint, totalDistance, selectedStory, triggerEnding, speak, haptics]
  );

  // Reset / Quit back to menu
  const quitAdventure = useCallback(() => {
    stopAudio();
    setGamePhase('menu');
    setCurrentNodeId(null);
    setCurrentCheckpoint(null);
    setCurrentEnding(null);
    setIsPocketMode(false);
  }, [stopAudio]);

  // Calculate progress towards next checkpoint (0 - 100%)
  const segmentWalked = Math.max(0, totalDistance - checkpointStartDistance);
  const checkpointProgress = Math.min(100, Math.round((segmentWalked / targetDistanceForNextNode) * 100));
  const metersRemaining = Math.max(0, Math.round(targetDistanceForNextNode - segmentWalked));

  return (
    <GameContext.Provider
      value={{
        allStories,
        selectedStory,
        chooseStory,
        importStory,
        gamePhase,
        setGamePhase,
        startAdventure,
        quitAdventure,
        makeChoice,
        currentCheckpoint,
        currentEnding,
        storyHistory,
        checkpointProgress,
        metersRemaining,
        targetDistanceForNextNode,
        segmentWalked,
        isPocketMode,
        setIsPocketMode,
        walkMode,
        setWalkMode,
        hasStartedAudio
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
