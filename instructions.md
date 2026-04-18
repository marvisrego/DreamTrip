# DreamTrip — Full Agent Build Prompt
# source_handbook: week11-hackathon-preparation

---

## Your Role

You are an expert React developer and UI/UX designer building **DreamTrip** — a cinematic AI-powered travel itinerary generator. You will build this end-to-end using the skills, APIs, and rules defined below. You write clean, modular, deployment-ready code. You never add a feature until the previous one works. You always apply the relevant skill before writing any code in that domain.

---

## Skills to Load (Read These First Before Writing Any Code)

Before writing any code, load and apply these skills in this order:

1. `ui-ux-pro-max` — apply before designing any component or layout
2. `framer-motion-animator` — apply before writing any animation or transition
3. `web-design-guidelines` — apply for spacing, typography, colour decisions
4. `ai-image-generation` — apply before writing any image fetching or display logic
5. `brainstorming` — apply when stuck on UX flow or feature decisions

---

## What DreamTrip Does

The user types a one-sentence holiday vibe (e.g. *"solo trip, beaches, not touristy, under £1000"*). The app:

1. Uses **Gemini** to suggest 3 matching destinations
2. Lets the user pick one
3. Uses **Groq** to generate a full day-by-day itinerary
4. Fetches real destination photography from **Unsplash**
5. Lets the user refine via a follow-up chat powered by **Groq**

---

## Tech Stack

- **Framework**: React + Vite + Tailwind CSS (Antigravity)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **AI — Destination suggestions**: Gemini API (`gemini-2.0-flash`)
- **AI — Itinerary + Chat**: Groq API (`llama-3.3-70b-versatile`)
- **Images — Destination cards**: Unsplash API (free tier)
- **Images — Fallback**: Pollinations.ai (no key needed)
- **Images — Hero**: Static asset in `src/assets/` (downloaded from Pexels)
- **Flags**: flagcdn.com (no key, URL-based)
- **Deployment**: Vercel

---

## Environment Variables

All keys use `import.meta.env.VITE_*` — never hardcode.

```
VITE_GEMINI_API_KEY=
VITE_GROQ_API_KEY=
VITE_UNSPLASH_ACCESS_KEY=
```

---

## Full File Structure

```
src/
  components/
    VibeInput/
      VibeInput.jsx         # Hero input form — the entry point
      VibeInput.test.js     # Sanity check render test
    DestinationCard/
      DestinationCard.jsx   # Single destination card with image, flag, tags
      DestinationGrid.jsx   # 3-card grid layout with staggered animation
    ItineraryView/
      ItineraryView.jsx     # Full itinerary display
      DayCard.jsx           # Single day block with activities
    ChatFollowUp/
      ChatFollowUp.jsx      # Refinement chat UI
      ChatMessage.jsx       # Individual message bubble
    Skeleton/
      ImageSkeleton.jsx     # Shimmer placeholder for card images
      CardSkeleton.jsx      # Full card shimmer while loading
    UI/
      Button.jsx            # Reusable button with variants
      Badge.jsx             # Tag/label badge component
      Loader.jsx            # Spinner for AI loading states
  pages/
    LandingPage.jsx         # Hero + VibeInput
    ResultsPage.jsx         # DestinationGrid after Gemini responds
    ItineraryPage.jsx       # Full itinerary + chat after destination picked
  hooks/
    useGroq.js              # Custom hook for Groq streaming
    useGemini.js            # Custom hook for Gemini JSON response
    useUnsplash.js          # Custom hook for image fetching with fallback
  lib/
    groq.js                 # Groq API wrapper
    gemini.js               # Gemini API wrapper
    unsplash.js             # Unsplash API wrapper with Pollinations fallback
  prompts/
    destinationPrompt.js    # Gemini system prompt
    itineraryPrompt.js      # Groq itinerary system prompt
    chatPrompt.js           # Groq follow-up chat system prompt
  assets/
    hero-bg.jpg             # Static hero background (download from Pexels)
  App.jsx
  main.jsx
```

---

## Page-by-Page Feature Spec

### 1. Landing Page (`LandingPage.jsx`)

**Layout:**
- Full-screen hero with `hero-bg.jpg` as background
- Dark gradient overlay (`from-black/70 to-black/30`) for readability
- Centered content with DreamTrip logo/wordmark at top
- Tagline: *"Describe your dream. We'll plan the trip."*
- `VibeInput` component centred in the hero

