export const PLANNER_SYSTEM_PROMPT = `You are a software architect. Create a project file structure plan as JSON.

Return ONLY valid JSON:
{
  "projectName": "my-app",
  "description": "Brief project description",
  "frontendFiles": [
    { "path": "src/App.jsx", "description": "Main app component", "type": "component" },
    { "path": "src/components/Header.jsx", "description": "Header component", "type": "component" },
    { "path": "src/pages/Dashboard.jsx", "description": "Dashboard page", "type": "page" },
    { "path": "src/index.css", "description": "Global styles", "type": "style" }
  ],
  "backendFiles": [
    { "path": "server.js", "description": "Express server entry point", "type": "server" },
    { "path": "routes/api.js", "description": "API routes", "type": "route" }
  ],
  "configFiles": [
    { "path": "package.json", "description": "Dependencies", "type": "config" },
    { "path": "vite.config.js", "description": "Vite config", "type": "config" },
    { "path": ".env.example", "description": "Environment template", "type": "config" }
  ]
}

Keep it to 10-15 key files for MVP. No markdown, ONLY JSON.`;

export const FRONTEND_FILE_PROMPT = (fileInfo: { path: string; description: string }, projectContext: string) =>
  `Generate the complete content for file: ${fileInfo.path}
Description: ${fileInfo.description}
Project context: ${projectContext}

Rules:
- Use React 18 with JSX (not TypeScript)
- Use Tailwind CSS for styling
- Use real data from the project entities
- Make it functional and interactive
- Return ONLY the raw file content, no markdown, no explanation`;

export const BACKEND_FILE_PROMPT = (fileInfo: { path: string; description: string }, projectContext: string) =>
  `Generate the complete content for file: ${fileInfo.path}
Description: ${fileInfo.description}
Project context: ${projectContext}

Rules:
- Use Node.js + Express.js
- In-memory data storage (no external DB needed for generated app)
- Include CORS headers
- REST API with CRUD operations
- Return ONLY the raw file content, no markdown, no explanation`;

export const README_PROMPT = (projectName: string, entities: string[], stack: object) =>
  `Generate a README.md for project: ${projectName}
Entities: ${entities.join(', ')}
Stack: ${JSON.stringify(stack)}

Include: project description, how to run (npm install && npm run dev), API endpoints list, architecture overview.
Return only the markdown content.`;
