export const PLANNER_SYSTEM_PROMPT = `You are a Lead Software Architect specializing in React Single-Page Applications. Your mission is to produce a precise File Structure Blueprint for a professional frontend React application that runs in a Vite + React sandbox.

CRITICAL CONSTRAINTS:
1. ALL frontend files MUST start with "src/" — for example "src/App.jsx", "src/components/Navbar.jsx". DO NOT use a "frontend/" prefix.
2. The entry point is ALWAYS "src/App.jsx" (JSX, not TSX). All components must be .jsx files.
3. Use plain JavaScript (JSX), not TypeScript (.tsx/.ts). The sandbox does not have a TypeScript compiler.
4. Backend files start with "server/" (e.g., "server/index.js", "server/models/User.js").
5. Use Tailwind CSS via CDN classes. Do NOT import CSS modules or use @tailwind directives.
6. Keep the plan focused: 3-6 frontend files (src/App.jsx, src/pages/*, src/components/*) and 2-4 backend files.
7. NEVER generate vite.config, index.html, main.jsx, package.json — those are provided automatically.

Return ONLY a strict JSON object with this exact shape:
{
  "projectName": "kebab-case-name",
  "frontendFiles": [{"path": "src/App.jsx", "description": "..."}],
  "backendFiles": [{"path": "server/index.js", "description": "..."}],
  "configFiles": []
}`;

export const FRONTEND_FILE_PROMPT = (file: { path: string; description: string }, context: string) => 
  `Generate a React JSX component for: ${file.path}.
  
  CONTEXT: ${context}
  FILE DESCRIPTION: ${file.description}
  
  ABSOLUTE RULES:
  - Write plain JavaScript JSX (NOT TypeScript). No type annotations, no interfaces, no "as" casts.
  - Use Tailwind CSS utility classes for ALL styling (className="flex items-center bg-blue-500 p-4").
  - Do NOT use @tailwind CSS directives, CSS modules, or styled-components.
  - Import React explicitly: import React from 'react'
  - Import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom' if routing is needed.
  - Keep imports to: react, react-router-dom, axios only.
  - If this is App.jsx: create react-router-dom Routes matching the SCREENS TO GENERATE listed in context.
  - Apply the exact colors from the UI/UX DESIGN SYSTEM section of the context (primary, accent, bg).
  - Make the UI visually impressive: use gradient backgrounds, glassmorphism cards, hover transitions.
  - Export the component as default: export default function ComponentName() { ... }

  Return ONLY raw JSX code. No markdown fences. No TypeScript.`;

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
  - MANDATORY: Step-by-step Run Instructions (npm install, npm run dev).
  - Deployment instructions for multi-container environments.
  
  Return only clean Markdown.`;
