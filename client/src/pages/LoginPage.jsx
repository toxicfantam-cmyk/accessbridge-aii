import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const handleDemoClick = async () => {
    setLoading(true);
    const result = await demoLogin();
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <main id="main-content" className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-bridge-100 dark:bg-bridge-950 text-bridge-600 dark:text-bridge-300 mx-auto flex items-center justify-center shadow-inner">
            <LogIn className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Welcome to AccessBridge AI
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your synthesized documents and custom profile.
          </p>
        </div>

        {/* Demo Fast Login */}
        <button
          type="button"
          onClick={handleDemoClick}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 focus:ring-4 focus:ring-yellow-600"
        >
          <Sparkles className="w-4 h-4 text-black" />
          ⚡ Instant One-Click Demo Evaluator Sign In
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-zinc-800 w-full" />
          <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Or Standard Account
          </span>
          <div className="border-t border-slate-200 dark:border-zinc-800 w-full" />
        </div>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-red-800 dark:text-red-200 text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5"
            >
              Email Address:
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-bridge-500"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5"
            >
              Password:
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-bridge-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-bridge-600 hover:bg-bridge-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 focus:ring-4 focus:ring-yellow-400"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-bridge-600 dark:text-bridge-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
