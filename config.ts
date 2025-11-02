/**
 * Global application configuration helpers.
 * Values are injected at build time via Vite's define config.
 */
const rawEnableAi =
  typeof process !== 'undefined' && process.env && typeof process.env.ENABLE_AI === 'string'
    ? process.env.ENABLE_AI
    : undefined;

/**
 * `true` unless explicitly set to the string "false".
 * Allows the lite build to strip AI features without branching source code.
 */
export const IS_AI_ENABLED = (rawEnableAi ?? 'true').toLowerCase() !== 'false';

/**
 * Convenience helper for code paths that need to know if an API key was supplied.
 */
export const GEMINI_API_KEY =
  (typeof process !== 'undefined' && process.env && (process.env.API_KEY ?? process.env.GEMINI_API_KEY)) || '';
