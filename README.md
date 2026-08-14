# DreamTrip

DreamTrip turns a natural-language travel brief into ranked destination matches and a practical day-by-day itinerary. Users can describe a mood, budget, pace, or travel style instead of working through a long filter form.

## AI model

DreamTrip uses **NVIDIA Nemotron 3 Super 120B A12B** through NVIDIA’s hosted NIM API.

- Base URL: `https://integrate.api.nvidia.com/v1`
- Model ID: `nvidia/nemotron-3-super-120b-a12b`
- Sampling: `temperature: 1`, `top_p: 0.95`
- Thinking mode is disabled for predictable JSON and itinerary responses.

The existing `VITE_GITHUB_TOKEN` environment-variable name is retained for deployment compatibility, but its value must now be an NVIDIA API key.

## What the app does

- Converts a free-form travel brief into nine ranked destination matches.
- Loads destination photography from Unsplash, with curated fallback images.
- Adds current travel context through Tavily when a key is configured.
- Streams a day-by-day itinerary as it is generated.
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
VITE_GITHUB_TOKEN=your_nvidia_api_key
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
VITE_TAVILY_API_KEY=your_tavily_api_key
```

Only the NVIDIA key is required for destination and itinerary generation. Unsplash and Tavily are optional; the app has image fallbacks and skips live search context when their keys are absent.

Do not commit `.env.local`. Variables prefixed with `VITE_` are included in the browser bundle, so a production deployment should proxy NVIDIA requests through a server-side endpoint if the key must remain private.

### 3. Start the app

```bash
npm run dev
```

Open `http://localhost:5173`.

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
```

The home-page video is stored as `7262-199224619_medium.mp4` at the project root and is bundled by Vite.
