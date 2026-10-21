import type { AgentNodeDef, ConnectionDef, PageAgentConfig, PageId } from './types';

/* ─── Agent Nodes ──────────────────────────────────────────
   Positions are % of viewport. They cluster near edges
   and corners so they never occlude dashboard content.
   ────────────────────────────────────────────────────────── */
export const AGENT_NODES: AgentNodeDef[] = [
  { id: 'data',        label: 'Data',        x:  8,  y: 12, color: '#3B82F6', radius: 6,  category: 'data' },
  { id: 'cleaning',    label: 'Cleaning',    x:  6,  y: 30, color: '#22D3EE', radius: 5,  category: 'processing' },
  { id: 'sales',       label: 'Sales',       x:  4,  y: 50, color: '#60A5FA', radius: 5.5,category: 'analysis' },
  { id: 'product',     label: 'Product',     x:  7,  y: 68, color: '#8B5CF6', radius: 5.5,category: 'analysis' },
  { id: 'customer',    label: 'Customer',    x:  5,  y: 85, color: '#34D399', radius: 5.5,category: 'analysis' },
  { id: 'statistical', label: 'Statistics',  x: 92,  y: 18, color: '#F59E0B', radius: 5,  category: 'analysis' },
  { id: 'anomaly',     label: 'Anomaly',     x: 94,  y: 38, color: '#EF4444', radius: 5,  category: 'intelligence' },
  { id: 'ml',          label: 'ML',          x: 93,  y: 58, color: '#7C3AED', radius: 6,  category: 'intelligence' },
  { id: 'insight',     label: 'Insights',    x: 91,  y: 78, color: '#10B981', radius: 5.5,category: 'output' },
];

/* ─── Connections between agents ─────────────────────────── */
export const CONNECTIONS: ConnectionDef[] = [
  { from: 'data',     to: 'cleaning',    strength: 0.8 },
  { from: 'cleaning', to: 'sales',       strength: 0.7 },
  { from: 'cleaning', to: 'product',     strength: 0.7 },
  { from: 'cleaning', to: 'customer',    strength: 0.7 },
  { from: 'sales',    to: 'statistical', strength: 0.6 },
  { from: 'product',  to: 'statistical', strength: 0.5 },
  { from: 'customer', to: 'statistical', strength: 0.5 },
  { from: 'statistical', to: 'anomaly',  strength: 0.7 },
  { from: 'anomaly',  to: 'ml',          strength: 0.8 },
  { from: 'ml',       to: 'insight',     strength: 0.9 },
  // Cross connections
  { from: 'data',     to: 'statistical', strength: 0.3 },
  { from: 'sales',    to: 'anomaly',     strength: 0.3 },
  { from: 'product',  to: 'ml',          strength: 0.3 },
  { from: 'customer', to: 'insight',     strength: 0.3 },
];

/* ─── Page-specific emphasis ─────────────────────────────── */
export const PAGE_CONFIGS: Record<PageId, PageAgentConfig> = {
  prediction: {
    emphasized: ['ml', 'statistical', 'anomaly', 'insight', 'data'],
    ambientColor: '#7C3AED',
    flowLabel: 'ML Prediction',
  },
};
