import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { FEATURE_IMPORTANCE_DATA } from '../../constants/mlConfig';
import { Layers } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-xl backdrop-blur-md dark:border-white/[0.1] dark:bg-[#111831]/95 text-xs">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{data.feature}</p>
        <p className="mt-0.5 font-bold text-blue-600 dark:text-blue-400 font-mono-numbers">
          {data.importance}% weight
        </p>
      </div>
    );
  }
  return null;
}

export function FeatureChart() {
  const sortedData = [...FEATURE_IMPORTANCE_DATA].sort((a, b) => b.importance - a.importance);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111831] md:p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Layers size={16} />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Feature Importance
          </h3>
        </div>
      </div>

      <div className="mt-4 flex-1 h-[270px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 35, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="barGradientPrimary" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="rgba(148, 163, 184, 0.15)"
            />
            <XAxis
              type="number"
              domain={[0, 45]}
              unit="%"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <YAxis
              type="category"
              dataKey="feature"
              width={105}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
            <Bar
              dataKey="importance"
              fill="url(#barGradientPrimary)"
              radius={[0, 6, 6, 0]}
              barSize={18}
              label={{
                position: 'right',
                formatter: (val: any) => `${val}%`,
                fill: '#64748b',
                fontSize: 11,
                fontWeight: 600,
                dx: 4,
              }}
            >
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? 'url(#barGradientPrimary)' : index === 1 ? '#3B82F6' : '#60A5FA'}
                  opacity={1 - index * 0.1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
