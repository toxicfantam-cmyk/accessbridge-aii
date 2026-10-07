import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  User,
  Sliders,
  Check,
  Save,
  Volume2,
  BookOpen,
  LogOut,
  Sparkles
} from 'lucide-react';

export const ProfileSettingsPage = () => {
  const { user, logout, updateProfilePreferences } = useAuth();
  const {
    preferences,
    updatePreference,
    readingRulerActive,
    setReadingRulerActive,
    speakText,
    announce
  } = useAccessibility();
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await updateProfilePreferences(preferences);
    setSaved(true);
    announce('Preferences saved to account.');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex items-center justify-between pb-8 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-7 h-7 text-bridge-600" />
            Account & Sensory Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal details and fine-tune your accessibility layer.
          </p>
        </div>

        <button
          onClick={logout}
          className="px-3.5 py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-1.5 focus:ring-2 focus:ring-red-500"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>

      <div className="space-y-8 mt-8">
        {/* User Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-bridge-600 text-white font-black text-xl flex items-center justify-center">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {user?.name || 'Explorer'}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {user?.email || 'demo@accessbridge.ai'}
            </div>
          </div>
        </div>

        {/* Sensory Preferences Controls */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-bridge-600" />
              Custom Sensory & Cognitive Layer
            </h2>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-bridge-600 hover:bg-bridge-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md focus:ring-2 focus:ring-blue-500"
            >
              {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Contrast Mode */}
            <div>
              <label htmlFor="settings-contrast" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                Contrast Theme:
              </label>
              <select
                id="settings-contrast"
                value={preferences.contrast}
                onChange={(e) => updatePreference('contrast', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-bridge-500"
              >
                <option value="standard">Standard Blue/Slate</option>
                <option value="high-contrast-dark">High Contrast Dark AAA (Black/Yellow)</option>
                <option value="high-contrast-light">High Contrast Light AAA (White/Black)</option>
                <option value="soft-warm">Dyslexia Warm Cream</option>
              </select>
            </div>

            {/* Text Sizing */}
            <div>
              <label htmlFor="settings-text-size" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                Text Sizing:
              </label>
              <select
                id="settings-text-size"
                value={preferences.textSize}
                onChange={(e) => updatePreference('textSize', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-bridge-500"
              >
                <option value="small">Small</option>
                <option value="medium">Standard (16px base)</option>
                <option value="large">Large (18px base)</option>
                <option value="xlarge">Extra Large (22px base)</option>
              </select>
            </div>

            {/* Font Family */}
            <div>
              <label htmlFor="settings-font" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                Font Family:
              </label>
              <select
                id="settings-font"
                value={preferences.fontFamily}
                onChange={(e) => updatePreference('fontFamily', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-bridge-500"
              >
                <option value="system">System Sans-Serif</option>
                <option value="dyslexic">OpenDyslexic / Atkinson Hyperlegible</option>
                <option value="serif">High-Legibility Serif</option>
              </select>
            </div>

            {/* Cognitive Level */}
            <div>
              <label htmlFor="settings-cognitive" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                Cognitive Simplification:
              </label>
              <select
                id="settings-cognitive"
                value={preferences.cognitiveSupport}
                onChange={(e) => updatePreference('cognitiveSupport', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-bridge-500"
              >
                <option value="standard">Standard Synthesis</option>
                <option value="simplified">Easy Read (B1/B2 English)</option>
                <option value="maximum">Maximum Assistance</option>
              </select>
            </div>
          </div>

          {/* Reading Ruler & Speech Rate */}
          <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Reading Ruler Guide
              </span>
              <span className="text-[11px] text-slate-500">
                Visual focus line tracking mouse cursor
              </span>
            </div>
            <input
              type="checkbox"
              id="settings-reading-ruler"
              checked={readingRulerActive}
              onChange={(e) => setReadingRulerActive(e.target.checked)}
              className="w-5 h-5 accent-yellow-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileSettingsPage;
