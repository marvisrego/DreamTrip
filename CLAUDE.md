# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No test runner is configured.

## Environment Variables

All keys use `import.meta.env.VITE_*` — never hardcode. Required in `.env`:

```
VITE_GITHUB_TOKEN=        # GitHub Models API key (used as OpenAI-compatible key)
VITE_UNSPLASH_ACCESS_KEY= # Unsplash photo API
```

## Architecture Overview

**DreamTrip** is a cinematic AI travel planner. The user describes a holiday vibe → gets 3 AI-suggested destinations → picks one → gets a streamed day-by-day itinerary → can refine via chat.

### Routing (`src/App.jsx`)

Three pages, state passed via React Router `location.state`:

| Route | Page | Receives via state |
|---|---|---|
| `/` | `LandingPage` | — |
| `/results` | `ResultsPage` | `{ vibe }` |
| `/itinerary/:destination` | `ItineraryPage` | `{ destination, vibe }` |

### AI Layer (`src/lib/`)

- `groq.js` — **Despite the filename, this wraps GitHub Models API** (`gpt-4o-mini` via OpenAI SDK with `baseURL: https://models.inference.ai.azure.com`). Exports `callGroq` (non-streaming) and `callGroqStream` (streaming with `onChunk` callback).
- `api.js` — Public-facing AI functions: `fetchDestinations(vibe)`, `streamItinerary(destination, vibe, onChunk)`, `streamChat(message, history, destination, vibe, itinerary, onChunk)`.

### Prompts (`src/prompts/`)

Each prompt file exports a builder function called by `api.js`:
- `destinationPrompt.js` → `getDestinationPrompt()` + `buildDestinationMessage(vibe)` — returns JSON array of 3 destinations
- `itineraryPrompt.js` → `getItineraryPrompt(destination, vibe, duration)`
- `chatPrompt.js` → `getChatPrompt(destination, vibe, itinerary)`

### Design System (`src/index.css`)

CSS custom properties define all design tokens — use these variables, not hardcoded values:
- Colors: `--color-bg-primary` (#0a0f1e), `--color-accent` (#d4a84b gold), `--color-text-muted`, etc.
- Fonts: `--font-heading` (Playfair Display serif), `--font-body` (DM Sans)
- Use `text-gold-gradient` and `text-glow-gold` utility classes for the gold gradient text effect

### Path Alias

`@/` resolves to `src/` (configured in `vite.config.js`).

### Key Dependencies

- **Framer Motion** — all page/component animations; use `useReducedMotion()` for accessibility
- **Tailwind CSS v4** — via `@tailwindcss/vite` plugin (not PostCSS config)
- **Lucide React** — icons
- **Unsplash** (`src/lib/unsplash.js`) and `src/hooks/useUnsplash.js` — destination photography

### Background Videos

Landing page cycles through 4 videos hosted on AWS CloudFront (`https://d12is9znbjsq5c.cloudfront.net/video.mp4`, `video2.mp4`, `video3.mp4`, `video4.mp4`).
