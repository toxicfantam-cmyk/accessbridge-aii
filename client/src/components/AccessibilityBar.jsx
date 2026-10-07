import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Eye,
  Type,
  Sun,
  Moon,
  Volume2,
  Sliders,
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  BookOpen,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export const AccessibilityBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    preferences,
    updatePreference,
    resetToDefaults,
    readingRulerActive,
    setReadingRulerActive,
    speakText,
    announce
  } = useAccessibility();

  const handleContrastChange = (contrast) => {
    updatePreference('contrast', contrast);
    announce(`Contrast mode set to ${contrast.replace('-', ' ')}`);
  };

  const handleTextSizeChange = (size) => {
    updatePreference('textSize', size);
    announce(`Text size set to ${size}`);
  };

  const handleFontChange = (fontFamily) => {
    updatePreference('fontFamily', fontFamily);
    announce(`Font changed to ${fontFamily}`);
  };

  const handleSpacingChange = (lineSpacing) => {
    updatePreference('lineSpacing', lineSpacing);
    announce(`Line spacing set to ${lineSpacing}`);
  };

  const handleReadPage = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      const textToRead = mainContent.innerText || '';
      speakText(textToRead.slice(0, 2000));
    } else {
      announce('No main content found to read.');
    }
  };

  return (
    <aside
      aria-label="Accessibility quick controls"
      className="fixed bottom-4 right-4 z-40 transition-all duration-200"
    >
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-label={isOpen ? 'Close accessibility settings menu' : 'Open accessibility settings menu'}
        className="flex items-center gap-2 px-4 py-3 bg-bridge-700 hover:bg-bridge-800 text-white font-bold rounded-full shadow-2xl border-2 border-white focus:outline-none focus:ring-4 focus:ring-yellow-400 transition transform hover:scale-105"
      >
        <Eye className="w-5 h-5 text-yellow-300" aria-hidden="true" />
        <span className="text-sm font-semibold tracking-wide">Accessibility</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        ) : (
          <ChevronUp className="w-4 h-4" aria-hidden="true" />
        )}
      </button>

      {/* Expanded Accessibility Widget */}
      {isOpen && (
        <div
          id="accessibility-panel"
          role="region"
          aria-label="Accessibility settings panel"
          className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700 rounded-2xl shadow-2xl p-5 text-slate-900 dark:text-slate-100 max-h-[85vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-base font-bold flex items-center gap-2 text-bridge-700 dark:text-bridge-300">
              <Sliders className="w-5 h-5" aria-hidden="true" />
              Instant Accessibility Controls
            </h2>
            <button
              onClick={resetToDefaults}
              aria-label="Reset all accessibility settings to default"
              className="text-xs px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 border border-slate-200 dark:border-zinc-700 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 focus:ring-2 focus:ring-blue-500"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset
            </button>
          </div>

          <div className="space-y-4 pt-3">
            {/* Contrast Modes */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Color Contrast (WCAG AAA)
              </legend>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleContrastChange('standard')}
                  className={`px-2.5 py-2 text-xs font-medium rounded-lg border-2 flex items-center gap-2 justify-center transition ${
                    preferences.contrast === 'standard'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  } focus:ring-2 focus:ring-blue-500`}
                >
                  <Sun className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => handleContrastChange('high-contrast-dark')}
                  className={`px-2.5 py-2 text-xs font-medium rounded-lg border-2 flex items-center gap-2 justify-center transition bg-black text-yellow-300 ${
                    preferences.contrast === 'high-contrast-dark'
                      ? 'border-yellow-400 ring-2 ring-yellow-400 font-bold'
                      : 'border-zinc-600 hover:border-zinc-400'
                  } focus:ring-2 focus:ring-yellow-400`}
                >
                  <Moon className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                  Dark AAA
                </button>
                <button
                  type="button"
                  onClick={() => handleContrastChange('high-contrast-light')}
                  className={`px-2.5 py-2 text-xs font-medium rounded-lg border-2 flex items-center gap-2 justify-center transition bg-white text-black ${
                    preferences.contrast === 'high-contrast-light'
                      ? 'border-black ring-2 ring-black font-bold'
                      : 'border-slate-400 hover:border-black'
                  } focus:ring-2 focus:ring-black`}
                >
                  <Sun className="w-4 h-4 text-black" aria-hidden="true" />
                  Light AAA
                </button>
                <button
                  type="button"
                  onClick={() => handleContrastChange('soft-warm')}
                  className={`px-2.5 py-2 text-xs font-medium rounded-lg border-2 flex items-center gap-2 justify-center transition bg-[#fcf6e8] text-[#2d261e] ${
                    preferences.contrast === 'soft-warm'
                      ? 'border-[#855318] ring-2 ring-[#855318] font-bold'
                      : 'border-[#d8c8ae] hover:border-[#855318]'
                  } focus:ring-2 focus:ring-amber-700`}
                >
                  <Sparkles className="w-4 h-4 text-amber-700" aria-hidden="true" />
                  Dyslexia Warm
                </button>
              </div>
            </fieldset>

            {/* Font Sizing */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Text Sizing
              </legend>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'small', label: 'Small', symbol: 'A-' },
                  { id: 'medium', label: 'Default', symbol: 'A' },
                  { id: 'large', label: 'Large', symbol: 'A+' },
                  { id: 'xlarge', label: 'X-Large', symbol: 'A++' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTextSizeChange(item.id)}
                    className={`py-2 px-1 text-center rounded-lg border-2 text-xs font-bold transition ${
                      preferences.textSize === item.id
                        ? 'border-bridge-600 bg-bridge-50 dark:bg-bridge-950/40 text-bridge-700 dark:text-bridge-300'
                        : 'border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    } focus:ring-2 focus:ring-blue-500`}
                    aria-label={`Change text size to ${item.label}`}
                  >
                    <span>{item.symbol}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Typography / Dyslexia Mode */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Reading Font Style
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'system', label: 'Default' },
                  { id: 'dyslexic', label: 'Dyslexia Friendly' },
                  { id: 'serif', label: 'Serif' }
                ].map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => handleFontChange(font.id)}
                    className={`p-2 text-xs rounded-lg border-2 text-center transition ${
                      preferences.fontFamily === font.id
                        ? 'border-bridge-600 bg-bridge-50 dark:bg-bridge-950/40 text-bridge-700 dark:text-bridge-300 font-bold'
                        : 'border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    } focus:ring-2 focus:ring-blue-500`}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Line Spacing */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Line & Word Spacing
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: 'Normal' },
                  { id: 'relaxed', label: 'Relaxed' },
                  { id: 'loose', label: 'Spacious' }
                ].map((spacing) => (
                  <button
                    key={spacing.id}
                    type="button"
                    onClick={() => handleSpacingChange(spacing.id)}
                    className={`p-2 text-xs rounded-lg border-2 text-center transition ${
                      preferences.lineSpacing === spacing.id
                        ? 'border-bridge-600 bg-bridge-50 dark:bg-bridge-950/40 text-bridge-700 dark:text-bridge-300 font-bold'
                        : 'border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    } focus:ring-2 focus:ring-blue-500`}
                  >
                    {spacing.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Assistive Reading Tools */}
            <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 space-y-2">
              <button
                type="button"
                onClick={() => {
                  const newState = !readingRulerActive;
                  setReadingRulerActive(newState);
                  announce(newState ? 'Reading ruler activated' : 'Reading ruler turned off');
                }}
                className={`w-full py-2.5 px-3 rounded-lg border-2 text-xs font-semibold flex items-center justify-between transition ${
                  readingRulerActive
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-900 dark:text-yellow-200'
                    : 'border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-yellow-600" aria-hidden="true" />
                  Focus Reading Ruler
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-700">
                  {readingRulerActive ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleReadPage}
                className="w-full py-2.5 px-3 rounded-lg bg-bridge-600 hover:bg-bridge-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
              >
                <Volume2 className="w-4 h-4" aria-hidden="true" />
                Read Current Page Aloud (TTS)
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AccessibilityBar;
