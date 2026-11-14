# FluentSpring — AI English Classroom

## Project files
- `public/index.html`: learning website with accessibility controls.
- `server/index.js`: secure Node.js API backend for the AI tutor.
- `package.json`: backend dependencies.

## Keep the API key private
Never place `OPENAI_API_KEY` in browser JavaScript, `public/index.html`, or a public repository. Add it only as a private environment variable in the backend hosting service. Do not share the key with students.

## Deploy the backend
Use a Node.js 20+ hosting service that supports environment variables and HTTPS.

Set these private environment variables:
- `OPENAI_API_KEY`: API key managed by the site administrator.
- `OPENAI_MODEL`: optional; defaults to `gpt-4.1-mini`.
- `ALLOWED_ORIGINS`: exact website origin(s), comma-separated. Example: `https://refat-pasha.github.io`
- `PORT`: usually provided by the hosting platform.

Build/start command: `npm install` / `npm start`.

The frontend may remain on GitHub Pages. Before the app's main script, configure its backend URL:
```html
<script>window.FLUENTSPRING_API_URL = "https://YOUR-BACKEND-HOST/api/tutor";</script>
```
The tutor also checks `https://YOUR-BACKEND-HOST/api/health` automatically. Update the health URL in the frontend if you deploy the backend under a different route.

## Local development
1. Copy `.env.example` to `.env`.
2. Add the administrator's API key to `.env`. Keep `.env` private and never commit it.
3. Run `npm install`, then `npm start`.
4. Serve `public/` and the API from the same origin, or configure the frontend URL as above.

## AI tutor features
- Open-ended everyday English conversation.
- Sentence correction and clear grammar explanations.
- Up to three vocabulary suggestions with meanings and examples.
- More natural alternative expressions.
- Age-appropriate English-learning instructions.
- Request size validation and basic rate limiting.

This starter does not save chat transcripts on the backend. Hosting providers may still retain operational logs; review the provider's privacy settings and publish a clear privacy notice before public launch.

## Accessibility
- Skip-to-content link and visible keyboard focus.
- Text-size, high-contrast and reduced-motion controls.
- Microphone is optional; typed chat remains available.
- Listening exercises display their spoken text as a transcript.
- Chat and status updates use live regions.

These are accessibility-minded improvements, not a formal WCAG conformance claim. Test with keyboard-only navigation, screen readers, zoom, and learners with varied access needs.

## Before public launch
Ask the site administrator to review API usage, set spending limits/alerts, add stronger abuse monitoring, publish a privacy notice, and test accessibility. AI feedback can be wrong; learners should treat it as practice guidance.
