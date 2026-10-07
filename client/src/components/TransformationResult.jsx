import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  FileText,
  CheckCircle2,
  Calendar,
  MapPin,
  Globe2,
  Volume2,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const TransformationResult = ({ transformation }) => {
  const [activeTab, setActiveTab] = useState('easyRead');
  const [copied, setCopied] = useState(false);
  const { speakText, announce, preferences } = useAccessibility();

  if (!transformation) return null;

  const {
    originalType,
    originalFileName,
    originalText,
    summary,
    easyRead = [],
    keyInfo = { deadlines: [], locations: [], actions: [] },
    translation = '',
    targetLanguage = 'en'
  } = transformation;

  const tabs = [
    { id: 'easyRead', label: 'Easy Read', icon: CheckCircle2, count: easyRead.length },
    { id: 'keyInfo', label: 'Key Info', icon: Calendar, count: (keyInfo.deadlines?.length || 0) + (keyInfo.actions?.length || 0) },
    { id: 'translation', label: 'Translation', icon: Globe2, count: translation ? 1 : 0 },
    { id: 'original', label: 'Original', icon: FileText, count: originalType }
  ];

  const handleCopyCurrent = () => {
    let contentToCopy = '';
    if (activeTab === 'easyRead') {
      contentToCopy = `${summary}\n\nKey Points:\n${easyRead.map((p) => `• ${p}`).join('\n')}`;
    } else if (activeTab === 'keyInfo') {
      contentToCopy = `Deadlines:\n${keyInfo.deadlines?.join('\n')}\n\nActions:\n${keyInfo.actions?.join('\n')}\n\nLocations:\n${keyInfo.locations?.join('\n')}`;
    } else if (activeTab === 'translation') {
      contentToCopy = translation || 'No translation available.';
    } else {
      contentToCopy = originalText || summary;
    }

    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    announce('Content copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleListenTab = () => {
    let textToSpeak = '';
    if (activeTab === 'easyRead') {
      textToSpeak = `${summary}. Here are the easy read points: ${easyRead.join('. ')}`;
    } else if (activeTab === 'keyInfo') {
      const d = keyInfo.deadlines?.length ? `Deadlines: ${keyInfo.deadlines.join(', ')}.` : '';
      const a = keyInfo.actions?.length ? `Required actions: ${keyInfo.actions.join(', ')}.` : '';
      const l = keyInfo.locations?.length ? `Locations: ${keyInfo.locations.join(', ')}.` : '';
      textToSpeak = `${d} ${a} ${l}`;
    } else if (activeTab === 'translation') {
      textToSpeak = translation || summary;
    } else {
      textToSpeak = originalText?.slice(0, 1500) || summary;
    }

    speakText(textToSpeak);
  };

  const handleDownloadSummary = () => {
    const textBlob = new Blob(
      [
        `ACCESSBRIDGE AI - ACCESSIBILITY TRANSFORMATION REPORT\n`,
        `=======================================================\n\n`,
        `DOCUMENT: ${originalFileName} (${originalType.toUpperCase()})\n\n`,
        `ACCESSIBLE SUMMARY:\n${summary}\n\n`,
        `EASY READ BREAKDOWN:\n${easyRead.map((b, i) => `${i + 1}. ${b}`).join('\n')}\n\n`,
        `KEY DEADLINES:\n${keyInfo.deadlines?.map((d) => `- ${d}`).join('\n') || 'None'}\n\n`,
        `REQUIRED ACTIONS:\n${keyInfo.actions?.map((a) => `- ${a}`).join('\n') || 'None'}\n\n`,
        `LOCATIONS:\n${keyInfo.locations?.map((l) => `- ${l}`).join('\n') || 'None'}\n\n`,
        translation ? `TRANSLATION (${targetLanguage}):\n${translation}\n\n` : ''
      ],
      { type: 'text/plain;charset=utf-8' }
    );

    const url = URL.createObjectURL(textBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AccessBridge_${originalFileName.replace(/\.[^/.]+$/, '')}_Accessible.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    announce('Accessible report downloaded.');
  };

  return (
    <div
      role="region"
      aria-label="Transformed Document Results"
      className="bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden"
    >
      {/* Top Banner with Summary & Global TTS Listen */}
      <div className="bg-gradient-to-r from-bridge-50 via-white to-blue-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 border-b border-slate-200 dark:border-zinc-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-bridge-100 text-bridge-800 dark:bg-bridge-950 dark:text-bridge-300 border border-bridge-300 dark:border-bridge-800">
                {originalType} transformed
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-xs">
                {originalFileName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" aria-hidden="true" />
              Accessible Synthesis
            </h2>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleListenTab}
              aria-label="Listen to active view aloud"
              className="px-4 py-2.5 rounded-xl bg-bridge-600 hover:bg-bridge-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm focus:ring-4 focus:ring-yellow-400 transition"
            >
              <Volume2 className="w-4 h-4 text-yellow-300" aria-hidden="true" />
              Listen Aloud
            </button>

            <button
              onClick={handleCopyCurrent}
              aria-label="Copy current view text to clipboard"
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 focus:ring-2 focus:ring-blue-500"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  Copy
                </>
              )}
            </button>

            <button
              onClick={handleDownloadSummary}
              aria-label="Download accessible text report"
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 focus:ring-2 focus:ring-blue-500"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Export
            </button>
          </div>
        </div>

        {/* 2-Sentence Plain Summary Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-800/80 border-2 border-bridge-200 dark:border-bridge-900 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-bridge-700 dark:text-bridge-300 block mb-1">
            2-Sentence Core Summary:
          </span>
          <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      {/* Accessible Tabs Navigation */}
      <div
        role="tablist"
        aria-label="Transformation Views"
        className="flex border-b border-slate-200 dark:border-zinc-800 px-4 sm:px-8 bg-slate-50 dark:bg-zinc-950 overflow-x-auto gap-2 pt-2"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id);
                announce(`Switched to ${tab.label} tab`);
              }}
              className={`flex items-center gap-2 py-3.5 px-4 font-bold text-sm border-b-4 transition shrink-0 focus:outline-none focus:ring-2 focus:ring-bridge-500 ${
                isSelected
                  ? 'border-bridge-600 text-bridge-700 dark:text-bridge-300 bg-white dark:bg-zinc-900 rounded-t-xl shadow-sm'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-bridge-600 dark:text-bridge-400' : 'text-slate-400'}`} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="p-6 sm:p-8">
        {/* Tab 1: Easy Read View */}
        {activeTab === 'easyRead' && (
          <div
            id="panel-easyRead"
            role="tabpanel"
            aria-labelledby="tab-easyRead"
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" aria-hidden="true" />
                Easy Read Breakdown (B1/B2 English)
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Short sentences • Active voice • Low cognitive load
              </span>
            </div>

            <ul className="space-y-3" aria-label="Easy read points">
              {easyRead.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 hover:border-bridge-400 transition"
                >
                  <span className="w-7 h-7 rounded-full bg-bridge-100 dark:bg-bridge-950 text-bridge-700 dark:text-bridge-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-bridge-300 dark:border-bridge-800">
                    {idx + 1}
                  </span>
                  <p className="text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed flex-1">
                    {bullet}
                  </p>
                  <button
                    onClick={() => speakText(bullet)}
                    aria-label={`Read point ${idx + 1} aloud`}
                    className="p-1.5 text-slate-400 hover:text-bridge-600 dark:hover:text-bridge-400 focus:ring-2 focus:ring-blue-500 rounded-lg"
                  >
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 2: Key Info View */}
        {activeTab === 'keyInfo' && (
          <div
            id="panel-keyInfo"
            role="tabpanel"
            aria-labelledby="tab-keyInfo"
            className="space-y-6"
          >
            <div className="pb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Crucial Details & Deadlines
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Categorized to eliminate cognitive friction and prevent missed actions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Deadlines Card */}
              <div className="rounded-2xl p-5 bg-amber-50/70 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/50">
                <div className="flex items-center gap-2 mb-3 text-amber-800 dark:text-amber-400 font-bold text-sm">
                  <Calendar className="w-5 h-5" aria-hidden="true" />
                  <h4>Critical Deadlines</h4>
                </div>
                {keyInfo.deadlines && keyInfo.deadlines.length > 0 ? (
                  <ul className="space-y-2">
                    {keyInfo.deadlines.map((item, i) => (
                      <li key={i} className="text-sm font-semibold text-amber-900 dark:text-amber-200 flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">No specific deadlines identified.</p>
                )}
              </div>

              {/* Actions Card */}
              <div className="rounded-2xl p-5 bg-blue-50/70 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-900/50">
                <div className="flex items-center gap-2 mb-3 text-bridge-800 dark:text-bridge-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  <h4>Required Actions</h4>
                </div>
                {keyInfo.actions && keyInfo.actions.length > 0 ? (
                  <ul className="space-y-2">
                    {keyInfo.actions.map((item, i) => (
                      <li key={i} className="text-sm font-semibold text-bridge-900 dark:text-bridge-200 flex items-start gap-2">
                        <span className="text-bridge-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">No explicit actions required.</p>
                )}
              </div>

              {/* Locations Card */}
              <div className="rounded-2xl p-5 bg-emerald-50/70 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900/50">
                <div className="flex items-center gap-2 mb-3 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                  <h4>Locations & Portals</h4>
                </div>
                {keyInfo.locations && keyInfo.locations.length > 0 ? (
                  <ul className="space-y-2">
                    {keyInfo.locations.map((item, i) => (
                      <li key={i} className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                        <span className="text-emerald-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">No physical or digital locations specified.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Translation View */}
        {activeTab === 'translation' && (
          <div
            id="panel-translation"
            role="tabpanel"
            aria-labelledby="tab-translation"
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-bridge-600" aria-hidden="true" />
                Adaptive Translation ({targetLanguage.toUpperCase()})
              </h3>
              <button
                onClick={() => speakText(translation)}
                aria-label="Listen to translation"
                className="text-xs font-semibold text-bridge-600 dark:text-bridge-400 flex items-center gap-1 focus:ring-2 focus:ring-blue-500 rounded p-1"
              >
                <Volume2 className="w-4 h-4" /> Listen
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
              {translation ? (
                <p className="text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                  {translation}
                </p>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Globe2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>English is your primary selected language. Switch preferred language in profile or upload wizard to generate translations.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Original View */}
        {activeTab === 'original' && (
          <div
            id="panel-original"
            role="tabpanel"
            aria-labelledby="tab-original"
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600" aria-hidden="true" />
                Original Document Text Extract
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {originalFileName} • {originalType.toUpperCase()}
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-100 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 font-mono text-xs text-slate-800 dark:text-slate-300 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {originalText || summary || 'Raw text preview unavailable.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransformationResult;
