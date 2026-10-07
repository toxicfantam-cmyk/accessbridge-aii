/**
 * Web Speech API Speech-to-Text (STT) Recognition Service
 * Supports continuous speech recognition with interim real-time results.
 */

class STTService {
  constructor() {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    this.SpeechRecognition = SpeechRecognition;
    this.recognitionInstance = null;
    this.isListening = false;
  }

  isSupported() {
    return Boolean(this.SpeechRecognition);
  }

  startListening({
    lang = 'en-US',
    continuous = true,
    interimResults = true,
    onResult,
    onError,
    onStart,
    onEnd
  }) {
    if (!this.isSupported()) {
      if (onError) {
        onError({
          error: 'not-supported',
          message: 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or use keyboard input.'
        });
      }
      return null;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      const recognition = new this.SpeechRecognition();
      recognition.lang = lang;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        this.isListening = true;
        if (onStart) onStart();
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        if (onResult) {
          onResult({
            finalTranscript,
            interimTranscript,
            fullText: (finalTranscript || interimTranscript).trim()
          });
        }
      };

      recognition.onerror = (event) => {
        console.warn('[STT] Speech recognition warning/error:', event.error);
        if (onError) {
          onError({
            error: event.error,
            message: this.getErrorMessage(event.error)
          });
        }
      };

      recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognitionInstance = recognition;
      recognition.start();
      return recognition;
    } catch (err) {
      console.error('[STT] Failed to start recognition:', err);
      if (onError) onError({ error: 'initialization-failed', message: err.message });
      return null;
    }
  }

  stopListening() {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch (err) {
        // Ignore already stopped errors
      }
      this.recognitionInstance = null;
    }
    this.isListening = false;
  }

  getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'not-allowed':
        return 'Microphone permission was denied. Please allow microphone access in your browser settings.';
      case 'no-speech':
        return 'No speech detected. Please speak clearly into the microphone.';
      case 'audio-capture':
        return 'No microphone was found or audio capture failed.';
      case 'network':
        return 'Speech recognition network connection error.';
      default:
        return `Speech recognition error: ${errorCode}`;
    }
  }
}

export const stt = new STTService();
export default stt;
