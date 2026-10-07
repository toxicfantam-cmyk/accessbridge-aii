/**
 * Native Web Speech API Text-to-Speech (TTS) Service
 * Features sentence chunking to prevent browser speech cutoff on long texts.
 */

class TTSService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.voices = [];
    this.isPlaying = false;
    this.isPaused = false;
    this.activeChunkIndex = 0;
    this.chunks = [];
    this.listeners = new Set();

    if (this.synth) {
      this.loadVoices();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  isSupported() {
    return Boolean(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }

  loadVoices() {
    if (!this.synth) return [];
    this.voices = this.synth.getVoices();
    return this.voices;
  }

  getVoices() {
    if (!this.voices.length && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(state) {
    this.listeners.forEach((fn) => fn(state));
  }

  splitIntoSentenceChunks(text) {
    if (!text) return [];
    // Split by punctuation without losing context
    const cleanText = text.replace(/[\r\n]+/g, ' ').trim();
    const sentenceRegex = /[^.!?]+[.!?]+|\s*[^.!?]+$/g;
    const matches = cleanText.match(sentenceRegex);
    return matches ? matches.map((s) => s.trim()).filter((s) => s.length > 0) : [cleanText];
  }

  speak(text, options = {}) {
    if (!this.isSupported()) {
      console.warn('[TTS] Web Speech API is not supported in this browser.');
      return;
    }

    this.stop();

    if (!text || text.trim() === '') return;

    const {
      rate = 1.0,
      pitch = 1.0,
      lang = 'en-US',
      voiceURI = null,
      onProgress = null,
      onFinish = null
    } = options;

    this.chunks = this.splitIntoSentenceChunks(text);
    this.activeChunkIndex = 0;
    this.isPlaying = true;
    this.isPaused = false;

    this.notify({
      isPlaying: true,
      isPaused: false,
      text,
      currentChunk: this.chunks[0],
      chunkIndex: 0,
      totalChunks: this.chunks.length
    });

    const speakNext = () => {
      if (this.activeChunkIndex >= this.chunks.length) {
        this.isPlaying = false;
        this.isPaused = false;
        this.notify({ isPlaying: false, isPaused: false, currentChunk: '' });
        if (onFinish) onFinish();
        return;
      }

      const chunkText = this.chunks[this.activeChunkIndex];
      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = lang;

      const voices = this.getVoices();
      if (voiceURI) {
        const selectedVoice = voices.find((v) => v.voiceURI === voiceURI);
        if (selectedVoice) utterance.voice = selectedVoice;
      } else {
        // Prefer natural or high quality English voice by default
        const preferredVoice = voices.find(
          (v) => v.lang.startsWith(lang.slice(0, 2)) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri'))
        ) || voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        this.activeChunkIndex += 1;
        if (onProgress) {
          onProgress(this.activeChunkIndex, this.chunks.length, this.chunks[this.activeChunkIndex]);
        }
        this.notify({
          isPlaying: true,
          isPaused: false,
          currentChunk: this.chunks[this.activeChunkIndex] || '',
          chunkIndex: this.activeChunkIndex,
          totalChunks: this.chunks.length
        });
        speakNext();
      };

      utterance.onerror = (err) => {
        console.warn('[TTS] Speech error or cancelled:', err);
        this.isPlaying = false;
        this.isPaused = false;
        this.notify({ isPlaying: false, isPaused: false, currentChunk: '' });
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    };

    speakNext();
  }

  pause() {
    if (this.synth && this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notify({ isPlaying: true, isPaused: true });
    }
  }

  resume() {
    if (this.synth && this.isPlaying && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify({ isPlaying: true, isPaused: false });
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      this.isPaused = false;
      this.chunks = [];
      this.activeChunkIndex = 0;
      this.notify({ isPlaying: false, isPaused: false, currentChunk: '' });
    }
  }
}

export const tts = new TTSService();
export default tts;
