# Sophia Central Frontend
[![Frontend CI](https://github.com/ReignnRule11/Sophia-Central-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/ReignnRule11/Sophia-Central-frontend/actions/workflows/ci.yml)
A production-oriented React + Vite + TypeScript MVP for Sophia Central, designed as an academic operations platform for students, lecturers, moderators, and administrators.

## Features

- Role-based authentication shell
- Executive dashboard and platform analytics
- Academic library and resource upload workflows
- AI tutor support
- Moderate/approval pipelines for resource trust and quality
- Responsive dark-mode-first UI

## Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Lucide icons

## Production-ready MVP architecture

This repo has been reorganized around a real service boundary so the UI is no longer tightly coupled to mock data.

### Architecture

- `src/config/env.ts` centralizes runtime environment configuration
- `src/lib/api/client.ts` provides a typed API client for authenticated requests
- `src/services/*` owns domain logic for auth, resources, moderation, and AI requests
- `src/context/*` manages auth and theme state without embedding API logic in components
- `src/lib/storage.ts` handles persistence in a consistent, testable way

### Local development

Copy the example env file and adjust values for your environment:

```bash
cp .env.example .env
npm install
npm run dev
```

### Environment variables

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_APP_NAME=Sophia Central
VITE_USE_MOCK_DATA=false
```

Set `VITE_USE_MOCK_DATA=true` only for local UI prototyping or offline development. The default is false so the app expects a real backend.

## Build and validation

```bash
npm run build
npm run typecheck
```

## Example production flow

1. Start your backend API on the configured `VITE_API_BASE_URL`
2. Authenticate with a real user session
3. Fetch resources, moderation tasks, and AI responses from the backend
4. Use mock data only as a deliberate offline fallback, not as the default app behavior

## Notes

The frontend is no longer designed around hard-coded demo responses at the call site. That makes it easier to swap in a real backend or add new services without drilling through page components.
