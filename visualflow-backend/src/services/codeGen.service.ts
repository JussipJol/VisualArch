import { groqComplete } from './groq.service';
import { PLANNER_SYSTEM_PROMPT, FRONTEND_FILE_PROMPT, BACKEND_FILE_PROMPT, README_PROMPT } from '../prompts/code.prompts';
import { buildContext } from './memory.service';
import { ICanvasNode } from '../types';

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

const getLanguage = (path: string): string => {
  if (path.endsWith('.jsx') || path.endsWith('.js')) return 'javascript';
  if (path.endsWith('.tsx') || path.endsWith('.ts')) return 'typescript';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.html')) return 'html';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.md')) return 'markdown';
  if (path.endsWith('.env') || path.endsWith('.example')) return 'dotenv';
  return 'text';
};

export const generateProjectCode = async (
  projectId: string,
  nodes: ICanvasNode[],
  prompt: string,
  onProgress: (stage: string, file?: string) => void
): Promise<GeneratedFile[]> => {
  const context = await buildContext(projectId);
  const entities = nodes.filter(n => n.type === 'database' || n.type === 'service').map(n => n.label);
  const projectContext = `${context}\nProject description: ${prompt}\nMain entities: ${entities.join(', ')}`;

  onProgress('planning');

  // Step 1: Plan the file structure
  let planJSON: { frontendFiles: Array<{path: string; description: string}>; backendFiles: Array<{path: string; description: string}>; configFiles: Array<{path: string; description: string}>; projectName: string };
  try {
    const planRaw = await groqComplete(PLANNER_SYSTEM_PROMPT, projectContext, 'llama-3.3-70b-versatile');
    const cleaned = planRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    planJSON = JSON.parse(jsonMatch![0]);
  } catch {
    planJSON = {
      projectName: 'generated-app',
      frontendFiles: [
        { path: 'src/App.jsx', description: 'Main app component with routing' },
        { path: 'src/components/Header.jsx', description: 'Navigation header' },
        { path: 'src/pages/Dashboard.jsx', description: 'Main dashboard page' },
        { path: 'src/index.css', description: 'Global styles' },
      ],
      backendFiles: [
        { path: 'server.js', description: 'Express.js server with REST API' },
        { path: 'routes/api.js', description: 'API routes for all entities' },
      ],
      configFiles: [
        { path: 'package.json', description: 'Project dependencies' },
        { path: 'vite.config.js', description: 'Vite configuration' },
        { path: 'index.html', description: 'HTML entry point' },
        { path: '.env.example', description: 'Environment variables template' },
      ],
    };
  }

  const files: GeneratedFile[] = [];

  // Step 2: Generate frontend files
  for (const fileInfo of planJSON.frontendFiles) {
    onProgress('frontend', fileInfo.path);
    try {
      const content = await groqComplete(
        'You are a frontend developer. Generate clean React JSX code. Return ONLY the raw code, no markdown fences.',
        FRONTEND_FILE_PROMPT(fileInfo, projectContext),
        'llama-3.3-70b-versatile'
      );
      files.push({ path: fileInfo.path, content: content.replace(/```[\w]*\n?/g, '').replace(/```\n?/g, '').trim(), language: getLanguage(fileInfo.path) });
    } catch {
      files.push({ path: fileInfo.path, content: `// Error generating ${fileInfo.path}`, language: getLanguage(fileInfo.path) });
    }
  }

  // Step 3: Generate backend files
  for (const fileInfo of planJSON.backendFiles) {
    onProgress('backend', fileInfo.path);
    try {
      const content = await groqComplete(
        'You are a backend developer. Generate clean Node.js Express code. Return ONLY the raw code, no markdown fences.',
        BACKEND_FILE_PROMPT(fileInfo, projectContext),
        'llama-3.3-70b-versatile'
      );
      files.push({ path: fileInfo.path, content: content.replace(/```[\w]*\n?/g, '').replace(/```\n?/g, '').trim(), language: getLanguage(fileInfo.path) });
    } catch {
      files.push({ path: fileInfo.path, content: `// Error generating ${fileInfo.path}`, language: getLanguage(fileInfo.path) });
    }
  }

  // Step 4: Generate config files (package.json, etc.)
  onProgress('config');

  // Detect additional dependencies from prompt and entities
  const dependencies: Record<string, string> = {
    react: '^18.3.1',
    'react-dom': '^18.3.1',
    axios: '^1.7.0',
    'react-router-dom': '^6.24.0',
    express: '^4.19.2',
    cors: '^2.8.5',
  };

  const lowerPrompt = (prompt + projectContext).toLowerCase();
  if (lowerPrompt.includes('framer') || lowerPrompt.includes('motion')) dependencies['framer-motion'] = '^11.2.10';
  if (lowerPrompt.includes('lucide') || lowerPrompt.includes('icon')) dependencies['lucide-react'] = '^0.395.0';
  if (lowerPrompt.includes('mongoose') || lowerPrompt.includes('mongodb')) dependencies['mongoose'] = '^8.4.1';
  if (lowerPrompt.includes('bcrypt')) dependencies['bcryptjs'] = '^2.4.3';
  if (lowerPrompt.includes('jwt') || lowerPrompt.includes('token')) dependencies['jsonwebtoken'] = '^9.0.2';
  if (lowerPrompt.includes('zod')) dependencies['zod'] = '^3.23.8';

  // Add package.json
  files.push({
    path: 'package.json',
    content: JSON.stringify({
      name: planJSON.projectName || 'generated-app',
      version: '1.0.0',
      type: 'module',
      scripts: { dev: 'vite', build: 'vite build', start: 'node server.js' },
      dependencies,
      devDependencies: { '@vitejs/plugin-react': '^4.3.1', vite: '^5.3.4', tailwindcss: '^3.4.6' }
    }, null, 2),
    language: 'json',
  });

  // Add vite.config.js
  files.push({
    path: 'vite.config.js',
    content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})`,
    language: 'javascript',
  });

  // Add index.html
  files.push({
    path: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${planJSON.projectName || 'Generated App'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`,
    language: 'html',
  });

  // Add main.jsx
  files.push({
    path: 'src/main.jsx',
    content: `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`,
    language: 'javascript',
  });

  // Add README
  onProgress('readme');
  try {
    const readme = await groqComplete(
      'You are a technical writer. Generate a clear README.md. Return only markdown.',
      README_PROMPT(planJSON.projectName, entities, { frontend: 'React + Vite + Tailwind', backend: 'Node.js + Express', database: 'In-memory / JSON' }),
      'llama-3.3-70b-versatile'
    );
    files.push({ path: 'README.md', content: readme, language: 'markdown' });
  } catch {
    files.push({ path: 'README.md', content: `# ${planJSON.projectName}\n\nGenerated by VisualFlow AI\n\n## Run\n\`\`\`\nnpm install\nnpm run dev\n\`\`\``, language: 'markdown' });
  }

  return files;
};
