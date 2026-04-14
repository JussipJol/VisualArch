import { ArchitectureData } from '../types';

export const PromptBuilders = {
  buildPlanningPrompt(prompt: string, designContext?: string | null): string {
    const basePlanPrompt = `
      As a lead architect, design a system architecture for: "${prompt}"
      Technical Requirements: Use modern stack (React, Node, etc. where applicable).
      
      Keep it to 4-8 nodes for a clean diagram.
    `;

    if (designContext) {
      return `
        Visual Design Context from User Sketch:
        ${designContext}
        
        ${basePlanPrompt}
        
        IMPORTANT: Prioritize components and relationships found in the Visual Design Context.
      `;
    }
    return basePlanPrompt;
  },

  buildCodingPrompt(nodeLabel: string, nodeDescription: string, systemPrompt: string): string {
    return `
      Generate 2 core files (code and types) for the component: "${nodeLabel}" (${nodeDescription})
      Context: High-level architecture for ${systemPrompt}.
      
      Return JSON: { files: [{ name, path, content, language }] }
    `;
  },

  buildCritiquePrompt(systemPrompt: string, techStack: string[], nodes: { label: string }[]): string {
    return `
      Analyze this architecture for: "${systemPrompt}"
      Tech Stack: ${techStack.join(', ')}
      Nodes: ${nodes.map(n => n.label).join(', ')}
      
      Return JSON: { score: number (0-100), issues: [{ severity: 'critical'|'warning'|'info', title, description, suggestion }] }
    `;
  },

  buildReconciliationPrompt(originalArch: ArchitectureData, modifiedFilesDiffs: string[]): string {
    return `
      You are an Architectural Reconciliation Engine.
      
      Current Architecture JSON:
      ${JSON.stringify(originalArch, null, 2)}
      
      User has modified the following system code (Diffs):
      ${modifiedFilesDiffs.join('\n\n')}
      
      TASK:
      Analyze if these code changes imply changes to the architecture graph.
      - Did the user add a new service dependency? (New Edge)
      - Did the user implement a new component/database? (New Node)
      - Did the user refactor a layer? (Update Node Metadata)
      
      Return a JSON object:
      {
        "architectureData": { ...updated nodes/edges JSON ... },
        "report": "A human-readable report summarizing what was reconciled."
      }
      
      Keep the node IDs stable if they still exist. Only add or remove if absolutely implied by the code.
    `;
  }
};
