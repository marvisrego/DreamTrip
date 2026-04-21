# DreamTrip: Technical Documentation

DreamTrip is an AI-powered travel orchestration platform that leverages Large Language Models (LLMs) and real-time Retrieval-Augmented Generation (RAG) to transform unstructured natural language prompts into actionable travel itineraries.

## Technical Architecture

The system is built on a modular pipeline designed to minimize latency while maximizing the relevance of generated content.

### 1. Intent Parsing and Destination Discovery
- LLM Provider: GPT-4o mini via GitHub Models.
- Media Integration: Unsplash API for context-aware image retrieval.
- Logic: The initial user prompt is processed to extract semantic travel preferences (e.g., mood, climate, activity density). The LLM returns a structured list of destinations which are then mapped to the Unsplash API for visual representation.

### 2. Real-Time Data Grounding (RAG)
- Search Engine: Tavily API.
- Contextualization: Upon selecting a destination, the system triggers a targeted search via Tavily to bypass LLM knowledge cutoffs. This ensures the itinerary includes current venue statuses, local events, and up-to-date travel advisories.
- Itinerary Generation: The retrieved context is injected into a system prompt for GPT-4o mini, which generates a structured, multi-day itinerary.

### 3. State Management and Refinement Loop
- Refinement: A secondary chatbot interface allows for iterative modifications to the generated state.
- Geospatial Integration: Google Maps Platform is utilized for spatial grounding, allowing users to visualize itinerary locations via hover interactions.

## API Implementation Details

| Component | Service | Primary Function |
| :--- | :--- | :--- |
| Inference | GPT-4o mini | Semantic reasoning and text synthesis |
| Search | Tavily | Real-time web-scale retrieval (RAG) |
| Assets | Unsplash | Dynamic image sourcing |
| Geospatial | Google Maps | Location visualization and validation |

## Design Patterns and Best Practices

- Modular Interface: Separation of concerns between the search retrieval layer and the synthesis layer.
- Prompt Engineering: Structured system prompts are used to ensure the LLM output remains consistent and parsable for the UI components.
- Latency Mitigation: Asynchronous API calls are implemented to ensure that UI animations (scroll effects) remain fluid while data fetching occurs in the background.
