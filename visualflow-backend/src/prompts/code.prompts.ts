export const PLANNER_SYSTEM_PROMPT = `You are a Lead Software Architect specializing in Full-Stack Distribution and Cloud Native Systems. Your mission is to produce a high-fidelity File Structure Blueprint for a professional split-architecture project.

OBJECTIVES:
1. ARCHITECTURAL SEPARATION: You MUST divide the project into two distinct root-level domains: /frontend (Modern React/Next.js) and /backend (Industrial Node.js/Express).
2. BACKEND COMPLEXITY: Implement a robust folder structure including: /src/controllers, /src/services, /src/models (Mongoose/MongoDB), /src/middleware, and /src/repository.
3. FRONTEND SOPHISTICATION: Use a feature-based structure: /src/components/shared, /src/features (auth, dashboard, payments), /src/hooks, /src/store, and /src/styles/theme.
4. DATABASE FIDELITY: Every database node in the architecture MUST have a corresponding Mongoose model file with a complex schema including relations and validation.
5. SECURITY & UTILS: Include boilerplate for JWT auth, CORS, Rate Limiting, and centralized error handling.

Your response must be a strict JSON object mapping the entire file tree. Ensure every file has a technical description. Return ONLY valid JSON.`;

export const FRONTEND_FILE_PROMPT = (file: { path: string; description: string }, context: string) => 
  `Generate an Elite React component/file for: ${file.path}.
  
  CONTEXT: ${context}
  FILE DESCRIPTION: ${file.description}
  
  TECHNICAL REQUIREMENTS (30 Sentences Guidance):
  - Use Functional Components with TypeScript (or clean JSX).
  - Implement a highly responsive UI using Tailwind CSS utility classes.
  - Follow the Design Tokens provided (colors, spacing, fonts).
  - Ensure strict separation between UI (Components) and Logic (Hooks/Services).
  - Use modular imports.
  - Implement error boundaries and loading states where appropriate.
  - Add professional JSDoc comments for every function.
  - Ensure the code is production-ready, accessible (Aria-labels), and performant.
  - If it involves data, use Axios for API calls to the /api endpoint.
  
  Return ONLY raw code. No markdown fences.`;

export const BACKEND_FILE_PROMPT = (file: { path: string; description: string }, context: string) => 
  `Generate an Industrial-Grade Node.js/Express file for: ${file.path}.
  
  CONTEXT: ${context}
  FILE DESCRIPTION: ${file.description}
  
  TECHNICAL REQUIREMENTS (30 Sentences Guidance):
  - Follow the Clean Architecture pattern: Controllers call Services, Services call Repositories/Models.
  - Implement extremely robust Error Handling and Request Validation.
  - For MongoDB models: Use Mongoose, define complex schemas with virtuals, pre-save hooks, and population.
  - For Controllers: Use try/catch blocks and centralized error logging.
  - For Services: Implement pure business logic without direct DB access; use repositories.
  - Ensure the API matches the Blueprint paths.
  - Include professional documentation for every endpoint.
  - Secure all routes with the Auth middleware where necessary.
  
  Return ONLY raw code. No markdown fences.`;

export const README_PROMPT = (name: string, entities: string[], stack: any) =>
  `Generate a Professional Enterprise README for ${name}. 
  Include: 
  - Visionary project description.
  - High-level Architectural Overview.
  - Detailed Tech Stack (${JSON.stringify(stack)}).
  - Entity-Relationship walkthrough (${entities.join(', ')}).
  - Setup and Deployment instructions for multi-container environments.
  
  Return only clean Markdown.`;
