import { aiOrchestrator } from './ai/orchestrator.service';
import { AIModule } from './ai/ai.types';
import { PLANNER_SYSTEM_PROMPT, FRONTEND_FILE_PROMPT, BACKEND_FILE_PROMPT, README_PROMPT } from '../prompts/code.prompts';
import { buildContext } from './memory.service';
import { ICanvasNode } from '../types';
import { Project } from '../models/Project.model';

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
  onProgress: (stage: string, file?: string, chunk?: string) => void
): Promise<GeneratedFile[]> => {
  const context = await buildContext(projectId);
  const project = await Project.findById(projectId);
  
  // Enrich context with detailed blueprint metadata and design tokens
  const blueprintDetails = nodes.map(n => ({
    label: n.label,
    tech: n.tech,
    description: n.description,
    dbSchema: n.databaseMetadata
  }));

  const projectContext = `
    MASTER ARCHITECTURE BLUEPRINT:
    ${JSON.stringify(blueprintDetails, null, 2)}
    
    UI/UX DESIGN SYSTEM (Figma Tokens):
    ${JSON.stringify(project?.designSystem || 'No design tokens yet', null, 2)}
    
    SYSTEM CONTEXT:
    ${context}
    
    USER VISION:
    ${prompt}
  `;

  onProgress('planning');

  // Step 1: Industrial Blueprint Planning (Gemini 1.5 Pro)
  let planJSON: { 
    frontendFiles: Array<{path: string; description: string}>; 
    backendFiles: Array<{path: string; description: string}>; 
    configFiles: Array<{path: string; description: string}>; 
    projectName: string 
  };
  
  try {
    const planRaw = await aiOrchestrator.executeTask(
      AIModule.PLANNER,
      { system: PLANNER_SYSTEM_PROMPT, user: projectContext },
      { jsonMode: true }
    );
    const cleaned = planRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    planJSON = JSON.parse(jsonMatch![0]);
    
    // Validate structure
    if (!Array.isArray(planJSON.frontendFiles) || !Array.isArray(planJSON.backendFiles)) {
      throw new Error('Invalid plan structure');
    }
  } catch (error) {
    console.error('[CodeGen] Planning failed or returned invalid JSON, using industrial fallback');
    planJSON = {
      projectName: 'enterprise-app',
      frontendFiles: [
        { path: 'frontend/src/App.tsx', description: 'Root component with React Router and Provisioning' },
        { path: 'frontend/src/features/dashboard/DashboardPage.tsx', description: 'Complex dashboard with analytics' },
        { path: 'frontend/src/core/api/client.ts', description: 'Axios interceptors and base configuration' },
      ],
      backendFiles: [
        { path: 'backend/src/server.ts', description: 'Enterprise Express entry with security midware' },
        { path: 'backend/src/controllers/user.controller.ts', description: 'User domain controller' },
        { path: 'backend/src/models/User.model.ts', description: 'Mongoose user schema with validation' },
      ],
      configFiles: [
        { path: 'package.json', description: 'Workspace configuration' },
        { path: 'docker-compose.yml', description: 'Orchestration for mongo/redis' },
      ],
    };
  }

  const files: GeneratedFile[] = [];

  // Step 2: Full-Stack Feature Generation (Parallel Execution)
  // Generating Frontend
  for (const fileInfo of planJSON.frontendFiles) {
    onProgress('frontend', fileInfo.path);
    try {
      let content = '';
      await aiOrchestrator.executeStream(
        AIModule.FRONTEND,
        {
          system: 'You are an Elite Frontend Engineer. Follow the Architecture Blueprint and Design Tokens exactly. Return ONLY code.',
          user: FRONTEND_FILE_PROMPT(fileInfo, projectContext)
        },
        {
          onChunk: (chunk) => {
            content += chunk;
            onProgress('frontend', fileInfo.path, chunk);
          }
        }
      );
      files.push({ 
        path: fileInfo.path, 
        content: content.replace(/```[\w]*\n?/g, '').replace(/```\n?/g, '').trim(), 
        language: getLanguage(fileInfo.path) 
      });
    } catch {
      files.push({ path: fileInfo.path, content: `// Error generating ${fileInfo.path}`, language: getLanguage(fileInfo.path) });
    }
  }

  // Generating Backend
  for (const fileInfo of planJSON.backendFiles) {
    onProgress('backend', fileInfo.path);
    try {
      let content = '';
      await aiOrchestrator.executeStream(
        AIModule.BACKEND,
        {
          system: 'You are an Elite Backend Engineer. Implement Clean Architecture and robust MongoDB models. Return ONLY code.',
          user: BACKEND_FILE_PROMPT(fileInfo, projectContext)
        },
        {
          onChunk: (chunk) => {
            content += chunk;
            onProgress('backend', fileInfo.path, chunk);
          }
        }
      );
      files.push({ 
        path: fileInfo.path, 
        content: content.replace(/```[\w]*\n?/g, '').replace(/```\n?/g, '').trim(), 
        language: getLanguage(fileInfo.path) 
      });
    } catch {
      files.push({ path: fileInfo.path, content: `// Error generating ${fileInfo.path}`, language: getLanguage(fileInfo.path) });
    }
  }

  // Step 4: Generate config files
  onProgress('config');

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

  const entities = nodes.filter(n => n.type === 'database' || n.type === 'service').map(n => n.label);
  
  onProgress('readme');
  try {
    const readme = await aiOrchestrator.executeTask(
      AIModule.WRITER,
      {
        system: 'You are a technical writer. Generate a clear README.md. Return only markdown.',
        user: README_PROMPT(planJSON.projectName, entities, { frontend: 'React + Vite + Tailwind', backend: 'Node.js + Express', database: 'MongoDB (Blueprint-defined)' })
      }
    );
    files.push({ path: 'README.md', content: readme, language: 'markdown' });
  } catch {
    files.push({ path: 'README.md', content: `# ${planJSON.projectName}\n\nGenerated by VisualFlow AI\n\n## Structure\n- /frontend: React/Vite/Tailwind\n- /backend: Node.js/Express/MongoDB\n\n## Run\n\`\`\`\nnpm install\nnpm run dev\n\`\`\``, language: 'markdown' });
  }

  return files;
};
