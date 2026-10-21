import React from 'react';
import { History, Trash2, ArrowUpRight, Inbox } from 'lucide-react';
import type { PredictionParams, PredictionResult } from '../../constants/mlConfig';
import { money } from '../../utils/format';

interface HistoryItem {
  id: string;
  params: PredictionParams;
  result: PredictionResult;
}

interface LogsTableProps {
  logs: HistoryItem[];
  onClear: () => void;
  onSelect: (params: PredictionParams) => void;
}

export function LogsTable({ logs, onClear, onSelect }: LogsTableProps) {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#111831] overflow-hidden">
      {/* Table Header Controls */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/[0.06] md:px-6">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <History size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Predictions
            </h3>
          </div>
        </div>

        {logs.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition"
            aria-label="Clear prediction history"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Table / Empty State */}
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-[#162040] dark:text-slate-500">
            <Inbox size={24} />
          </div>
          <h4 className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
            No prediction logs yet
          </h4>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Generate your first sales forecast above or choose a quick scenario preset to populate history.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[380px] custom-scrollbar">
          <table className="w-full text-left text-[13px]">
            <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-[#0d1326]/95 dark:text-slate-400 border-b border-slate-200/70 dark:border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Item &amp; Category</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-center">Discount</th>
                <th className="py-3 px-4">Region / Segment</th>
                <th className="py-3 px-4 text-right">Predicted Sales</th>
                <th className="py-3 px-4 text-right">Profit Margin</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {logs.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-150 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 ${
                      isEven ? 'bg-transparent' : 'bg-slate-50/40 dark:bg-white/[0.015]'
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="py-3 px-4 font-mono-numbers text-[12px] text-slate-400">
                      {item.result.timestamp}
                    </td>

                    {/* Item & Category */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.params.subCategory}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {item.params.category}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-3 text-center font-mono-numbers font-medium text-slate-700 dark:text-slate-300">
                      {item.params.quantity}
                    </td>

                    {/* Discount */}
                    <td className="py-3 px-3 text-center font-mono-numbers">
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                          item.params.discount > 0.2
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {Math.round(item.params.discount * 100)}%
                      </span>
                    </td>

                    {/* Region / Segment */}
                    <td className="py-3 px-4 text-[12px] text-slate-600 dark:text-slate-400">
                      <div>{item.params.region}</div>
                      <span className="text-[11px] text-slate-400">{item.params.segment}</span>
                    </td>

                    {/* Predicted Sales */}
                    <td className="py-3 px-4 text-right font-mono-numbers font-bold text-slate-900 dark:text-white">
                      {money(item.result.sales)}
                    </td>

                    {/* Profit */}
                    <td className="py-3 px-4 text-right font-mono-numbers">
                      <span
                        className={`font-semibold ${
                          item.result.profit >= 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-500'
                        }`}
                      >
                        {money(item.result.profit)}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {((item.result.profit / (item.result.sales || 1)) * 100).toFixed(1)}% margin
                      </div>
                    </td>

                    {/* Re-load Action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onSelect(item.params)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200/90 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600 dark:border-white/[0.08] dark:bg-[#162040] dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:text-blue-400 transition"
                        title="Reload this parameter configuration into the form"
                      >
                        <span>Load</span>
                        <ArrowUpRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
