import { z } from 'zod';
import { getAIModel } from './client';

interface AICallResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  rawResponse?: string;
  sourceFieldsUsed: string[];
}

/**
 * Execute an AI call with full guardrails:
 * 1. Send prompt to Gemini
 * 2. Parse JSON response
 * 3. Validate against Zod schema
 * 4. Extract sourceFieldsUsed
 * 5. Handle errors gracefully
 */
export async function safeAICall<T extends z.ZodTypeAny>(
  prompt: string,
  schema: T
): Promise<AICallResult<z.infer<T>>> {
  try {
    const model = getAIModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Try to extract JSON from the response
    let jsonString = text;
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    }

    // Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      return {
        success: false,
        error: `AI returned invalid JSON: ${text.substring(0, 200)}`,
        rawResponse: text,
        sourceFieldsUsed: [],
      };
    }

    // Validate against schema
    const validated = schema.safeParse(parsed);
    if (!validated.success) {
      return {
        success: false,
        error: `AI output failed validation: ${validated.error.message}`,
        rawResponse: text,
        sourceFieldsUsed: [],
      };
    }

    return {
      success: true,
      data: validated.data,
      rawResponse: text,
      sourceFieldsUsed: validated.data.sourceFieldsUsed ?? [],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown AI error';
    return {
      success: false,
      error: `AI call failed: ${message}`,
      sourceFieldsUsed: [],
    };
  }
}
