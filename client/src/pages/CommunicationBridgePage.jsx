import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import stt from '../services/sttService';
import tts from '../services/ttsService';
import {
  Radio,
  Mic,
  MicOff,
  Volume2,
  Send,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
  MessageSquare,
  Globe2,
  CheckCircle2,
  RefreshCw,
  Zap,
  Ear,
  Brain
} from 'lucide-react';

export const CommunicationBridgePage = () => {
  const { preferences, speakText, announce } = useAccessibility();

  // User A State
  const [userAMessage, setUserAMessage] = useState('');
  const [userALang, setUserALang] = useState('en-US');
  const [isListeningA, setIsListeningA] = useState(false);

  // User B State
  const [userBLang, setUserBLang] = useState(preferences.preferredLanguage === 'en' ? 'es' : 'en');
  const [userBReply, setUserBReply] = useState('');
  const [isListeningB, setIsListeningB] = useState(false);

  // Bridge Engine State
  const [bridgeMode, setBridgeMode] = useState('both'); // 'simplify', 'translate', 'both'
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {
      sender: 'User A (Doctor/Host)',
      original: 'The patient presents with acute hypertension and must adhere to a strict sodium-restricted regimen alongside 20 milligrams of lisinopril b.i.d.',
      simplified: 'You have high blood pressure. Eat less salt and take one blood pressure pill twice a day with water.',
      translated: 'Tiene la presión arterial alta. Coma menos sal y tome una pastilla para la presión dos veces al día con agua.',
      audioPhrase: 'You have high blood pressure. Eat less salt and take one pill twice a day.',
      timestamp: '10:00 AM'
    }
  ]);

  // Pre-configured hackathon demo scenarios
  const demoScenarios = [
    {
      title: 'Healthcare Prescription',
      roleA: 'Doctor',
      roleB: 'Patient',
      message: 'Take 500mg amoxicillin clavulanate orally every twelve hours with meals for seven consecutive days. Discontinue if urticaria develops.',
      targetLang: 'es'
    },
    {
      title: 'Banking & Financial',
      roleA: 'Bank Officer',
      roleB: 'Customer',
      message: 'Failure to maintain an aggregate minimum daily ledger balance of $1,500 incurs a recurring monthly maintenance assessment of $12.',
      targetLang: 'fr'
    },
    {
      title: 'Legal / Tenancy',
      roleA: 'Landlord',
      roleB: 'Tenant',
      message: 'Quiet hours commence at 22:00 hours nightly. Any sound emission exceeding 55 decibels constitutes a contractual breach.',
      targetLang: 'de'
    }
  ];

  // User A Microphone
  const toggleListeningA = () => {
    if (isListeningA) {
      stt.stopListening();
      setIsListeningA(false);
      announce('User A microphone stopped.');
      return;
    }

    if (!stt.isSupported()) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setIsListeningA(true);
    announce('User A microphone listening. Speak now.');

    stt.startListening({
      lang: userALang,
      onResult: ({ fullText }) => {
        setUserAMessage(fullText);
      },
      onError: (err) => {
        setIsListeningA(false);
        announce(`User A speech error: ${err.message}`);
      },
      onEnd: () => {
        setIsListeningA(false);
      }
    });
  };

  // User B Microphone (for reply)
  const toggleListeningB = () => {
    if (isListeningB) {
      stt.stopListening();
      setIsListeningB(false);
      announce('User B microphone stopped.');
      return;
    }

    if (!stt.isSupported()) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    setIsListeningB(true);
    announce('User B microphone listening. Speak reply now.');

    stt.startListening({
      lang: userBLang.startsWith('es') ? 'es-ES' : 'en-US',
      onResult: ({ fullText }) => {
        setUserBReply(fullText);
      },
      onError: (err) => {
        setIsListeningB(false);
        announce(`User B speech error: ${err.message}`);
      },
      onEnd: () => {
        setIsListeningB(false);
      }
    });
  };

  // Execute Bridge Transformation
  const handleBridgeSend = async (customText = null, senderName = 'User A') => {
    const textToSend = customText || (senderName === 'User A' ? userAMessage : userBReply);
    if (!textToSend.trim() || loading) return;

    setLoading(true);
    announce(`Bridging message through Gemini accessibility layer...`);

    try {
      const response = await api.post('/communicate/bridge', {
        message: textToSend.trim(),
        sourceLanguage: senderName === 'User A' ? userALang.slice(0, 2) : userBLang,
        targetLanguage: senderName === 'User A' ? userBLang : userALang.slice(0, 2),
        mode: bridgeMode
      });

      if (response.data?.data) {
        const result = response.data.data;
        const newEntry = {
          sender: senderName,
          original: result.original,
          simplified: result.simplified,
          translated: result.translated,
          audioPhrase: result.audioPhrase,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversation((prev) => [...prev, newEntry]);
        if (senderName === 'User A') setUserAMessage('');
        if (senderName === 'User B') setUserBReply('');

        // Automatic TTS readout for User B
        const textToSpeak = userBLang !== 'en' && result.translated ? result.translated : result.simplified;
        speakText(textToSpeak);
        announce(`User B received simplified message: ${result.simplified}`);
      }
    } catch (err) {
      console.error('Bridge error:', err);
      announce('Communication bridge error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadScenario = (scenario) => {
    setUserAMessage(scenario.message);
    setUserBLang(scenario.targetLang);
    announce(`Loaded scenario: ${scenario.title}`);
  };

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3 border border-emerald-300 dark:border-emerald-800">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" aria-hidden="true" />
          Two-Way Accessible Communication Bridge
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Real-Time Accessible Dialogue
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          User A speaks using Speech-to-Text. Gemini simplifies the phrasing and translates into User B’s preferred format, followed by automatic Text-to-Speech audio output.
        </p>
      </div>

      {/* Quick Pitch Scenarios */}
      <div className="mb-8 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-500" />
            Instant Pitch Scenarios:
          </span>
          <span className="text-[11px] text-slate-400">Click to test live speech simplification</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {demoScenarios.map((sc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => loadScenario(sc)}
              className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition"
            >
              <div className="font-bold text-emerald-700 dark:text-emerald-300">
                {sc.title}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {sc.roleA} ➔ {sc.roleB} ({sc.targetLang.toUpperCase()})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Split-Screen Communication Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= USER A PANEL ================= */}
        <section
          aria-labelledby="user-a-heading"
          className="lg:col-span-6 bg-white dark:bg-zinc-900 border-2 border-bridge-300 dark:border-bridge-900 rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col h-[680px]"
        >
          {/* User A Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-bridge-600 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div>
                <h2 id="user-a-heading" className="text-base font-extrabold text-slate-900 dark:text-white">
                  User A (Speaker / Sender)
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Speaks naturally or enters complex info
                </span>
              </div>
            </div>

            {/* Language Selector */}
            <select
              aria-label="User A spoken language"
              value={userALang}
              onChange={(e) => setUserALang(e.target.value)}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-slate-200"
            >
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
              <option value="fr-FR">Français</option>
            </select>
          </div>

          {/* User A Transcript / Input Area */}
          <div className="flex-1 my-4 flex flex-col justify-between">
            <div className="space-y-2">
              <label htmlFor="user-a-text" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Speech or Text Input:
              </label>
              <textarea
                id="user-a-text"
                rows={6}
                value={userAMessage}
                onChange={(e) => setUserAMessage(e.target.value)}
                placeholder={isListeningA ? 'Listening to speech in real time...' : 'Speak into the microphone or type a message...'}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-bridge-500 placeholder-slate-400"
              />
            </div>

            {/* Microphone Recording Status & Controls */}
            <div className="p-4 rounded-2xl bg-bridge-50/60 dark:bg-bridge-950/30 border border-bridge-200 dark:border-bridge-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-bridge-800 dark:text-bridge-300 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  {isListeningA ? (
                    <span className="text-red-600 font-bold animate-pulse">● Listening now...</span>
                  ) : (
                    <span>Microphone ready</span>
                  )}
                </span>
                <span className="text-[11px] text-slate-400">Web Speech API</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleListeningA}
                  aria-label={isListeningA ? 'Stop listening' : 'Start microphone speech-to-text'}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                    isListeningA
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-md animate-pulse'
                      : 'bg-bridge-600 hover:bg-bridge-700 text-white shadow-md'
                  } focus:ring-2 focus:ring-blue-500`}
                >
                  {isListeningA ? (
                    <>
                      <MicOff className="w-4 h-4" /> Stop Microphone
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" /> Start Speaking (STT)
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleBridgeSend(null, 'User A')}
                  disabled={!userAMessage.trim() || loading}
                  className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black font-extrabold text-xs flex items-center gap-1.5 disabled:opacity-50 transition focus:ring-2 focus:ring-blue-500"
                >
                  <Send className="w-3.5 h-3.5" />
                  Bridge Send
                </button>
              </div>
            </div>
          </div>

          {/* Mode Configuration */}
          <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500">Bridge Processing:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'simplify', label: 'Simplify' },
                { id: 'translate', label: 'Translate' },
                { id: 'both', label: 'Both' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setBridgeMode(m.id)}
                  className={`px-2.5 py-1 rounded-md font-semibold ${
                    bridgeMode === m.id
                      ? 'bg-bridge-600 text-white'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================= USER B PANEL ================= */}
        <section
          aria-labelledby="user-b-heading"
          className="lg:col-span-6 bg-white dark:bg-zinc-900 border-2 border-emerald-300 dark:border-emerald-900 rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col h-[680px]"
        >
          {/* User B Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                B
              </div>
              <div>
                <h2 id="user-b-heading" className="text-base font-extrabold text-slate-900 dark:text-white">
                  User B (Recipient / Listener)
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Receives simplified Plain English & Speech
                </span>
              </div>
            </div>

            {/* Target Language Preference */}
            <select
              aria-label="User B target language"
              value={userBLang}
              onChange={(e) => setUserBLang(e.target.value)}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-slate-200"
            >
              <option value="en">English (B1/B2)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="hi">हिन्दी</option>
              <option value="zh">中文</option>
            </select>
          </div>

          {/* Live Captions and Simplified Stream */}
          <div
            className="flex-1 my-4 overflow-y-auto space-y-4 pr-1"
            aria-live="polite"
            role="log"
          >
            {conversation.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900/60 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5" />
                    {item.sender} • {item.timestamp}
                  </span>
                  <button
                    onClick={() => speakText(userBLang !== 'en' && item.translated ? item.translated : item.simplified)}
                    aria-label="Listen to simplified message aloud"
                    className="p-1 rounded bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 hover:scale-105 transition shadow-sm"
                    title="Play Audio (TTS)"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Simplified Card */}
                <div className="p-3 bg-white dark:bg-zinc-800/80 rounded-xl border border-emerald-100 dark:border-zinc-700">
                  <span className="text-[10px] uppercase font-extrabold text-green-600 dark:text-green-400 block mb-1">
                    Simplified Plain English:
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {item.simplified}
                  </p>
                </div>

                {/* Translated Card if different language */}
                {userBLang !== 'en' && item.translated && (
                  <div className="p-3 bg-white dark:bg-zinc-800/80 rounded-xl border border-emerald-100 dark:border-zinc-700">
                    <span className="text-[10px] uppercase font-extrabold text-blue-600 dark:text-blue-400 block mb-1">
                      Translation ({userBLang.toUpperCase()}):
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                      {item.translated}
                    </p>
                  </div>
                )}

                {/* Collapsible Original Text */}
                <details className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <summary className="cursor-pointer font-bold hover:underline">
                    View Original Spoken Jargon
                  </summary>
                  <p className="mt-1 italic p-2 bg-slate-100 dark:bg-zinc-900 rounded font-serif">
                    "{item.original}"
                  </p>
                </details>
              </div>
            ))}
          </div>

          {/* User B Two-Way Response Form */}
          <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 space-y-2">
            <label htmlFor="user-b-reply" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              User B Response (Two-Way Feedback):
            </label>
            <div className="flex items-center gap-2">
              <input
                id="user-b-reply"
                type="text"
                value={userBReply}
                onChange={(e) => setUserBReply(e.target.value)}
                placeholder={isListeningB ? 'Listening to User B...' : 'Speak or type reply to User A...'}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />

              <button
                type="button"
                onClick={toggleListeningB}
                aria-label={isListeningB ? 'Stop listening User B' : 'User B microphone'}
                className={`p-2.5 rounded-xl border transition ${
                  isListeningB
                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-zinc-700'
                } focus:ring-2 focus:ring-blue-500`}
              >
                {isListeningB ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleBridgeSend(null, 'User B')}
                disabled={!userBReply.trim() || loading}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition focus:ring-2 focus:ring-emerald-500"
                aria-label="Send reply to User A"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CommunicationBridgePage;