**VibeInput component:**
- Large, single-line text input with placeholder: *"e.g. solo trip, beaches, not touristy, under £1000"*
- Submit button: "Plan My Trip →"
- Character counter (max 200 chars)
- Input should feel premium — large font, generous padding, subtle border glow on focus
- On submit: navigate to `/results` and trigger Gemini call

**Animations (apply `framer-motion-animator` skill):**
- Logo fades in first
- Tagline slides up with 0.2s delay
- Input slides up with 0.4s delay
- Background has subtle Ken Burns zoom effect (CSS only, `scale-110` transition over 10s)

---

### 2. Results Page (`ResultsPage.jsx`)

**Layout:**
- Brief heading: *"Here are your matches"*
- Subheading showing the user's original vibe in italic
- 3-column `DestinationGrid` with destination cards
- Loading state: show 3 `CardSkeleton` components while Gemini responds

**DestinationCard component:**
- Unsplash image fills top 60% of card (landscape orientation)
- `ImageSkeleton` shimmer shown while image loads
- Country flag from flagcdn.com overlaid bottom-left of image
- Destination name in large bold type
- Country name in smaller muted type
- 2–3 tag badges (e.g. "Beaches", "Budget-friendly", "Solo-friendly")
- One-sentence reason why it matches their vibe
- "Plan This Trip →" CTA button
- On click: navigate to `/itinerary/:destination`

**Gemini Integration:**
- Call `useGemini` hook with the vibe string
- Expected response: JSON array of 3 objects:
```json
[
  {
    "destination": "Bali",
    "country": "Indonesia",
    "countryCode": "id",
    "reason": "Affordable beaches with a spiritual, off-the-beaten-path culture.",
    "tags": ["Beaches", "Budget-friendly", "Solo-friendly"],
    "bestFor": "7–10 days"
  }
]
```
- Parse JSON safely — wrap in try/catch, show error state if malformed

**Animations (apply `framer-motion-animator` skill):**
- Cards stagger in with `initial={{ opacity: 0, y: 40 }}` and 0.15s delay between each
- Card hover: subtle `scale(1.02)` lift with box shadow deepening
- Tags animate in after card with slight delay

---

### 3. Itinerary Page (`ItineraryPage.jsx`)

**Layout:**
- Full-width destination hero image at top (same Unsplash image from card)
- Destination name + country overlaid on image with gradient
- Estimated duration + best time to visit badges
- Full `ItineraryView` below the hero
- `ChatFollowUp` fixed at bottom of screen

**ItineraryView component:**
- Renders each day as a `DayCard`
- `DayCard` shows: Day number, headline activity, list of activities, meal suggestions, estimated cost for the day
- Days should feel like editorial travel magazine spreads — not bullet point lists
- Show a subtle vertical timeline line connecting day cards

**Groq Integration:**
- Call `useGroq` hook when destination is selected
- Stream the response — show text as it arrives, don't wait for full completion
- Groq itinerary prompt should return structured output:
```
Day 1: Arrival & Orientation
Morning: ...
Afternoon: ...
Evening: ...
Meals: ...
Estimated cost: ...

Day 2: ...
```
- Parse each day block and render progressively as streaming completes

**ChatFollowUp component:**
- Sticky bottom panel, collapsed by default with "Refine your trip ✦" toggle button
- Expands into a chat interface when clicked
- Input: *"e.g. make it more adventurous / I'm vegetarian / add a beach day"*
- Each message sent to Groq with full conversation history + original vibe + destination as context
- Responses stream in — show typing indicator while waiting
- Chat history persisted in `useState` for the session

**Animations (apply `framer-motion-animator` skill):**
- Hero image parallax scroll effect as user scrolls down
- Day cards reveal with `whileInView` staggered entrance
- Chat panel slides up with spring animation when expanded
- Each chat message fades + slides in from bottom

---

## API Wrapper Specs

### `src/lib/gemini.js`
```javascript
// source_handbook: week11-hackathon-preparation
// Uses Gemini API to suggest destinations based on vibe
// Returns: parsed JSON array of destination objects
// Always handles malformed JSON gracefully
```

