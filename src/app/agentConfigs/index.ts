// SDK imports commented out for Cloudflare Edge Runtime compatibility
// import { simpleHandoffScenario } from './simpleHandoff';
// import { customerServiceRetailScenario } from './customerServiceRetail';
// import { chatSupervisorScenario } from './chatSupervisor';
// import { businessBuilderScenario } from './businessBuilder';

// import type { RealtimeAgent } from '@openai/agents/realtime';

// Map of scenario key -> array of RealtimeAgent objects
// Commented out for deployment - SDK not compatible with Edge Runtime
export const allAgentSets: Record<string, any[]> = {
  // businessBuilder: businessBuilderScenario,
  // simpleHandoff: simpleHandoffScenario,
  // customerServiceRetail: customerServiceRetailScenario,
  // chatSupervisor: chatSupervisorScenario,
};

export const defaultAgentSetKey = 'businessBuilder';
