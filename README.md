<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1hVbsha0bg1aYU11ZrImMCEmJ9BKq4y3V

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key if you plan to use the AI features.
3. Run the app:
   - Full experience (AI enabled): `npm run dev:full`
   - Lite experience (no AI, suitable for Vercel): `npm run dev:lite`

## Deploying Lite vs Full builds

- The app now honours an `ENABLE_AI` environment variable (defaults to `true`). When set to `false`, AI-specific UI and code paths stay disabled, so no Gemini credentials are required.
- Use the provided scripts to generate production bundles:
  - `npm run build:full` – emits the full experience; requires `GEMINI_API_KEY`.
  - `npm run build:lite` – emits the lite build with AI removed; no Gemini key needed.
- On Vercel set only `ENABLE_AI=false` (omit `GEMINI_API_KEY`) to deploy the lite build for your team. For your personal deployment, set `ENABLE_AI=true` and supply `GEMINI_API_KEY`.
