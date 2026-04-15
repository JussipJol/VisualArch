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
  onProgress: (stage: string, file?: string, chunk?: string) => void,
  overrideDesignSystem?: any
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

  // Use the injected design system if provided, otherwise fallback to DB
  const designSystem = overrideDesignSystem || (project?.designSystem as any);
  const designTheme = designSystem?.theme || null;
  const designScreens: Array<{ name: string; path: string; elements: Array<{ type: string; label: string }> }> = 
    designSystem?.screens || [];

  // Build a readable screen summary for the AI prompt
  const screenSummary = designScreens.length > 0
    ? designScreens.map((s: any) => 
        `  - ${s.name} (${s.path}): [${(s.elements || []).map((e: any) => `${e.type}:${e.label}`).join(', ')}]`
      ).join('\n')
    : '  (no wireframe screens — generate a reasonable layout based on the architecture)';

  const themeSummary = designTheme
    ? `Colors: primary=${designTheme.primary || '#6366f1'}, accent=${designTheme.accent || '#10b981'}, bg=${designTheme.background || '#020617'}
Font: ${designTheme.fontFamily || 'Inter'}
Border radius: ${designTheme.borderRadius || 12}px`
    : 'Dark theme: bg=#0f172a, primary=#6366f1, accent=#10b981, text=#f8fafc';

  const projectContext = `
    MASTER ARCHITECTURE BLUEPRINT:
    ${JSON.stringify(blueprintDetails, null, 2)}
    
    UI/UX DESIGN SYSTEM:
    ${themeSummary}
    
    SCREENS TO GENERATE (from wireframe):
${screenSummary}
    
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
      projectName: 'generated-app',
      frontendFiles: [
        { path: 'src/App.jsx', description: 'Root React component with routing and main layout' },
        { path: 'src/components/Navbar.jsx', description: 'Responsive navigation bar with links' },
        { path: 'src/pages/Dashboard.jsx', description: 'Main dashboard page with data display' },
      ],
      backendFiles: [
        { path: 'server/index.js', description: 'Express server entry with CORS and routes' },
        { path: 'server/models/User.js', description: 'Mongoose user schema' },
      ],
      configFiles: [],
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
  if (lowerPrompt.includes('framer') || lowerPrompt.includes('motion')) dependencies['framer-motion'] = '^11.3.2';
  if (lowerPrompt.includes('lucide') || lowerPrompt.includes('icon')) dependencies['lucide-react'] = '^0.400.0';
  if (lowerPrompt.includes('mongoose') || lowerPrompt.includes('mongodb')) dependencies['mongoose'] = '^8.5.1';
  if (lowerPrompt.includes('bcrypt')) dependencies['bcryptjs'] = '^2.4.3';
  if (lowerPrompt.includes('jwt') || lowerPrompt.includes('token')) dependencies['jsonwebtoken'] = '^9.0.2';
  if (lowerPrompt.includes('zod')) dependencies['zod'] = '^3.23.8';
  if (lowerPrompt.includes('radix')) dependencies['@radix-ui/react-slot'] = '^1.1.0';
  if (lowerPrompt.includes('tailwind') || true) {
    dependencies['tailwind-merge'] = '^2.3.0';
    dependencies['clsx'] = '^2.1.1';
  }

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
    path: 'src/index.css',
    content: `/* Base styles — Tailwind is loaded via CDN in index.html */
body {
  margin: 0;
  min-height: 100vh;
  background-color: #0f172a;
  color: #f8fafc;
  font-family: 'Inter', system-ui, sans-serif;
}

#root {
  min-height: 100vh;
}`,
    language: 'css',
  });

  // Ensure src/App.jsx always exists as a valid entry point
  const hasAppJsx = files.some(f => f.path === 'src/App.jsx' || f.path === 'src/app.jsx');
  if (!hasAppJsx) {
    files.push({
      path: 'src/App.jsx',
      content: `import React from 'react';
import './index.css';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-400 mb-4">${planJSON.projectName || 'Generated App'}</h1>
        <p className="text-slate-400">Your AI-generated application is ready.</p>
      </div>
    </div>
  );
}`,
      language: 'javascript',
    });
  }

  files.push({
    path: 'src/main.jsx',
    content: `import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    language: 'javascript',
  });

  const entities = nodes.filter(n => n.type === 'database' || n.type === 'service').map(n => n.label);
  
  onProgress('readme');
  try {
    const readme = await aiOrchestrator.executeTask(
      AIModule.WRITER,
      {
        system: 'You are a technical writer. Generate a clear README.md. Focus on RUN INSTRUCTIONS. Return only markdown.',
        user: README_PROMPT(planJSON.projectName, entities, { frontend: 'React + Vite + Tailwind', backend: 'Node.js + Express', database: 'MongoDB (Blueprint-defined)' })
      }
    );
    files.push({ path: 'README.md', content: readme, language: 'markdown' });
  } catch {
    files.push({ path: 'README.md', content: `# ${planJSON.projectName}\n\nGenerated by VisualFlow AI\n\n## Structure\n- /frontend: React/Vite/Tailwind\n- /backend: Node.js/Express/MongoDB\n\n## Run\n\`\`\`\nnpm install\nnpm run dev\n\`\`\``, language: 'markdown' });
  }

  return files;
};
