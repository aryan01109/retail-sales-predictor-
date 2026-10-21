import { memo } from 'react';
import type { PageId } from './types';
import ParticleCanvas from './ParticleCanvas';
import AmbientGlow from './AmbientGlow';
import NeuralGrid from './NeuralGrid';

/**
 * MultiAgentBackground — The top-level background experience layer.
 *
 * Architecture:
 *   Layer 1: Dark gradient base (CSS)
 *   Layer 2: Neural technical grid (CSS)
 *   Layer 3: Ambient radial glow orbs (CSS)
 *   Layer 4: Agent network + data-stream particles (Canvas)
 *
 * The entire layer sits at z-index: 0, with pointer-events: none.
 * It never interferes with existing UI components.
 */
function MultiAgentBackground({ page }: { page: PageId }) {
  return (
    <div
      className="ag-background"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Layer 1: Dark gradient base */}
      <div className="ag-base-gradient" />

      {/* Layer 2: Technical grid + circuit accents */}
      <NeuralGrid />

      {/* Layer 3: Ambient radial glow orbs */}
      <AmbientGlow page={page} />

      {/* Layer 4: Agent nodes, connections, data-stream particles */}
      <ParticleCanvas page={page} />

      {/* Layer 5: Very subtle vignette for edge darkening */}
      <div className="ag-vignette" />
    </div>
  );
}

export default memo(MultiAgentBackground);
