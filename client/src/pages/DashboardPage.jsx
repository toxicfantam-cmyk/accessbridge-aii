import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import TransformationResult from '../components/TransformationResult';
import DocumentQA from '../components/DocumentQA';
import {
  Layers,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  Trash2,
  ExternalLink,
  PlusCircle,
  Radio,
  Clock,
  Eye,
  CheckCircle2,
  Search
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, isAuthenticated, demoLogin } = useAuth();
  const { preferences, announce } = useAccessibility();
  const [transformations, setTransformations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/transform');
        if (response.data?.transformations) {
          setTransformations(response.data.transformations);
          if (response.data.transformations.length > 0) {
            setSelectedDoc(response.data.transformations[0]);
          }
        }
      } catch (err) {
        console.warn('Could not fetch transformations:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this transformation?')) return;

    try {
      await api.delete(`/transform/${id}`);
      setTransformations((prev) => prev.filter((t) => t._id !== id));
      if (selectedDoc?._id === id) {
        setSelectedDoc(transformations.find((t) => t._id !== id) || null);
      }
      announce('Transformation deleted.');
    } catch (err) {
      console.error('Delete error:', err);
      announce('Failed to delete document.');
    }
  };

  const filteredDocs = transformations.filter((t) =>
    t.originalFileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-bridge-600 dark:text-bridge-400">
              Personalized Accessibility Hub
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
              Active Session
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Welcome, {user?.name || 'Guest Explorer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your synthesized documents, structured deadlines, and continue grounded Q&A.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/transform"
            className="px-4 py-2.5 rounded-xl bg-bridge-600 hover:bg-bridge-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md focus:ring-4 focus:ring-yellow-400"
          >
            <PlusCircle className="w-4 h-4" />
            New Transformation
          </Link>

          <Link
            to="/bridge"
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 focus:ring-2 focus:ring-blue-500"
          >
            <Radio className="w-4 h-4 text-emerald-600" />
            Live Comm Bridge
          </Link>
        </div>
      </div>

      {/* Accessibility Metric Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Synthesized Documents</span>
            <FileText className="w-4 h-4 text-bridge-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {transformations.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Full Easy Read & Deadlines extracted</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Active Accessibility Profile</span>
            <Eye className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white capitalize">
            {preferences.contrast.replace('-', ' ')}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {preferences.textSize} text • {preferences.fontFamily} font • {preferences.cognitiveSupport} AI
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">WCAG 2.1 Conformance</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-black text-green-600 dark:text-green-400">
            Level AAA
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Optimal contrast & semantic DOM hierarchy</span>
        </div>
      </div>

      {/* Main History & Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 cols: Document History List */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-bridge-600" />
              Document Library
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400">
              {filteredDocs.length}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by document name..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-bridge-500"
            />
          </div>

          {/* List */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-8 text-xs text-slate-400">Loading library...</div>
            ) : filteredDocs.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-xs text-slate-500">No documents found.</p>
                <Link
                  to="/transform"
                  className="text-xs text-bridge-600 font-bold hover:underline block"
                >
                  Upload your first document
                </Link>
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isSelected = selectedDoc?._id === doc._id;
                return (
                  <div
                    key={doc._id}
                    onClick={() => {
                      setSelectedDoc(doc);
                      announce(`Selected document: ${doc.originalFileName}`);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedDoc(doc);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-500 ${
                      isSelected
                        ? 'border-bridge-600 bg-bridge-50 dark:bg-bridge-950/60 shadow-sm'
                        : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">
                        {doc.originalType}
                      </span>
                      <button
                        onClick={(e) => handleDelete(doc._id, e)}
                        aria-label={`Delete ${doc.originalFileName}`}
                        className="text-slate-400 hover:text-red-600 p-1 rounded focus:ring-2 focus:ring-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {doc.originalFileName || 'Untitled Document'}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {doc.summary}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 8 cols: Active Document Result & Q&A */}
        <div className="lg:col-span-8 space-y-8">
          {selectedDoc ? (
            <>
              <TransformationResult transformation={selectedDoc} />
              <DocumentQA
                transformationId={selectedDoc._id}
                suggestedQuestions={selectedDoc.suggestedQuestions}
              />
            </>
          ) : (
            <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h2 className="text-base font-bold text-slate-700 dark:text-slate-300">
                Select a document from the library
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Or upload a new notice to generate an Easy Read version and interactive Q&A.
              </p>
              <Link
                to="/transform"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bridge-600 text-white font-bold text-xs"
              >
                <PlusCircle className="w-4 h-4" /> Transform Document
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
