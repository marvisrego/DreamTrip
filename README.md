# DreamTrip

DreamTrip turns a natural-language travel brief into ranked destination matches and a practical day-by-day itinerary. Users can describe a mood, budget, pace, or travel style instead of working through a long filter form.

## AI model

DreamTrip uses **NVIDIA Nemotron 3 Super 120B A12B** through NVIDIA’s hosted NIM API.

- Base URL: `https://integrate.api.nvidia.com/v1`
- Model ID: `nvidia/nemotron-3-super-120b-a12b`
- Sampling: `temperature: 1`, `top_p: 0.95`
- Thinking mode is disabled for predictable JSON and itinerary responses.

The browser calls a Vercel Function at `/api/nvidia`. The function reads `NVIDIA_API_KEY` at runtime and forwards requests to NVIDIA, so the key is not included in the browser bundle. The legacy `VITE_GITHUB_TOKEN` name is also accepted server-side during migration.

## What the app does

- Converts a free-form travel brief into nine ranked destination matches.
- Loads destination photography from Unsplash, with curated fallback images.
- Adds current travel context through Tavily when a key is configured.
- Builds the complete day-by-day itinerary behind a focused loading screen, then reveals it at once.
- Lets users refine the completed itinerary through follow-up chat.
- Shows live destination weather from Open-Meteo.
- Uses the bundled home-page video as a muted, continuously looping background.

## Stack

- React 19 and React Router
- Vite 6
- NVIDIA NIM and Nemotron 3 Super
- Tavily Search
- Unsplash
- Open-Meteo
- Lucide icons

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local`, then replace the placeholders:

```env
NVIDIA_API_KEY=your_nvidia_api_key
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
VITE_TAVILY_API_KEY=your_tavily_api_key
```

Only the NVIDIA key is required for destination and itinerary generation. Unsplash and Tavily are optional; the app has image fallbacks and skips live search context when their keys are absent.

Do not commit `.env.local`. On Vercel, add `NVIDIA_API_KEY` to the Production, Preview, and Development environments you use, then redeploy so the Function receives it.

### 3. Start the app

For the complete app, including the local Vercel Function:

```bash
npx vercel dev
```

For frontend-only work, `npm run dev` still starts Vite, but AI requests require the Function route.

Open the local URL printed by the Vercel CLI (typically `http://localhost:3000`).

## Production build

```bash
npm run build
npm run preview
```

The compiled app is written to `dist/`.

## Project structure

```text
src/
  components/       Reusable destination, itinerary, chat, and UI components
  hooks/            Image and weather hooks
  lib/              NVIDIA, travel-context, and image integrations
  pages/            Landing, results, and itinerary screens
  prompts/          Destination, itinerary, and follow-up system prompts
api/
  nvidia.js         Server-side NVIDIA proxy for Vercel
```

The home-page video is stored as `7262-199224619_medium.mp4` at the project root and is bundled by Vite.
