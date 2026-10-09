import { z } from 'zod';

export const ChoiceSchema = z.object({
  key: z.enum(['left', 'right']),
  label: z.string().min(3, 'Choice label must be descriptive'),
  nextCheckpointId: z.string().min(2, 'Must specify next checkpoint or ending ID')
});

export const CheckpointSchema = z.object({
  id: z.string().min(2),
  distanceMeters: z.number().int().positive().default(80),
  narration: z.string().min(20, 'Narration must be descriptive and immersive for audio-only play'),
  prompt: z.string().min(10, 'Prompt must clearly instruct player on left/right choices'),
  choices: z.array(ChoiceSchema).length(2, 'Each checkpoint must have exactly 2 branching choices (Left and Right)')
});

export const EndingSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(3),
  narration: z.string().min(25, 'Ending narration must wrap up the audio story satisfyingly')
});

export const StorySchema = z.object({
  id: z.string().regex(/^[a-z0-9_-]+$/, 'ID must be URL/slug friendly'),
  title: z.string().min(3),
  theme: z.string().min(3),
  vibe: z.string().min(3),
  checkpointDistanceMeters: z.number().int().positive().default(80),
  estimatedWalkMeters: z.number().int().positive().optional(),
  description: z.string().min(10),
  author: z.string().default('Forged with Gemma (Open-Weight LLM)'),
  intro: z.object({
    text: z.string().min(25, 'Intro must set the scene and instruct player to start walking'),
    nextCheckpointId: z.string().min(2)
  }),
  checkpoints: z.array(CheckpointSchema).min(3, 'Story must have at least 3 checkpoints'),
  endings: z.array(EndingSchema).min(2, 'Story must have at least 2 endings')
});

/**
 * Validates graph connectivity (every nextCheckpointId resolves to a real checkpoint or ending).
 */
export function validateGraphConnectivity(story) {
  const checkpointIds = new Set(story.checkpoints.map(c => c.id));
  const endingIds = new Set(story.endings.map(e => e.id));
  const allTargetIds = new Set([...checkpointIds, ...endingIds]);

  const errors = [];

  if (!allTargetIds.has(story.intro.nextCheckpointId)) {
    errors.push(`Intro points to non-existent ID: '${story.intro.nextCheckpointId}'`);
  }

  story.checkpoints.forEach(cp => {
    cp.choices.forEach(ch => {
      if (!allTargetIds.has(ch.nextCheckpointId)) {
        errors.push(`Checkpoint '${cp.id}' choice '${ch.key}' points to non-existent target ID '${ch.nextCheckpointId}'`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors
  };
}
