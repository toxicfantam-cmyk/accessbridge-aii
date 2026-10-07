import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import tts from '../services/ttsService';

const AccessibilityContext = createContext(null);

const DEFAULT_PREFERENCES = {
  contrast: 'standard', // 'standard' | 'high-contrast-dark' | 'high-contrast-light' | 'soft-warm'
  textSize: 'medium', // 'small' | 'medium' | 'large' | 'xlarge'
  fontFamily: 'system', // 'system' | 'dyslexic' | 'sans' | 'serif'
  lineSpacing: 'normal', // 'normal' | 'relaxed' | 'loose'
  cognitiveSupport: 'simplified', // 'standard' | 'simplified' | 'maximum'
  preferredLanguage: 'en',
  reducedMotion: false,
  autoTTS: false,
  speechRate: 1.0,
  speechPitch: 1.0
};

export const AccessibilityProvider = ({ children }) => {
  // Load initial preferences from localStorage or defaults
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('accessbridge_prefs');
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Reading Ruler State
  const [readingRulerActive, setReadingRulerActive] = useState(false);
  const [readingRulerY, setReadingRulerY] = useState(200);

  // Screen reader polite announcements
  const [announcement, setAnnouncement] = useState('');

  // Global TTS State
  const [ttsState, setTtsState] = useState({
    isPlaying: false,
    isPaused: false,
    text: '',
    currentChunk: '',
    chunkIndex: 0,
    totalChunks: 0
  });

  // Subscribe to TTS changes
  useEffect(() => {
    const unsubscribe = tts.subscribe((state) => {
      setTtsState((prev) => ({ ...prev, ...state }));
    });
    return unsubscribe;
  }, []);

  // Track mouse movement for reading ruler
  useEffect(() => {
    if (!readingRulerActive) return;

    const handleMouseMove = (e) => {
      setReadingRulerY(e.clientY - 24);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingRulerActive]);

  // Apply CSS variables and classes to document body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Reset theme classes
    body.classList.remove(
      'theme-high-contrast-dark',
      'theme-high-contrast-light',
      'theme-soft-warm'
    );
    if (preferences.contrast !== 'standard') {
      body.classList.add(`theme-${preferences.contrast}`);
    }

    // Reset font size classes
    body.classList.remove('text-size-small', 'text-size-medium', 'text-size-large', 'text-size-xlarge');
    body.classList.add(`text-size-${preferences.textSize}`);

    // Reset line spacing classes
    body.classList.remove('spacing-normal', 'spacing-relaxed', 'spacing-loose');
    body.classList.add(`spacing-${preferences.lineSpacing}`);

    // Reset font families
    body.classList.remove('font-mode-dyslexic', 'font-mode-sans', 'font-mode-serif');
    if (preferences.fontFamily !== 'system') {
      body.classList.add(`font-mode-${preferences.fontFamily}`);
    }

    // Reduced motion
    if (preferences.reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }

    // Save to localStorage
    try {
      localStorage.setItem('accessbridge_prefs', JSON.stringify(preferences));
    } catch (err) {
      console.warn('Failed to save preferences to localStorage', err);
    }
  }, [preferences]);

  // Update a single or multiple preferences
  const updatePreference = useCallback((key, value) => {
    setPreferences((prev) => {
      const updated = typeof key === 'object' ? { ...prev, ...key } : { ...prev, [key]: value };
      return updated;
    });
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    setReadingRulerActive(false);
    tts.stop();
    announce('Accessibility settings have been reset to default values.');
  }, []);

  // Screen reader announcement trigger
  const announce = useCallback((message) => {
    setAnnouncement('');
    // Slight timeout allows screen readers to detect text node replacement
    setTimeout(() => {
      setAnnouncement(message);
    }, 50);
  }, []);

  // Speech actions
  const speakText = useCallback(
    (text) => {
      if (!text) return;
      announce(`Reading aloud: ${text.slice(0, 60)}...`);
      tts.speak(text, {
        rate: preferences.speechRate,
        pitch: preferences.speechPitch,
        lang: preferences.preferredLanguage === 'es' ? 'es-ES' : 'en-US'
      });
    },
    [preferences.speechRate, preferences.speechPitch, preferences.preferredLanguage, announce]
  );

  const pauseTTS = useCallback(() => tts.pause(), []);
  const resumeTTS = useCallback(() => tts.resume(), []);
  const stopTTS = useCallback(() => tts.stop(), []);

  return (
    <AccessibilityContext.Provider
      value={{
        preferences,
        updatePreference,
        resetToDefaults,
        readingRulerActive,
        setReadingRulerActive,
        readingRulerY,
        announcement,
        announce,
        ttsState,
        speakText,
        pauseTTS,
        resumeTTS,
        stopTTS
      }}
    >
      {/* Screen Reader Live Region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="accessibility-live-announcer"
      >
        {announcement}
      </div>

      {/* Visual Reading Ruler */}
      {readingRulerActive && (
        <div
          className="reading-ruler"
          style={{ top: `${readingRulerY}px` }}
          aria-hidden="true"
        />
      )}

      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityContext;
