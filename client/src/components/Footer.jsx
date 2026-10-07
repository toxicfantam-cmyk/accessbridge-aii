import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                AccessBridge AI
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border border-green-300 dark:border-green-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                WCAG 2.1 AAA Target
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
              Adaptive accessibility AI transforming complex information into the exact format every individual needs. Built for universal digital equity.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              Powered by <span className="font-bold text-bridge-600 dark:text-bridge-400">Google Gemini 1.5 Flash</span>
            </span>
            <span>•</span>
            <span>Web Speech API Native Audio</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" aria-label="love" /> for inclusion
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-900 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>© 2026 AccessBridge AI. All rights reserved. Open-standard accessibility layer.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