### `src/lib/groq.js`
```javascript
// source_handbook: week11-hackathon-preparation
// Uses Groq API for itinerary generation and chat
// Supports streaming — accepts onChunk callback
// Maintains conversation history for chat mode
```

### `src/lib/unsplash.js`
```javascript
// source_handbook: week11-hackathon-preparation
// Fetches landscape photos by destination name
// Falls back to Pollinations.ai URL if Unsplash fails or quota exceeded
// Pollinations fallback: `https://image.pollinations.ai/prompt/cinematic+travel+{destination}`
// Always returns a usable image URL — never returns null
```

---

## Prompt Specs

### `src/prompts/destinationPrompt.js`
```
You are a travel expert. Given a holiday vibe description, suggest exactly 3 destinations.
Return ONLY a valid JSON array. No preamble, no markdown, no explanation.
Each object must include: destination, country, countryCode (ISO 2-letter), reason, tags (array of 3), bestFor.
Tags must be short (2-3 words max). Reason must be one sentence.
Refuse requests for dangerous, illegal, or impossible travel.
<vibe>{userVibe}</vibe>
```

### `src/prompts/itineraryPrompt.js`
```
You are a professional travel planner. Create a detailed day-by-day itinerary for the given destination.
Structure each day as: Day N: [Title], Morning, Afternoon, Evening, Meals, Estimated daily cost.
Be specific — name real places, restaurants, and activities. Write in an engaging editorial travel style.
Keep each day concise but vivid. Do not use bullet points — use short flowing sentences.
<destination>{destination}</destination>
<vibe>{userVibe}</vibe>
<duration>{suggestedDuration}</duration>
```

### `src/prompts/chatPrompt.js`
```
You are a friendly travel advisor helping refine a trip itinerary.
You have the original vibe and full itinerary as context.
Answer concisely and update only what the user asks to change.
If the user asks something outside travel planning, politely redirect.
<destination>{destination}</destination>
<originalVibe>{userVibe}</originalVibe>
<currentItinerary>{itinerary}</currentItinerary>
```

---

## Visual Design Direction

Apply `ui-ux-pro-max` and `web-design-guidelines` skills. The aesthetic is:

**Cinematic luxury travel editorial** — think Condé Nast Traveller meets a dark-mode web app.

- **Colour palette**: Deep navy/charcoal backgrounds (`#0a0f1e`, `#111827`), warm gold accents (`#d4a84b`), crisp white text
- **Typography**: Pair a serif display font (e.g. Playfair Display or Cormorant Garamond) for headings with a clean sans (e.g. DM Sans) for body
- **Cards**: Dark glass-morphism effect — `backdrop-blur`, semi-transparent backgrounds, subtle border glow
- **Spacing**: Generous — let the imagery breathe
- **No generic AI look** — no purple gradients, no rounded blob shapes, no Inter font

---

## Build Order (Follow This Exactly)

**Phase 1 — Core path (ship this first):**
1. Set up file structure + env vars + lib wrappers
2. `VibeInput` → calls Gemini → parses destinations
3. `DestinationGrid` + `DestinationCard` renders results
4. `ItineraryView` → calls Groq → renders itinerary
5. Basic routing between all three pages
6. Test full path works end-to-end

**Phase 2 — Images + polish:**
7. Unsplash integration + ImageSkeleton
8. Framer Motion animations across all pages
9. Hero background + parallax
10. Flag + badge components

**Phase 3 — Chat + refinement:**
11. `ChatFollowUp` component
12. Groq streaming chat with history
13. Responsive layout check

**Phase 4 — Deployment:**
14. `npm run build` — fix any errors
15. Push to GitHub
16. Deploy to Vercel with env vars set

---

## Scope Rules

- Do not build Phase 2 until Phase 1 is fully working
- Do not build authentication — not needed
- Do not use a database — session state only
- Do not add AI image generation — Unsplash is the image source
- If any feature is taking too long: cut it, add to README as "future work"
- One working route beats three broken routes

---

## What Not To Do

- Do not call APIs inline in components — always use `src/lib/` wrappers
- Do not hardcode API keys
- Do not use AI-generated images (Stable Diffusion etc.) — too slow for demo
- Do not style before core AI path works
- Do not use class components
- Do not leave console.logs in final code
- Do not block UI waiting for images — always async with skeleton fallback
- Do not converge on generic AI aesthetics (no Inter, no purple gradients)
