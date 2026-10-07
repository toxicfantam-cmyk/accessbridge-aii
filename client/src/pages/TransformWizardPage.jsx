import React, { useState, useRef } from 'react';
import api from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import TransformationResult from '../components/TransformationResult';
import DocumentQA from '../components/DocumentQA';
import LoadingSkeleton from '../components/LoadingSkeleton';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
  Globe2,
  Brain,
  FileCode,
  RotateCcw
} from 'lucide-react';

export const TransformWizardPage = () => {
  const { preferences, announce, speakText } = useAccessibility();
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState(preferences.preferredLanguage || 'en');
  const [cognitiveSupport, setCognitiveSupport] = useState(preferences.cognitiveSupport || 'simplified');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transformation, setTransformation] = useState(null);
  const fileInputRef = useRef(null);

  const sampleTemplates = [
    {
      title: 'Legal Housing Notice',
      type: 'text',
      content: `Notice of Mandatory Tenancy Re-Certification: In accordance with Subsection 4.8 of Municipal Directive 109, all residing tenants must provide certified verification of household gross revenue within twenty-one (21) calendar days of notice receipt. Failure to supply certified documentation shall result in forfeiture of subsidy allocations and immediate initiation of tenancy review proceedings at the Municipal Housing Arbitration Tribunal, 450 Commerce Plaza, Room 302.`
    },
    {
      title: 'Medical Discharge Order',
      type: 'text',
      content: `Patient Post-Procedure Protocol: Cease non-steroidal anti-inflammatory medication (NSAIDs) for a duration of seven days post-arthroscopy. Dressing must remain desiccated and sterilized until clinical inspection on October 24th at St. Jude Ambulatory Clinic, Suite 410. In the event of acute pyrexia exceeding 101.5°F or peripheral erythema, present forthwith to the emergency evaluation department.`
    },
    {
      title: 'Financial Loan Term Sheet',
      type: 'text',
      content: `Variable Rate Consumer Credit Facility: The introductory annual percentage rate (APR) of 4.25% will amortize into a prime-adjusted floating tier calculated at WSJ Prime plus 3.85% effective on the second anniversary of origination. Minimum monthly remittances are due punctually by 5:00 PM EST on the 1st day of each billing cycle to avoiding incurring a $39 delinquency surcharge.`
    }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    setError('');
    setSelectedFile(file);
    setPastedText('');
    announce(`File selected: ${file.name}, size ${(file.size / 1024).toFixed(1)} kilobytes.`);
  };

  const handleSampleClick = (template) => {
    setError('');
    setSelectedFile(null);
    setPastedText(template.content);
    announce(`Loaded sample: ${template.title}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !pastedText.trim()) {
      setError('Please choose a file (PDF, Image, Text) or paste document text.');
      announce('Error: Please choose a file or paste document text.');
      return;
    }

    setError('');
    setLoading(true);
    setTransformation(null);
    announce('Processing document with Gemini 1.5 Flash accessibility engine...');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      if (pastedText.trim()) {
        formData.append('text', pastedText.trim());
      }
      formData.append('targetLanguage', targetLanguage);
      formData.append('cognitiveSupport', cognitiveSupport);

      const response = await api.post('/transform', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.transformation) {
        setTransformation(response.data.transformation);
        announce('Transformation complete. Results are now available.');

        // If user has autoTTS turned on, speak the summary immediately
        if (preferences.autoTTS) {
          speakText(response.data.transformation.summary);
        }
      }
    } catch (err) {
      console.error('Transform Error:', err);
      const msg = err.response?.data?.message || 'Failed to transform document. Please try again.';
      setError(msg);
      announce(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPastedText('');
    setTransformation(null);
    setError('');
    announce('Form reset.');
  };

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bridge-100 dark:bg-bridge-950 text-bridge-800 dark:text-bridge-300 text-xs font-bold mb-3 border border-bridge-200 dark:border-bridge-800">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" aria-hidden="true" />
          The Core Transformation Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Transform Complex Documents into Accessible Formats
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Upload any PDF notice, take a picture of a letter, or paste text to generate Plain English Easy Read, structured deadlines, and adaptive translations.
        </p>
      </div>

      {/* Upload & Input Wizard Form (Visible when not transformed or user wants to re-run) */}
      {!transformation && (
        <div className="bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              aria-label="Upload document area. Press Enter or Space to open file browser."
              className={`border-3 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition focus:outline-none focus:ring-4 focus:ring-bridge-500 ${
                isDragging
                  ? 'border-bridge-600 bg-bridge-50 dark:bg-bridge-950/40 scale-[1.01]'
                  : selectedFile
                  ? 'border-green-500 bg-green-50/30 dark:bg-green-950/20'
                  : 'border-slate-300 dark:border-zinc-700 hover:border-bridge-500 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="file-upload-input"
                accept=".pdf,image/png,image/jpeg,image/webp,text/plain"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
                aria-hidden="true"
              />

              <div className="max-w-md mx-auto space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-bridge-100 dark:bg-bridge-950 text-bridge-600 dark:text-bridge-300 mx-auto flex items-center justify-center shadow-inner">
                  {selectedFile ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" aria-hidden="true" />
                  ) : (
                    <UploadCloud className="w-8 h-8" aria-hidden="true" />
                  )}
                </div>

                {selectedFile ? (
                  <div>
                    <span className="font-extrabold text-base text-slate-900 dark:text-white block">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Click or drop to replace
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white block">
                      Drag & Drop PDF, Image, or Text file here
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                      Supports PDF documents, scanned notices (PNG/JPG), and text files up to 15MB
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Divider or Direct Text Paste */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-zinc-800 w-full" />
              <span className="bg-white dark:bg-zinc-900 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Or Paste Plain Text Below
              </span>
              <div className="border-t border-slate-200 dark:border-zinc-800 w-full" />
            </div>

            <div>
              <label
                htmlFor="pasted-text-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2"
              >
                Direct Document Text Paste:
              </label>
              <textarea
                id="pasted-text-input"
                rows={4}
                value={pastedText}
                onChange={(e) => {
                  setPastedText(e.target.value);
                  if (e.target.value.trim()) setSelectedFile(null);
                }}
                placeholder="Paste complex notices, legal clauses, medical orders, or insurance policy text here..."
                className="w-full p-4 rounded-2xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-bridge-500 placeholder-slate-400"
              />
            </div>

            {/* Quick Demo Templates */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                ⚡ Try One-Click Hackathon Sample Documents:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {sampleTemplates.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSampleClick(t)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/60 hover:bg-bridge-50 dark:hover:bg-bridge-950/40 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-bridge-500 transition focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="font-bold flex items-center gap-1.5 text-bridge-700 dark:text-bridge-300 mb-1">
                      <FileCode className="w-3.5 h-3.5" />
                      {t.title}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{t.content}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Language and Cognitive Support Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label
                  htmlFor="wizard-target-language"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5"
                >
                  <Globe2 className="w-4 h-4 text-bridge-600" />
                  Target Translation Language:
                </label>
                <select
                  id="wizard-target-language"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-bridge-500"
                >
                  <option value="en">English (Default)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="fr">Français (French)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="zh">中文 (Chinese)</option>
                  <option value="ar">العربية (Arabic)</option>
                  <option value="pt">Português (Portuguese)</option>
                  <option value="tl">Tagalog (Filipino)</option>
                  <option value="vi">Tiếng Việt (Vietnamese)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="wizard-cognitive-level"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5"
                >
                  <Brain className="w-4 h-4 text-purple-600" />
                  Cognitive Assistance Level:
                </label>
                <select
                  id="wizard-cognitive-level"
                  value={cognitiveSupport}
                  onChange={(e) => setCognitiveSupport(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-purple-500"
                >
                  <option value="standard">Standard Synthesis</option>
                  <option value="simplified">Easy Read (B1/B2 English)</option>
                  <option value="maximum">Maximum Cognitive Support</option>
                </select>
              </div>
            </div>

            {/* Error Message with aria-live */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-red-800 dark:text-red-200 text-xs font-bold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-bridge-600 hover:bg-bridge-700 disabled:opacity-50 text-white font-extrabold text-base shadow-xl shadow-bridge-500/25 hover:shadow-bridge-500/35 transition flex items-center justify-center gap-2 focus:ring-4 focus:ring-yellow-400"
              >
                <Sparkles className="w-5 h-5 text-yellow-300" aria-hidden="true" />
                {loading ? 'Synthesizing with Gemini 1.5 Flash...' : 'Generate Accessible Transformation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="max-w-4xl mx-auto">
          <LoadingSkeleton label="Gemini 1.5 Flash is extracting text, generating B1/B2 Easy Read points, and structuring deadlines..." />
        </div>
      )}

      {/* Result Section & Attached Document Q&A */}
      {transformation && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Transformation Completed
            </h2>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Transform Another Document
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Tabbed Results */}
            <div className="lg:col-span-7">
              <TransformationResult transformation={transformation} />
            </div>

            {/* Right 5 cols: Document Q&A Chat */}
            <div className="lg:col-span-5 sticky top-24">
              <DocumentQA
                transformationId={transformation._id}
                suggestedQuestions={transformation.suggestedQuestions}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TransformWizardPage;
