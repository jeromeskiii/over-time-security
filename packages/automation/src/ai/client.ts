import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

/**
 * Module-level singleton — works correctly in long-running worker processes.
 * ⚠️ In serverless environments (e.g., Next.js API routes), this will be
 * re-created on every cold start. Do NOT import this module from app code;
 * it is intended for the @ots/automation worker only.
 */
let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

/**
 * Get the configured Gemini model instance.
 * Uses gemini-1.5-flash for cost efficiency on structured extraction tasks.
 */
export function getAIModel(): GenerativeModel {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('[AI] GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.2, // Low creativity — factual summaries
        topP: 0.8,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    });
  }
  return model;
}
