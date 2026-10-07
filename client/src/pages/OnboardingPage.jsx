import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  Brain,
  Volume2,
  Globe2,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Save,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { preferences, updatePreference, resetToDefaults, readingRulerActive, setReadingRulerActive, speakText, announce } = useAccessibility();
  const { updateProfilePreferences, isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const steps = [
    { number: 1, title: 'Visual Profile', icon: Eye, desc: 'Contrast, text sizing, and typography' },
    { number: 2, title: 'Cognitive Support', icon: Brain, desc: 'Simplification level and layout spacing' },
    { number: 3, title: 'Audio & Speech', icon: Volume2, desc: 'Voice readout speed and auto-speech' },
    { number: 4, title: 'Language & Focus', icon: Globe2, desc: 'Translation and reading assistance' }
  ];

  const handleSaveAll = async () => {
    await updateProfilePreferences(preferences);
    setSavedSuccess(true);
    announce('Accessibility profile saved successfully.');
    setTimeout(() => {
      setSavedSuccess(false);
      navigate('/transform');
    }, 1500);
  };

  return (
    <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bridge-100 dark:bg-bridge-950 text-bridge-800 dark:text-bridge-300 text-xs font-bold mb-3 border border-bridge-200 dark:border-bridge-800">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" aria-hidden="true" />
          Adaptive Profile Setup
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Personalize Your Accessibility Layer
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Choose your sensory and cognitive preferences. The interface adapts immediately as you select options.
        </p>
      </div>

      {/* Stepper Navigation */}
      <nav aria-label="Profile setup steps" className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCurrent = activeStep === step.number;
          const isCompleted = activeStep > step.number;
          return (
            <button
              key={step.number}
              onClick={() => {
                setActiveStep(step.number);
                announce(`Step ${step.number}: ${step.title}`);
              }}
              aria-current={isCurrent ? 'step' : undefined}
              className={`p-3.5 rounded-2xl border-2 text-left transition flex items-start gap-3 focus:outline-none focus:ring-2 focus:ring-bridge-500 ${
                isCurrent
                  ? 'border-bridge-600 bg-bridge-50 dark:bg-bridge-950/60 shadow-md'
                  : isCompleted
                  ? 'border-green-500/50 bg-green-50/30 dark:bg-green-950/20'
                  : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-80'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                  isCurrent
                    ? 'bg-bridge-600 text-white'
                    : isCompleted
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Step {step.number}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                  {step.title}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Main Grid: Form Controls (Left) & Real-time Live Adaptive Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-lg">
          {/* STEP 1: VISUAL NEEDS */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-bridge-600" aria-hidden="true" />
                  Visual Profile & Contrast
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Adjust visual appearance to match your sight and lighting needs.
                </p>
              </div>

              {/* Contrast Mode Selector */}
              <fieldset>
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  High Contrast Modes (WCAG AAA)
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'standard', name: 'Standard Mode', desc: 'Clean slate and blue palette' },
                    { id: 'high-contrast-dark', name: 'Dark AAA', desc: 'Pure black (#000) with yellow text' },
                    { id: 'high-contrast-light', name: 'Light AAA', desc: 'Pure white background with sharp black borders' },
                    { id: 'soft-warm', name: 'Warm / Dyslexia', desc: 'Muted cream tone to reduce glare & visual stress' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        updatePreference('contrast', c.id);
                        announce(`Selected ${c.name}`);
                      }}
                      className={`p-3.5 rounded-xl border-2 text-left transition ${
                        preferences.contrast === c.id
                          ? 'border-bridge-600 ring-2 ring-bridge-500/20 bg-bridge-50/50 dark:bg-bridge-950/40'
                          : 'border-slate-300 dark:border-zinc-700 hover:border-slate-400'
                      } focus:ring-2 focus:ring-blue-500`}
                    >
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{c.name}</span>
                        {preferences.contrast === c.id && <Check className="w-4 h-4 text-bridge-600" />}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{c.desc}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Text Sizing */}
              <fieldset>
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  Text Sizing Scale
                </legend>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'small', label: 'Compact' },
                    { id: 'medium', label: 'Standard' },
                    { id: 'large', label: 'Large' },
                    { id: 'xlarge', label: 'Maximum' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updatePreference('textSize', s.id)}
                      className={`py-2.5 text-center rounded-xl border-2 font-bold text-xs transition ${
                        preferences.textSize === s.id
                          ? 'border-bridge-600 bg-bridge-600 text-white'
                          : 'border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      } focus:ring-2 focus:ring-blue-500`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Typography */}
              <fieldset>
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  Reading Font Family
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'system', name: 'System Sans' },
                    { id: 'dyslexic', name: 'Dyslexia Legible' },
                    { id: 'serif', name: 'Serif Classic' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => updatePreference('fontFamily', f.id)}
                      className={`py-2 px-3 text-center rounded-xl border-2 text-xs font-bold transition ${
                        preferences.fontFamily === f.id
                          ? 'border-bridge-600 bg-bridge-50 dark:bg-bridge-950 text-bridge-700 dark:text-bridge-300'
                          : 'border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      } focus:ring-2 focus:ring-blue-500`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {/* STEP 2: COGNITIVE SUPPORT */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" aria-hidden="true" />
                  Cognitive & Processing Support
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Adjust how information is simplified and presented to reduce overwhelm.
                </p>
              </div>

              {/* Cognitive Simplification Level */}
              <fieldset>
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  AI Simplification Level
                </legend>
                <div className="space-y-2.5">
                  {[
                    { id: 'standard', title: 'Standard Synthesis', desc: 'Maintains professional terminology while summarizing key points.' },
                    { id: 'simplified', title: 'Easy Read (B1/B2 English)', desc: 'Replaces jargon with everyday active vocabulary, short sentences, and bullet checklists.' },
                    { id: 'maximum', title: 'Maximum Accessibility Assistance', desc: 'Breakdowns into single-concept bullets with explicit action items and zero idioms.' }
                  ].map((cog) => (
                    <button
                      key={cog.id}
                      type="button"
                      onClick={() => updatePreference('cognitiveSupport', cog.id)}
                      className={`w-full p-3.5 rounded-xl border-2 text-left transition ${
                        preferences.cognitiveSupport === cog.id
                          ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 text-slate-900 dark:text-white'
                          : 'border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      } focus:ring-2 focus:ring-purple-500`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>{cog.title}</span>
                        {preferences.cognitiveSupport === cog.id && <Check className="w-4 h-4 text-purple-600" />}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{cog.desc}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Line & Word Spacing */}
              <fieldset>
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  Line & Word Spacing
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'Normal' },
                    { id: 'relaxed', label: 'Relaxed (1.8x)' },
                    { id: 'loose', label: 'Loose (2.2x)' }
                  ].map((space) => (
                    <button
                      key={space.id}
                      type="button"
                      onClick={() => updatePreference('lineSpacing', space.id)}
                      className={`py-2 text-center rounded-xl border-2 text-xs font-bold transition ${
                        preferences.lineSpacing === space.id
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : 'border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      } focus:ring-2 focus:ring-purple-500`}
                    >
                      {space.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/60">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Reduced Motion Mode
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Disables interface animations and transitions to prevent vertigo.
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="reduced-motion-toggle"
                  checked={preferences.reducedMotion}
                  onChange={(e) => updatePreference('reducedMotion', e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: AUDIO & SPEECH */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  Speech & Auditory Feedback
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure the native browser voice playback for transformed documents.
                </p>
              </div>

              {/* Speech Speed Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="speech-rate-slider" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Speech Playback Speed: {preferences.speechRate}x
                  </label>
                  <button
                    type="button"
                    onClick={() => speakText(`Testing speech rate at ${preferences.speechRate} speed.`)}
                    className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Test Voice
                  </button>
                </div>
                <input
                  type="range"
                  id="speech-rate-slider"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={preferences.speechRate}
                  onChange={(e) => updatePreference('speechRate', parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0.5x (Slow)</span>
                  <span>1.0x (Normal)</span>
                  <span>2.0x (Fast)</span>
                </div>
              </div>

              {/* Auto Read Aloud Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/60">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Automatic Speech Synthesis
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Automatically starts reading summaries aloud when a transformation completes.
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="auto-tts-toggle"
                  checked={preferences.autoTTS}
                  onChange={(e) => updatePreference('autoTTS', e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: LANGUAGE & FOCUS */}
          {activeStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  Language & Focus Aids
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select your primary language for automatic translations and assistive visual focus.
                </p>
              </div>

              {/* Preferred Language */}
              <div>
                <label htmlFor="preferred-language" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Primary Preferred Translation Language
                </label>
                <select
                  id="preferred-language"
                  value={preferences.preferredLanguage}
                  onChange={(e) => updatePreference('preferredLanguage', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-bridge-500"
                >
                  <option value="en">English (Default)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="fr">Français (French)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="zh">中文 (Chinese - Simplified)</option>
                  <option value="ar">العربية (Arabic)</option>
                  <option value="pt">Português (Portuguese)</option>
                  <option value="tl">Tagalog (Filipino)</option>
                  <option value="vi">Tiếng Việt (Vietnamese)</option>
                </select>
              </div>

              {/* Reading Ruler Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/60">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    Interactive Reading Ruler
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    A tinted horizontal focus bar that follows your cursor across long documents.
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="reading-ruler-toggle"
                  checked={readingRulerActive}
                  onChange={(e) => setReadingRulerActive(e.target.checked)}
                  className="w-5 h-5 accent-amber-600 rounded cursor-pointer focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200 dark:border-zinc-800">
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <button
                type="button"
                onClick={resetToDefaults}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
              </button>
            )}

            {activeStep < 4 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-5 py-2.5 rounded-xl bg-bridge-600 hover:bg-bridge-700 text-white text-xs font-bold flex items-center gap-1 shadow-md focus:ring-2 focus:ring-blue-500"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg focus:ring-4 focus:ring-yellow-400"
              >
                <Save className="w-4 h-4" />
                {savedSuccess ? 'Profile Saved!' : 'Save & Start Transforming'}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive Adaptive Preview */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <div className="p-6 rounded-3xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Live Adaptive Preview
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Adapts in real-time
              </span>
            </div>

            {/* Preview Document Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-bridge-100 text-bridge-800 dark:bg-bridge-950 dark:text-bridge-300">
                  Notice Sample
                </span>
                <span className="text-xs text-slate-400 font-mono">14 business days remaining</span>
              </div>

              <h3 className="font-extrabold text-slate-900 dark:text-white">
                Official Housing & Verification Notice
              </h3>

              <p className="text-slate-700 dark:text-slate-300">
                You must verify your residential address before the deadline to keep your support account active.
              </p>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block">
                  Action Checklist:
                </span>
                <ul className="text-xs text-amber-900 dark:text-amber-200 list-disc list-inside mt-1 space-y-1">
                  <li>Scan your recent utility bill or proof of residence.</li>
                  <li>Upload to the verification portal before November 1st.</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => speakText('You must verify your residential address before the deadline to keep your support account active.')}
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-500"
            >
              <Volume2 className="w-4 h-4 text-bridge-600" />
              Listen with configured settings
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OnboardingPage;
