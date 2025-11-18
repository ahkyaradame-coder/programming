# CodeLearn Codebase Guide for AI Agents

## Project Overview
CodeLearn is a full-stack, interactive programming education platform with a landing page, authentication, course browsing, membership/payment integration, and an embedded AI tutor. The architecture separates frontend (vanilla JS) from backend (Express + PayPal), using localStorage for demo persistence.

## Architecture & Key Components

### Frontend Structure (`index.html`, `script.js`, `style.css`)
- **Single-page site** with smooth scrolling sections: hero → courses → features → pricing → FAQ → contact → feedback
- **Course Grid**: 18 hardcoded courses in `script.js` filtered by search and level. Real implementation would fetch from API
- **Dark mode**: Dimmer overlay (0-95% opacity) controlled via D/L keys and buttons, persisted to localStorage
- **Internationalization**: English/Arabic translations in `TRANSLATIONS` object; dynamically applies direction (LTR/RTL) and text

### Authentication Flow
- **Mock localStorage-based auth** via `window.Auth` object with methods: `getCurrentUser()`, `signInWithEmail()`, `signInWithGoogle()`, `signOut()`
- User data includes: `name`, `email`, `provider`, optional `avatar` (data URL), and `subscription` object
- Login page (`login.html`) is separate; redirects back to index.html after auth
- Header updates via `updateUserArea()` which renders user avatar, subscription badge, and logout button

### Payment & Subscription
- **PayPal integration** on pricing section: `/api/create-order` → `/api/capture-order` (server handles tokenization)
- Subscription stored as `user.subscription = { plan: 'annual', price: 100, expires: ISO date string }`
- **Discount wheel**: Random 8-slot wheel (10%–50% off, or FREE). Spin cooldown = 1 hour (localStorage tracked)
- Applied discounts stored in localStorage and used at checkout

### AI Tutor
- **Chat modal** (`#aiTutor`) with message history and form; keyboard shortcut T to toggle
- **Flow**: User question → `aiAsk()` → POST to `/api/ai` (server expects `{messages}` format, returns `{reply}` or OpenAI format)
- **Fallback**: On server error, uses `cannedAiResponse()` with pattern matching (e.g., "exercise", "array") for offline demo
- Messages displayed as user/AI bubbles with auto-scroll

### Backend (`server.js`)
- **Express server** on PORT (default 3000); serves static files and JSON API routes
- **PayPal endpoints**: `/api/config` (client ID), `/api/create-order`, `/api/capture-order`
- **AI proxy**: `/api/ai` expects `{messages}` array, forwards to OpenAI if `OPENAI_API_KEY` set, else returns error (client falls back to canned)
- **Webhook**: `/webhook` logs incoming PayPal events (signature verification TODO)

### Data Persistence
- **localStorage keys**: `authUser` (JSON user), `siteLang` (en/ar), `site-dimmer-opacity` (0–0.95), `siteFeedback` (JSON array), `wheelHasSpun`, `wheelLastSpinTime`, `wheelDiscount`
- **No backend DB**: All demo data is ephemeral; production must migrate to persistent storage

## Developer Workflows 

### Local Development
```bash
npm install
PAYPAL_CLIENT_ID=xxx PAYPAL_SECRET=yyy node server.js
# Open http://localhost:3000
```

### Adding Features
- **New course data**: Edit `courses` array in `script.js`, or wire `/api/courses` endpoint
- **Custom AI responses**: Expand `cannedAiResponse()` pattern matching; or set up OpenAI key on server
- **Authentication**: Replace mock `Auth` object with real OAuth/session-based auth via `/api/auth` endpoints
- **Database**: Add persistence layer for users, courses, feedback, subscriptions

### Testing the AI Tutor
- Toggle with button or press T; type question; click Send
- Without server: uses canned responses (check browser console for fallback)
- With server + OPENAI_API_KEY: real AI responses via `/api/ai`

## Project-Specific Patterns

### Event Delegation & DOM Queries
- Heavy use of `byId()` helper (shorthand for `getElementById`)
- Event delegation on `.enroll` buttons and `.faq-item` clicks; use `closest()` for element traversal
- Debouncing on search input (180ms) to avoid excessive filtering

### Modal Management
- Modals use `aria-hidden` attribute toggled via JS; overlay click closes modal
- Reusable pattern: wheel modal + content divs for both discount wheel and WhatsApp chat

### Form Handling
- Contact and feedback forms use `preventDefault()` + manual submission handlers (no backend wiring in demo)
- Form reset on success; localStorage for feedback persistence
- Email validation on login form

### Translations & Localization
- `applyTranslations(lang)` updates text by ID and selector
- RTL styles in CSS with `[dir="rtl"]` selectors
- Language preference persists to localStorage and detects browser default

### Styling Approach
- **CSS variables** for theme: `--bg`, `--card`, `--accent`, `--muted`
- **Gradients** used extensively for backgrounds and buttons
- **Responsive breakpoints**: 900px (grid 2→1), 768px (mobile nav), 600px (full mobile)
- **Accessibility**: semantic HTML, `aria-*` attributes, min-height: 44px for touch targets

## Common Tasks

**Wire a new course section**: Add course object to array, re-render with existing `render()` function.

**Connect real API**: Replace hardcoded course array with `fetch('/api/courses').then(r => r.json())` in `renderCourses()` equivalent.

**Improve AI responses**: Expand `cannedAiResponse()` logic or configure `/api/ai` to call Claude/GPT API with system prompt emphasizing project-based learning.

**Add database**: Create `/api/users`, `/api/subscriptions`, `/api/feedback` endpoints; migrate localStorage keys to server-side sessions.

**Deploy**: Build static bundle, deploy frontend to CDN; run backend on dyno/container with env vars for secrets.

## Key Files Reference
- `index.html` — Main page structure & modals
- `script.js` — All frontend logic (auth, courses, AI, payments, widgets)
- `style.css` — Responsive dark-mode theme with gradients & glass effect
- `server.js` — Express backend, PayPal + AI proxying
- `login.html` — Separate login/signup page
- `.env` — Contains `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `PAYPAL_ENV`, `OPENAI_API_KEY`
