# 🌉 AccessBridge AI
> **"One digital bridge. Every way to understand."**

[![WCAG 2.1 AAA Target](https://img.shields.io/badge/Accessibility-WCAG_2.1_AAA_Target-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
[![AI Model](https://img.shields.io/badge/AI_Engine-Gemini_1.5_Flash-4285F4.svg)](https://deepmind.google/technologies/gemini/)
[![Framework](https://img.shields.io/badge/Frontend-React_18_+_Vite_+_Tailwind-38B2AC.svg)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js_+_Express_+_MongoDB-68A063.svg)](https://expressjs.com/)
[![Assistive Audio](https://img.shields.io/badge/Audio-Web_Speech_API_TTS%2FSTT-FF6B6B.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

An adaptive multimodal AI accessibility layer that transforms dense, complex digital information (PDFs, images of letters, bureaucratic documents, legal jargon) into the exact sensory and cognitive format a user needs based on their visual, cognitive, hearing, or language profile.

---

## 🌟 Hackathon 2-Minute Pitch & Judge Demo Guide

### The Problem
Over **1.3 billion people** globally live with cognitive disabilities, low vision, dyslexia, or language barriers. Crucial notices—such as eviction warnings, medical prescriptions, and disability benefits deadlines—are written in impenetrable bureaucratic jargon. Missing a single deadline can be life-altering.

### The Solution: AccessBridge AI
AccessBridge AI breaks down these barriers through four core innovations:
1. **Multimodal AI Transformation Engine**: Upload any PDF notice, photo of a letter, or pasted text. Powered by Google Gemini 1.5 Flash with strict structured JSON output, it extracts a 2-sentence summary, bulleted **Easy Read (B1/B2 English)** points, and structured cards for **Deadlines, Required Actions, and Physical/Digital Locations**.
2. **Grounded Document Q&A**: An attached conversational interface allowing users to ask natural questions. The AI is strictly prompt-engineered to answer **only** from the uploaded file context, preventing hallucinations.
3. **Two-Way Communication Bridge**: A split-screen interface where User A speaks using Speech-to-Text (`Web Speech API`), Gemini simplifies and translates the phrasing, and User B receives instant Text-to-Speech audio output (`SpeechSynthesis`) and high-legibility visual captions.
4. **Dynamic Adaptive Sensory Profiles (WCAG AAA)**: Users select their needs (Visual, Cognitive, Hearing, Language). The UI dynamically adapts in real-time using React Context and CSS variables—featuring 7:1+ High Contrast Dark/Light modes, dyslexia-friendly typography, reading rulers, and text scaling.

---

## 🏗️ Architecture & Monorepo Structure

```
accessbridge-ai/
├── client/                     # React 18 + Vite + Tailwind CSS Frontend
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── AccessibilityBar.jsx      # Sticky/floating real-time contrast & font controls
│   │   │   ├── DocumentQA.jsx            # Document-grounded Q&A chat with voice input
│   │   │   ├── Footer.jsx                # Semantic footer with WCAG AAA conformance
│   │   │   ├── GlobalTTSPlayer.jsx       # Floating audio player with sentence highlights
│   │   │   ├── LoadingSkeleton.jsx       # Accessible animated skeleton with aria-live
│   │   │   ├── Navbar.jsx                # Semantic header with skip links & responsive menu
│   │   │   └── TransformationResult.jsx  # Tabbed [Original] | [Easy Read] | [Key Info] | [Translation]
│   │   ├── context/
│   │   │   ├── AccessibilityContext.jsx  # Global sensory state, CSS variables & announcer
│   │   │   └── AuthContext.jsx           # JWT auth, user profile sync & 1-click demo login
│   │   ├── pages/
│   │   │   ├── CommunicationBridgePage.jsx # Split-screen two-way speech-to-text bridge
│   │   │   ├── DashboardPage.jsx           # Synthesized document library & metrics
│   │   │   ├── LandingPage.jsx             # Hero with live interactive adaptation sandbox
│   │   │   ├── LoginPage.jsx               # Accessible sign in with 1-click demo evaluator
│   │   │   ├── OnboardingPage.jsx          # 4-step sensory profile wizard with live preview
│   │   │   ├── ProfileSettingsPage.jsx     # Full account & sensory settings management
│   │   │   ├── RegisterPage.jsx            # Account creation with accessible inputs
│   │   │   └── TransformWizardPage.jsx     # Drag-and-drop PDF/image/text upload engine
│   │   ├── services/
│   │   │   ├── api.js                      # Axios instance with JWT interceptor
│   │   │   ├── sttService.js               # Web Speech API SpeechRecognition wrapper
│   │   │   └── ttsService.js               # Web Speech API SpeechSynthesis with sentence chunking
│   │   ├── App.jsx                         # Main router & provider tree
│   │   ├── index.css                       # WCAG AAA themes, reading ruler, and typography
│   │   └── main.jsx                        # React root entry
│   ├── index.html                          # Semantic HTML5 shell with skip link
│   ├── package.json                        # Frontend dependencies
│   ├── tailwind.config.js                  # Accessible color tokens & typography
│   └── vite.config.js                      # Vite development config (port 5173)
├── server/                     # Node.js + Express + Mongoose Backend
│   ├── controllers/
│   │   ├── authController.js       # Register, login, demo evaluator login, profile update
│   │   ├── chatController.js       # Document-grounded Q&A queries
│   │   ├── commController.js       # Two-way communication simplification & translation
│   │   └── transformController.js  # File/text upload processing with Gemini 1.5 Flash
│   ├── middleware/
│   │   ├── auth.js                 # JWT Bearer token verification (required & optional)
│   │   └── upload.js               # Multer memory storage (PDF, Image, Text up to 15MB)
│   ├── models/
│   │   ├── Chat.js                 # TransformationId, role, content
│   │   ├── Transformation.js       # Document metadata, summary, easyRead, keyInfo, translation
│   │   └── User.js                 # Name, email, passwordHash, sensory preferences
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── chatRoutes.js           # /api/chat
│   │   ├── commRoutes.js           # /api/communicate
│   │   └── transformRoutes.js      # /api/transform
│   ├── services/
│   │   └── geminiService.js        # Gemini 1.5 Flash integration with structured JSON schema
│   ├── .env.example                # Backend environment template
│   ├── package.json                # Server dependencies
│   └── server.js                   # Express initialization, CORS, DB & routes
├── package.json                    # Monorepo root scripts
└── README.md                       # Comprehensive guide
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (optional local instance or MongoDB Atlas connection; if not running, backend operates in resilient demo mode)
- **Google Gemini API Key** (optional; app includes intelligent offline simulation if key is not yet set)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
cd accessbridge-ai

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables
In `server/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/accessbridge
JWT_SECRET=accessbridge_super_secret_jwt_key_2026_hackathon_secure
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

In `client/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Launch Development Servers
Run the backend:
```bash
cd server
npm run dev
# Backend runs at http://localhost:5001
```

Run the frontend (in another terminal):
```bash
cd client
npm run dev
# Frontend runs at http://localhost:5173
```

Or from the root directory:
```bash
npm run server  # Terminal 1
npm run client  # Terminal 2
```

---

## 🧠 AI Prompt Architecture & Schema

When analyzing documents, AccessBridge AI forces Gemini 1.5 Flash to respond with strict JSON (`response_mime_type: "application/json"`):

```json
{
  "summary": "A 2-sentence summary",
  "easyRead": [
    "Short active-voice sentence 1",
    "Short active-voice sentence 2"
  ],
  "keyInformation": {
    "deadlines": ["Submit proof within 21 calendar days"],
    "locations": ["Municipal Housing Arbitration Tribunal, 450 Commerce Plaza"],
    "actions": ["Submit gross household revenue documents"]
  },
  "suggestedQuestions": [
    "What happens if I miss the 21-day deadline?",
    "Where is Room 302 located?"
  ],
  "translation": "Translated summary and actions if target language is not English"
}
```

### Document Q&A Grounding
The attached chat assistant is constrained by system prompts to answer **only** based on the uploaded file:
> *"CRITICAL RULE: You must answer based ONLY on the uploaded document context below. If the answer cannot be found in the document, reply with: 'I checked the document, but this information is not mentioned. Please check with the document issuer or contact support.' Do not speculate or bring in outside knowledge."*

---

## ♿ WCAG 2.1 AAA Accessibility Features

| Feature | Implementation Details |
| :--- | :--- |
| **Color Contrast** | Four selectable themes including **Dark AAA (Black #000 + Yellow #FF0)** and **Light AAA** exceeding 7:1 contrast ratios. |
| **Dyslexia Typography** | High-legibility font modes (`Atkinson Hyperlegible` / `OpenDyslexic`) with custom letter and word spacing tokens. |
| **Reading Ruler** | A cursor-following visual tint bar to maintain focus and guide line-by-line reading for individuals with ADHD or dyslexia. |
| **Visible Focus Indicators** | Universal visible focus rings (`focus:ring-2 focus:ring-blue-500` and high-contrast yellow in dark mode) on every interactive element. |
| **Screen Reader Support** | Polite live region announcements (`aria-live="polite"`), explicit `<label htmlFor="...">` matching, semantic HTML5 tags (`<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`), and keyboard tab navigation. |
| **Native Web Speech Audio** | Speech-to-Text and chunked Text-to-Speech playback with speed controls (0.75x to 2x), eliminating arbitrary browser speech timeouts. |

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user with hashed password & preferences | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `POST` | `/api/auth/demo` | Instant 1-click demo login for judges | No |
| `GET` | `/api/auth/profile` | Retrieve active user profile | Bearer JWT |
| `PUT` | `/api/auth/preferences` | Update sensory & cognitive preferences | Bearer JWT |
| `POST` | `/api/transform` | Upload PDF/image/text file via Multer & process with Gemini | Optional JWT |
| `GET` | `/api/transform` | Retrieve user transformation history | Bearer JWT |
| `GET` | `/api/transform/:id` | Get specific transformation record | Optional JWT |
| `DELETE` | `/api/transform/:id` | Delete transformation record | Bearer JWT |
| `GET` | `/api/chat/:transformationId` | Retrieve chat history for document | Optional JWT |
| `POST` | `/api/chat/:transformationId` | Ask grounded question about document | Optional JWT |
| `POST` | `/api/communicate/bridge` | Two-way communication simplification & translation | Optional JWT |
| `GET` | `/api/health` | Service health, Gemini status & DB connectivity | No |

---

## 👥 Hackathon Team & Acknowledgements
- Built for the **Global AI Hackathon 2026**
- Dedicated to the millions of neurodivergent, visually impaired, deaf, and ESL individuals navigating daily digital barriers.
- Licensed under the **MIT License**.
