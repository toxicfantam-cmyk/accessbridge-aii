import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Sparkles,
  Layers,
  Radio,
  Sliders,
  User,
  LogOut,
  Menu,
  X,
  FileText
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { preferences } = useAccessibility();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/transform', label: 'AI Transform', icon: FileText, desc: 'Transform documents & images' },
    { to: '/bridge', label: 'Comm Bridge', icon: Radio, desc: 'Two-way accessible communication' },
    { to: '/dashboard', label: 'Dashboard', icon: Layers, desc: 'Your transformed files' },
    { to: '/onboarding', label: 'Profile Setup', icon: Sliders, desc: 'Set sensory & cognitive needs' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and Tagline */}
          <Link
            to="/"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-bridge-600 rounded-lg p-1 group"
            aria-label="AccessBridge AI Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-bridge-700 to-bridge-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-yellow-300" aria-hidden="true" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                AccessBridge <span className="text-bridge-600 dark:text-bridge-400">AI</span>
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide">
                One digital bridge. Every way to understand.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-bridge-500 ${
                    active
                      ? 'bg-bridge-50 dark:bg-bridge-950/50 text-bridge-700 dark:text-bridge-300 border-b-2 border-bridge-600'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-bridge-600 dark:text-bridge-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Controls & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                  aria-label="User profile settings"
                >
                  <User className="w-3.5 h-3.5 text-bridge-600" aria-hidden="true" />
                  <span className="max-w-[120px] truncate">{user?.name || 'My Profile'}</span>
                </Link>
                <button
                  onClick={logout}
                  aria-label="Sign out of your account"
                  className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 focus:ring-2 focus:ring-blue-500"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={demoLogin}
                  aria-label="One-click Demo Evaluator Login"
                  className="px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold shadow-sm transition focus:ring-2 focus:ring-yellow-600"
                >
                  ⚡ Demo Mode
                </button>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-blue-500"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-bridge-600 hover:bg-bridge-700 text-white text-xs font-bold shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {!isAuthenticated && (
              <button
                onClick={demoLogin}
                className="px-2.5 py-1 bg-yellow-400 text-black text-xs font-bold rounded"
                aria-label="Demo login"
              >
                ⚡ Demo
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-bridge-500"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile Navigation Drawer"
          className="md:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 pt-3 pb-5 space-y-2 shadow-xl"
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  active
                    ? 'bg-bridge-50 dark:bg-bridge-950/50 text-bridge-700 dark:text-bridge-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <div>
                  <div className="font-bold">{link.label}</div>
                  <div className="text-xs text-slate-500">{link.desc}</div>
                </div>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-bridge-700 dark:text-bridge-300"
                >
                  Profile: {user?.name}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-bold px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-bold border border-slate-300 dark:border-zinc-700 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-bold bg-bridge-600 text-white rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
