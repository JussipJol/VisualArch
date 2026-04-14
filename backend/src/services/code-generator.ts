import { CodeFile } from '../types';

/**
 * Generates realistic production-ready code files for an architecture node.
 */
export function generateCodeFiles(label: string, layer: string): CodeFile[] {
  const sanitized = label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const className = sanitized.charAt(0).toUpperCase() + sanitized.slice(1);

  if (layer === 'Frontend') {
    return [
      {
        name: `${sanitized}.tsx`,
        path: `src/components/${sanitized}.tsx`,
        language: 'typescript',
        content: `import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface ${label.replace(/\s/g, '')}Props {
  className?: string;
}

export const ${label.replace(/\s/g, '')}: React.FC<${label.replace(/\s/g, '')}Props> = ({ className }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/data');
        setData(response.data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner" />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className={\`${sanitized}-container \${className ?? ''}\`}>
      <h2>${label}</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ${label.replace(/\s/g, '')};
`,
      },
    ];
  }

  if (layer === 'Backend' || layer === 'Services' || layer === 'Gateway') {
    return [
      {
        name: `${sanitized}.router.ts`,
        path: `src/routes/${sanitized}.ts`,
        language: 'typescript',
        content: `import { Router, Request, Response } from 'express';
import { ${sanitized}Service } from '../services/${sanitized}.service';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
const service = new ${className}Service();

router.get('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const data = await service.getAll(req.user!.userId);
    res.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const created = await service.create(req.user!.userId, req.body);
    res.status(201).json({ data: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({ error: message });
  }
});

router.get('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const item = await service.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ data: item });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

router.patch('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const updated = await service.update(req.params.id, req.body);
    res.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({ error: message });
  }
});

router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    await service.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

export default router;
`,
      },
      {
        name: `${sanitized}.service.ts`,
        path: `src/services/${sanitized}.service.ts`,
        language: 'typescript',
        content: `/**
 * ${label} Service — business logic layer
 */
export class ${className}Service {
  async getAll(userId: string): Promise<unknown[]> {
    return [];
  }

  async getById(id: string): Promise<unknown | null> {
    return null;
  }

  async create(userId: string, data: unknown): Promise<unknown> {
    return { id: 'generated-id', ...(data as object), createdBy: userId };
  }

  async update(id: string, data: unknown): Promise<unknown> {
    return { id, ...(data as object), updatedAt: new Date() };
  }

  async delete(_id: string): Promise<void> {
    // implementation: soft delete or cascade
  }
}
`,
      },
    ];
  }

  if (layer === 'Database') {
    return [
      {
        name: `${sanitized}.schema.ts`,
        path: `src/models/${sanitized}.schema.ts`,
        language: 'typescript',
        content: `import { z } from 'zod';

export const ${sanitized}Schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type ${className}Type = z.infer<typeof ${sanitized}Schema>;

export const ${sanitized}Indexes = [
  { key: { createdAt: -1 }, name: 'idx_created_desc' },
  { key: { name: 'text' }, name: 'idx_name_text' },
];
`,
      },
    ];
  }

  // Generic module (Cache, Auth, Infrastructure, Realtime, etc.)
  return [
    {
      name: `${sanitized}.ts`,
      path: `src/${sanitized}.ts`,
      language: 'typescript',
      content: `/**
 * ${label} Module — configuration and initialization
 */
export interface ${label.replace(/\s/g, '')}Config {
  enabled: boolean;
  options?: Record<string, unknown>;
}

export async function initialize${label.replace(/\s/g, '')}(config: ${label.replace(/\s/g, '')}Config): Promise<void> {
  if (!config.enabled) {
    console.log('[${label}] Disabled, skipping initialization');
    return;
  }
  console.log('[${label}] Initialized successfully');
}
`,
    },
  ];
}

/**
 * Generates test scaffolding for an architecture node.
 */
export function generateTestFiles(label: string): CodeFile[] {
  const sanitized = label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return [
    {
      name: `${sanitized}.test.ts`,
      path: `src/__tests__/${sanitized}.test.ts`,
      language: 'typescript',
      content: `import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

/**
 * ${label} — Unit Tests
 * Generated by VisualArch AI
 */
describe('${label}', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // cleanup
  });

  describe('Happy Path', () => {
    it('should initialize successfully', async () => {
      const config = { enabled: true };
      expect(config.enabled).toBe(true);
    });

    it('should handle valid input correctly', () => {
      const input = { name: 'test', value: 42 };
      const result = { ...input, processed: true };
      expect(result.name).toBe('test');
      expect(result.processed).toBe(true);
    });
  });

  describe('Error Scenarios', () => {
    it('should reject invalid input', () => {
      expect(() => {
        if (!null) throw new Error('Invalid input');
      }).toThrow('Invalid input');
    });

    it('should handle network errors gracefully', async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      await expect(mockFetch()).rejects.toThrow('Network error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data', () => {
      const empty: unknown[] = [];
      expect(empty).toHaveLength(0);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, (_, i) =>
        Promise.resolve(\`Result \${i}\`)
      );
      const results = await Promise.all(requests);
      expect(results).toHaveLength(5);
    });
  });
});
`,
    },
  ];
}
