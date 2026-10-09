import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AudioEngineContext = createContext(null);

export function AudioEngineProvider({ children }) {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const currentUtteranceRef = useRef(null);

  // Load available speech synthesis voices
  const populateVoices = useCallback(() => {
    if (!synthRef.current) return;
    const available = synthRef.current.getVoices();
    if (available && available.length > 0) {
      setVoices(available);

      // Prefer natural/enhanced English voices if available
      if (!selectedVoiceURI) {
        const preferred = available.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Daniel') ||
              v.name.includes('Samantha') ||
              v.name.includes('Karen') ||
              v.name.includes('Arthur'))
        ) || available.find((v) => v.lang.startsWith('en')) || available[0];

        if (preferred) {
          setSelectedVoiceURI(preferred.voiceURI);
        }
      }
    }
  }, [selectedVoiceURI]);

  useEffect(() => {
    if (!synthRef.current) return;
    populateVoices();
    if (typeof synthRef.current.onvoiceschanged !== 'undefined') {
      synthRef.current.onvoiceschanged = populateVoices;
    }
  }, [populateVoices]);

  // Unlock audio context on user touch
  const unlockAudio = useCallback(() => {
    setAudioUnlocked(true);
    if (synthRef.current && synthRef.current.paused) {
      synthRef.current.resume();
    }
  }, []);

  // Speak text narration
  const speak = useCallback(
    (text, { onEnd, onBoundary, priority = false } = {}) => {
      if (!synthRef.current || !text) return;

      if (priority) {
        synthRef.current.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = pitch;

      if (selectedVoiceURI && voices.length > 0) {
        const match = voices.find((v) => v.voiceURI === selectedVoiceURI);
        if (match) utterance.voice = match;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setCurrentSubtitle(text);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setIsSpeaking(false);
        setIsPaused(false);
        if (onEnd) onEnd();
      };

      if (onBoundary) {
        utterance.onboundary = onBoundary;
      }

      currentUtteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    },
    [speechRate, pitch, selectedVoiceURI, voices]
  );

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSubtitle('');
    }
  }, []);

  const pause = useCallback(() => {
    if (synthRef.current && isSpeaking && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  return (
    <AudioEngineContext.Provider
      value={{
        voices,
        selectedVoiceURI,
        setSelectedVoiceURI,
        speechRate,
        setSpeechRate,
        pitch,
        setPitch,
        isSpeaking,
        isPaused,
        currentSubtitle,
        audioUnlocked,
        unlockAudio,
        speak,
        stop,
        pause,
        resume
      }}
    >
      {children}
    </AudioEngineContext.Provider>
  );
}

export function useAudioEngine() {
  const ctx = useContext(AudioEngineContext);
  if (!ctx) throw new Error('useAudioEngine must be used within an AudioEngineProvider');
  return ctx;
}
