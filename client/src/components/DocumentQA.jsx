import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import stt from '../services/sttService';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Bot,
  User,
  Loader2
} from 'lucide-react';

export const DocumentQA = ({ transformationId, suggestedQuestions = [] }) => {
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { speakText, announce } = useAccessibility();
  const chatBottomRef = useRef(null);

  // Fetch initial chat history
  useEffect(() => {
    if (!transformationId) return;

    const fetchHistory = async () => {
      try {
        const response = await api.get(`/chat/${transformationId}`);
        if (response.data?.messages) {
          setMessages(response.data.messages);
        }
      } catch (err) {
        console.warn('Could not load chat history:', err.message);
      }
    };

    fetchHistory();
  }, [transformationId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async (questionText = inputQuestion) => {
    const q = questionText.trim();
    if (!q || loading || !transformationId) return;

    setInputQuestion('');
    setLoading(true);
    announce(`Asking: ${q}`);

    // Optimistic user message
    const tempUserMsg = { role: 'user', content: q, _id: Date.now().toString() };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await api.post(`/chat/${transformationId}`, {
        question: q
      });

      if (response.data?.answer) {
        const modelMsg = {
          role: 'model',
          content: response.data.answer,
          _id: (Date.now() + 1).toString()
        };
        setMessages((prev) => [...prev, modelMsg]);
        announce(`AI answered: ${response.data.answer.slice(0, 100)}`);
      }
    } catch (err) {
      console.error('Q&A Error:', err);
      const errorMsg = {
        role: 'model',
        content: 'I could not retrieve an answer at this moment. Please check your network or try again.',
        _id: (Date.now() + 1).toString(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stt.stopListening();
      setIsListening(false);
      announce('Microphone stopped.');
      return;
    }

    if (!stt.isSupported()) {
      alert('Speech-to-text is not supported by your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setIsListening(true);
    announce('Listening. Please speak your question now.');

    stt.startListening({
      lang: 'en-US',
      onResult: ({ fullText }) => {
        setInputQuestion(fullText);
      },
      onError: (err) => {
        setIsListening(false);
        announce(`Microphone error: ${err.message}`);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  return (
    <div
      role="region"
      aria-label="Document Question and Answer"
      className="bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-md flex flex-col h-[580px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-bridge-600" aria-hidden="true" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Ask About This Document
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          Grounded strictly to uploaded content
        </div>
      </div>

      {/* Suggested Questions */}
      {suggestedQuestions && suggestedQuestions.length > 0 && (
        <div className="pt-3 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
            Suggested Quick Inquiries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAsk(q)}
                disabled={loading}
                className="px-3 py-1 text-xs rounded-full bg-slate-100 hover:bg-bridge-50 dark:bg-zinc-800 dark:hover:bg-bridge-950/40 text-slate-700 dark:text-slate-300 hover:text-bridge-700 dark:hover:text-bridge-300 border border-slate-200 dark:border-zinc-700 transition focus:ring-2 focus:ring-blue-500 text-left"
              >
                💡 {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        className="flex-1 overflow-y-auto my-3 space-y-4 pr-1"
        aria-live="polite"
        role="log"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
            <Bot className="w-10 h-10 mb-2 opacity-50 text-bridge-600" aria-hidden="true" />
            <p className="text-sm font-medium">
              No questions asked yet. Ask about deadlines, required actions, or eligibility criteria.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg._id || index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-bridge-100 dark:bg-bridge-950/60 text-bridge-700 dark:text-bridge-300 flex items-center justify-center shrink-0 border border-bridge-200 dark:border-bridge-800">
                    <Bot className="w-4 h-4" aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-sm ${
                    isUser
                      ? 'bg-bridge-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                      {isUser ? 'You' : 'Document Assistant'}
                    </span>
                    {!isUser && (
                      <button
                        onClick={() => speakText(msg.content)}
                        aria-label="Listen to this answer aloud"
                        className="text-xs p-1 text-slate-500 hover:text-bridge-600 dark:hover:text-bridge-400 focus:ring-2 focus:ring-blue-500 rounded"
                        title="Listen aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" aria-hidden="true" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl text-xs text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-bridge-600" aria-hidden="true" />
            <span>Analyzing document context for your answer...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Form with Accessible Labels and Voice STT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="pt-2 border-t border-slate-200 dark:border-zinc-800"
      >
        <div className="flex items-center gap-2">
          <label htmlFor="qa-input" className="sr-only">
            Type or speak your question about the uploaded document
          </label>
          <input
            id="qa-input"
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder={isListening ? 'Listening to speech...' : 'Type a question or click the microphone...'}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-bridge-500 placeholder-slate-400"
          />

          {/* Voice Microphone Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            aria-label={isListening ? 'Stop listening' : 'Speak question using microphone'}
            className={`p-2.5 rounded-xl border transition ${
              isListening
                ? 'bg-red-500 text-white border-red-600 animate-pulse'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-zinc-700 hover:bg-slate-200'
            } focus:ring-2 focus:ring-blue-500`}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Mic className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={loading || !inputQuestion.trim()}
            aria-label="Send question"
            className="p-2.5 bg-bridge-600 hover:bg-bridge-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition focus:ring-2 focus:ring-blue-500"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentQA;
