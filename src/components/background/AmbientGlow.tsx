import { useMemo } from 'react';
import type { PageId } from './types';
import { PAGE_CONFIGS } from './agentData';

/**
 * AmbientGlow — Large, soft radial gradient orbs that drift subtly
 * behind the application. Pure CSS, zero JS animation overhead.
 */
export default function AmbientGlow({ page }: { page: PageId }) {
  const config = PAGE_CONFIGS[page];

  const orbs = useMemo(() => {
    const [r, g, b] = hexToRgb(config.ambientColor);
    return [
      // Primary page-color orb — top-left of main content area
      {
        key: 'primary',
        bg: `radial-gradient(ellipse 55% 45% at 50% 10%, rgba(${r},${g},${b},0.06) 0%, transparent 70%)`,
        className: 'ag-orb ag-orb--1',
      },
      // Blue orb — bottom-right
      {
        key: 'blue',
        bg: `radial-gradient(ellipse 45% 40% at 80% 85%, rgba(59,130,246,0.04) 0%, transparent 70%)`,
        className: 'ag-orb ag-orb--2',
      },
      // Violet orb — top-right
      {
        key: 'violet',
        bg: `radial-gradient(ellipse 40% 35% at 85% 15%, rgba(139,92,246,0.035) 0%, transparent 65%)`,
        className: 'ag-orb ag-orb--3',
      },
      // Cyan orb — center-left
      {
        key: 'cyan',
        bg: `radial-gradient(ellipse 35% 30% at 15% 55%, rgba(34,211,238,0.03) 0%, transparent 65%)`,
        className: 'ag-orb ag-orb--4',
      },
    ];
  }, [config.ambientColor]);

  return (
    <div className="ag-ambient-layer" aria-hidden="true">
      {orbs.map(orb => (
        <div key={orb.key} className={orb.className} style={{ background: orb.bg }} />
      ))}
    </div>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}
