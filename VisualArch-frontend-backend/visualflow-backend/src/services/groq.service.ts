import { Response } from 'express';
import { aiOrchestrator } from './ai/orchestrator.service';
import { AIModule } from './ai/ai.types';

export const groqComplete = async (
  systemPrompt: string,
  userMessage: string,
  _model = 'legacy',
  jsonMode = false
): Promise<string> => {
  return aiOrchestrator.executeTask(
    AIModule.GENERAL,
    { system: systemPrompt, user: userMessage },
    { jsonMode }
  );
};

export const groqStream = async (
  systemPrompt: string,
  userMessage: string,
  res: Response,
  _model = 'legacy',
  jsonMode = false
): Promise<string> => {
  let fullContent = '';
  await aiOrchestrator.executeStream(
    AIModule.GENERAL,
    { system: systemPrompt, user: userMessage },
    {
      onChunk: (chunk) => {
        fullContent += chunk;
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      }
    },
    { jsonMode }
  );
  return fullContent;
};

export const parseJSON = (raw: string): unknown => {
  const cleaned = raw
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No valid JSON found in response');

  return JSON.parse(jsonMatch[0]);
};
