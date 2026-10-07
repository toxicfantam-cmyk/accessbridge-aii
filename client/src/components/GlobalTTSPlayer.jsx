import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Play, Pause, Square, Volume2, FastForward } from 'lucide-react';

export const GlobalTTSPlayer = () => {
  const {
    ttsState,
    pauseTTS,
    resumeTTS,
    stopTTS,
    preferences,
    updatePreference,
    announce
  } = useAccessibility();

  if (!ttsState.isPlaying && !ttsState.isPaused) {
    return null;
  }

  const handleSpeedChange = (speed) => {
    updatePreference('speechRate', speed);
    announce(`Speech speed set to ${speed}x`);
  };

  return (
    <div
      role="region"
      aria-label="Text-to-Speech active playback controls"
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white border-t-4 border-bridge-500 shadow-2xl px-4 py-3 sm:px-6 transition-transform"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Active Speaking Sentence */}
        <div className="flex items-center gap-3 w-full md:w-3/5 overflow-hidden">
          <div className="p-2 rounded-full bg-bridge-500 text-white shrink-0 animate-pulse">
            <Volume2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="truncate">
            <span className="text-xs uppercase tracking-wider text-bridge-300 font-bold block">
              Currently Reading ({ttsState.chunkIndex + 1}/{ttsState.totalChunks || 1}):
            </span>
            <p className="text-sm font-medium text-slate-100 truncate">
              "{ttsState.currentChunk || 'Reading text...'}"
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {ttsState.isPaused ? (
            <button
              onClick={resumeTTS}
              aria-label="Resume speech playback"
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 focus:ring-2 focus:ring-yellow-400"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              Resume
            </button>
          ) : (
            <button
              onClick={pauseTTS}
              aria-label="Pause speech playback"
              className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold text-xs flex items-center gap-1.5 focus:ring-2 focus:ring-yellow-400"
            >
              <Pause className="w-4 h-4" aria-hidden="true" />
              Pause
            </button>
          )}

          <button
            onClick={stopTTS}
            aria-label="Stop speech playback"
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 focus:ring-2 focus:ring-yellow-400"
          >
            <Square className="w-4 h-4" aria-hidden="true" />
            Stop
          </button>

          {/* Speed Controls */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-700">
            <FastForward className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                aria-label={`Set speech speed to ${speed}x`}
                className={`px-2 py-1 text-xs rounded font-medium transition ${
                  preferences.speechRate === speed
                    ? 'bg-bridge-500 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                } focus:ring-2 focus:ring-blue-400`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTTSPlayer;
