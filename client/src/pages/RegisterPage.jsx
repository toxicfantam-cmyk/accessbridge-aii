import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { UserPlus, AlertCircle, Sparkles } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { preferences } = useAccessibility();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please provide all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, preferences);
    setLoading(false);

    if (result.success) {
      navigate('/onboarding');
    } else {
      setError(result.message);
    }
  };

  return (
    <main id="main-content" className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-bridge-100 dark:bg-bridge-950 text-bridge-600 dark:text-bridge-300 mx-auto flex items-center justify-center shadow-inner">
            <UserPlus className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Create AccessBridge Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Start transforming complex digital information with adaptive AI.
          </p>
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
              htmlFor="reg-name"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5"
            >
              Full Name:
            </label>
            <input
              id="reg-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-bridge-500"
            />
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5"
            >
              Email Address:
            </label>
            <input
              id="reg-email"
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
              htmlFor="reg-password"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5"
            >
              Password (min. 6 characters):
            </label>
            <input
              id="reg-password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-bridge-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-bridge-600 hover:bg-bridge-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 focus:ring-4 focus:ring-yellow-400"
          >
            {loading ? 'Creating Profile...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-bridge-600 dark:text-bridge-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
