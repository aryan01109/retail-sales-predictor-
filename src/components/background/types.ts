/** Types for the Multi-Agent Background system */

export type { PageId } from '../../types';

export interface AgentNodeDef {
  id: string;
  label: string;
  /** Position as percentage of viewport */
  x: number;
  y: number;
  color: string;
  /** Size of the node circle */
  radius: number;
  /** Agent category for page-specific emphasis */
  category: 'data' | 'processing' | 'analysis' | 'intelligence' | 'output';
}

export interface ConnectionDef {
  from: string;
  to: string;
  /** 0–1, how prominent this connection is */
  strength: number;
}

export interface PageAgentConfig {
  /** Which agents to emphasize (higher opacity) */
  emphasized: string[];
  /** Additional ambient color tint for this page */
  ambientColor: string;
  /** Label shown subtly near the network */
  flowLabel?: string;
}
