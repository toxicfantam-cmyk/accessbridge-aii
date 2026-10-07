import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Radio,
  Eye,
  Brain,
  Volume2,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Sliders,
  Users
} from 'lucide-react';

export const LandingPage = () => {
  const { speakText, updatePreference, preferences } = useAccessibility();
  const { demoLogin } = useAuth();
  const [heroTab, setHeroTab] = useState('easyRead');

  const sampleComplexText = `Pursuant to Regulation 47.B, all recipients must submit formal notarized documentation verifying residential compliance prior to the designated deadline of the 15th prox., failure of which shall incur irrevocable administrative nullification.`;

  const sampleEasyRead = [
    'You need to prove where you live by submitting a confirmed document.',
    'You must send this by the 15th of next month.',
    'If you do not send it, your application will be cancelled.'
  ];

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bridge-100 dark:bg-bridge-950/60 border border-bridge-300 dark:border-bridge-800 text-bridge-800 dark:text-bridge-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" aria-hidden="true" />
                Adaptive Multimodal AI Accessibility Layer
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                One digital bridge.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-bridge-600 to-cyan-500">
                  Every way to understand.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Transform complex PDFs, documents, images, and live speech into clear, cognitive-friendly Easy Read formats, native speech, and high-contrast visual layers — personalized for your sensory profile.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/transform"
                  className="px-6 py-3.5 rounded-xl bg-bridge-600 hover:bg-bridge-700 text-white font-bold text-base shadow-lg shadow-bridge-500/25 hover:shadow-xl hover:shadow-bridge-500/35 transition flex items-center gap-2 focus:ring-4 focus:ring-yellow-400"
                >
                  <FileText className="w-5 h-5" aria-hidden="true" />
                  Transform a Document
                </Link>

                <Link
                  to="/bridge"
                  className="px-6 py-3.5 rounded-xl border-2 border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 font-bold text-base transition flex items-center gap-2 focus:ring-2 focus:ring-blue-500"
                >
                  <Radio className="w-5 h-5 text-bridge-600" aria-hidden="true" />
                  Two-Way Speech Bridge
                </Link>

                <button
                  type="button"
                  onClick={demoLogin}
                  className="px-4 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold text-sm shadow-md transition flex items-center gap-1.5 focus:ring-2 focus:ring-yellow-600"
                >
                  ⚡ One-Click Demo Mode
                </button>
              </div>

              {/* Compliance & Standards Highlights */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-600" aria-hidden="true" />
                  WCAG 2.1 AAA Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-600" aria-hidden="true" />
                  B1/B2 Cognitive Plain English
                </span>
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-bridge-600" aria-hidden="true" />
                  Native Browser STT / TTS
                </span>
              </div>
            </div>

            {/* Right Column: Live Interactive Adaptation Sandbox */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" aria-hidden="true" />
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Live AI Transformation Sandbox
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                    Live Demo
                  </span>
                </div>

                {/* Tab Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
                  <button
                    onClick={() => setHeroTab('original')}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      heroTab === 'original'
                        ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Original Complex Jargon
                  </button>
                  <button
                    onClick={() => setHeroTab('easyRead')}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      heroTab === 'easyRead'
                        ? 'bg-bridge-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    ✨ Easy Read (AccessBridge)
                  </button>
                </div>

                {/* Display Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 min-h-[160px] flex flex-col justify-center">
                  {heroTab === 'original' ? (
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-red-500 block mb-1">
                        High Cognitive Load • Bureaucratic Language
                      </span>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-serif leading-relaxed italic">
                        "{sampleComplexText}"
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-green-600 dark:text-green-400 block mb-1">
                        Cognitive Friendly • Active Voice • Bulleted
                      </span>
                      <ul className="space-y-2">
                        {sampleEasyRead.map((item, idx) => (
                          <li key={idx} className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Controls */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      const text = heroTab === 'original' ? sampleComplexText : sampleEasyRead.join('. ');
                      speakText(text);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 focus:ring-2 focus:ring-blue-500"
                  >
                    <Volume2 className="w-4 h-4 text-bridge-600" />
                    Read Aloud
                  </button>

                  <Link
                    to="/onboarding"
                    className="text-xs font-bold text-bridge-600 dark:text-bridge-400 hover:underline flex items-center gap-1"
                  >
                    Customize your profile <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 bg-slate-100/70 dark:bg-zinc-950 border-y border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Built for Universal Digital Autonomy
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              Four tailored accessibility pillars powered by Google Gemini 1.5 Flash and browser-native assistive APIs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: 'Multimodal Transform',
                desc: 'Upload complex PDFs, scanned medical notices, or bank forms. Extract structured deadlines and actions automatically.',
                color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50'
              },
              {
                icon: Brain,
                title: 'Cognitive Easy Read',
                desc: 'Translates convoluted jargon into B1/B2 Plain English with short sentences and bulleted checklists.',
                color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50'
              },
              {
                icon: Radio,
                title: 'Communication Bridge',
                desc: 'Split-screen interface connecting User A via speech-to-text and User B via instant simplified text-to-speech output.',
                color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50'
              },
              {
                icon: Eye,
                title: 'WCAG AAA Theming',
                desc: 'Dynamic 7:1 contrast ratios, dyslexic typography, reading rulers, and instant text scaling across every screen.',
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50'
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Personas Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-bridge-600 dark:text-bridge-400 block mb-1">
              Who We Serve
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Designed With & For Diverse Communities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Neurodivergent & Dyslexic Readers
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Focus reading rulers, high letter-spacing typography, and distraction-free summaries eliminate sensory fatigue when processing dense institutional paperwork.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Low Vision & Blind Individuals
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                WCAG AAA 7:1+ high contrast dark mode, full keyboard navigation with visible focus rings, sentence-chunked native TTS, and semantic HTML structure.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                ESL & First-Time Bureaucracy Navigators
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Instant translation with Plain English simplifications and verified document Q&A to ask direct questions without fear or confusion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-16 bg-gradient-to-r from-bridge-700 to-cyan-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience barrier-free information?
          </h2>
          <p className="text-bridge-100 text-base max-w-xl mx-auto">
            Set your accessibility preferences or upload your first document in seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/transform"
              className="px-6 py-3.5 rounded-xl bg-white text-bridge-800 font-bold hover:bg-slate-100 shadow-xl transition focus:ring-4 focus:ring-yellow-400"
            >
              Start Transforming Now
            </Link>
            <Link
              to="/onboarding"
              className="px-6 py-3.5 rounded-xl bg-bridge-800/60 hover:bg-bridge-800 text-white font-bold border border-bridge-300/40 transition focus:ring-2 focus:ring-white"
            >
              Configure Accessibility Profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
