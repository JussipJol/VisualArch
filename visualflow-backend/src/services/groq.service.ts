import Groq from 'groq-sdk';
import { config } from '../config/env';
import { Response } from 'express';

const groq = new Groq({ apiKey: config.groqApiKey });

export const groqComplete = async (
  systemPrompt: string,
  userMessage: string,
  model = 'llama-3.3-70b-versatile',
  jsonMode = false
): Promise<string> => {
  const completion = await groq.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: jsonMode ? 0.3 : 0.7,
    max_tokens: 8192,
    ...(jsonMode && { response_format: { type: 'json_object' } }),
  });
  return completion.choices[0]?.message?.content || '';
};

export const groqStream = async (
  systemPrompt: string,
  userMessage: string,
  res: Response,
  model = 'llama-3.3-70b-versatile',
  jsonMode = false
): Promise<string> => {
  const stream = await groq.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: jsonMode ? 0.3 : 0.7,
    max_tokens: 8192,
    stream: true,
    ...(jsonMode && { response_format: { type: 'json_object' } }),
  });

  let fullContent = '';
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || '';
    if (delta) {
      fullContent += delta;
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: delta })}\n\n`);
    }
  }
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
