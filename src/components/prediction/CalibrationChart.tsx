import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import { CALIBRATION_SCATTER_DATA } from '../../constants/mlConfig';
import { money } from '../../utils/format';
import { Activity } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const pt = payload[0].payload;
    const delta = pt.predicted - pt.actual;
    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-xl backdrop-blur-md dark:border-white/[0.1] dark:bg-[#111831]/95 text-xs">
        <p className="font-semibold text-slate-900 dark:text-white">{pt.item}</p>
        <div className="mt-1 space-y-0.5 font-mono-numbers">
          <div className="flex justify-between gap-3 text-slate-500">
            <span>Actual:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{money(pt.actual)}</span>
          </div>
          <div className="flex justify-between gap-3 text-slate-500">
            <span>Predicted:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{money(pt.predicted)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function CalibrationChart() {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111831] md:p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Activity size={16} />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Model Calibration
          </h3>
        </div>

        <span className="font-mono-numbers rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          R² = 0.892
        </span>
      </div>

      <div className="mt-4 flex-1 h-[270px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 15, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              type="number"
              dataKey="actual"
              name="Actual Sales"
              domain={[0, 1100]}
              tickFormatter={v => `$${v}`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{
                value: 'Actual Sales ($)',
                position: 'insideBottom',
                offset: -10,
                fontSize: 11,
                fill: '#64748b',
              }}
            />
            <YAxis
              type="number"
              dataKey="predicted"
              name="Predicted Sales"
              domain={[0, 1100]}
              tickFormatter={v => `$${v}`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{
                value: 'Predicted Sales ($)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 11,
                fill: '#64748b',
              }}
            />
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: 1050, y: 1050 },
              ]}
              stroke="#8B5CF6"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'y = x',
                position: 'top',
                fill: '#8B5CF6',
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#94a3b8' }} />
            <Scatter name="Test Observations" data={CALIBRATION_SCATTER_DATA} fill="#3B82F6">
              {CALIBRATION_SCATTER_DATA.map((entry, index) => {
                const diff = Math.abs(entry.predicted - entry.actual);
                return (
                  <Cell
                    key={`point-${index}`}
                    fill={diff < 20 ? '#10B981' : diff < 40 ? '#3B82F6' : '#F59E0B'}
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
