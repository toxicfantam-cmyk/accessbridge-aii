import React from 'react';

export const LoadingSkeleton = ({ label = 'Processing content with Gemini 1.5 Flash accessibility engine...' }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 shadow-lg space-y-6 animate-pulse"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-bridge-200 dark:bg-bridge-900" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-bridge-200 dark:bg-bridge-900 rounded w-1/3" />
          <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/4" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-full" />
        <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-5/6" />
        <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-4/6" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
        <div className="h-20 bg-slate-100 dark:bg-zinc-800/60 rounded-xl" />
        <div className="h-20 bg-slate-100 dark:bg-zinc-800/60 rounded-xl" />
        <div className="h-20 bg-slate-100 dark:bg-zinc-800/60 rounded-xl" />
      </div>

      <p className="text-center text-sm font-semibold text-bridge-700 dark:text-bridge-300">
        {label}
      </p>
      <span className="sr-only">Please wait, adaptive transformation in progress.</span>
    </div>
  );
};

export default LoadingSkeleton;
