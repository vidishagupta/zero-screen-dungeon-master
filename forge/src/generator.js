import { StorySchema, validateGraphConnectivity } from './schema.js';
import { buildSystemPrompt, buildUserPrompt, buildRepairPrompt } from './prompts.js';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const DEFAULT_MODEL = process.env.GEMMA_MODEL || 'gemma2:2b';

/**
 * Strips markdown codeblocks and extracts raw JSON object string
 */
export function extractJsonString(rawText) {
  if (!rawText) return '';
  let cleaned = rawText.trim();
  // Remove markdown blocks ```json ... ``` or ``` ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  // Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

/**
 * Call Ollama generate endpoint
 */
async function callOllama({ prompt, system, model = DEFAULT_MODEL }) {
  const url = `${OLLAMA_HOST}/api/generate`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      system,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 2048
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.response;
}

/**
 * Generates an adventure using local open-weight Gemma model with automated validation and retry.
 */
export async function forgeAdventure({
  theme = 'fantasy',
  vibe = 'park',
  walkLengthMeters = 560,
  title = '',
  model = DEFAULT_MODEL,
  maxRetries = 3
}) {
  const systemPrompt = buildSystemPrompt();
  let userPrompt = buildUserPrompt({ theme, vibe, walkLengthMeters, title });

  let rawOutput = '';
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Forge] Generating adventure with Gemma (${model}), attempt ${attempt}/${maxRetries}...`);
      rawOutput = await callOllama({ prompt: userPrompt, system: systemPrompt, model });
      const jsonStr = extractJsonString(rawOutput);
      const parsed = JSON.parse(jsonStr);

      // Validate schema
      const validated = StorySchema.parse(parsed);

      // Validate graph connectivity
      const graphCheck = validateGraphConnectivity(validated);
      if (!graphCheck.valid) {
        throw new Error(`Graph connectivity errors: ${graphCheck.errors.join('; ')}`);
      }

      console.log(`[Forge] Successfully generated and verified story: "${validated.title}" (${validated.checkpoints.length} checkpoints)`);
      return validated;
    } catch (err) {
      console.warn(`[Forge] Attempt ${attempt} failed:`, err.message);
      if (attempt === maxRetries) {
        throw new Error(`Failed to generate valid story after ${maxRetries} attempts. Last error: ${err.message}`);
      }
      userPrompt = buildRepairPrompt({ rawOutput, errorMessages: [err.message] });
    }
  }
}
