import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Award,
  Copy,
  Check,
} from 'lucide-react';
import type { PredictionParams, PredictionResult } from '../../constants/mlConfig';
import { money } from '../../utils/format';

interface ResultPanelProps {
  result: PredictionResult | null;
  params: PredictionParams;
  loading: boolean;
}

function useCountUp(target: number, duration: number = 400) {
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = current;
    const diff = target - startVal;

    if (diff === 0) return;

    let frameId: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round((startVal + diff * ease) * 100) / 100);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return current;
}

export function ResultPanel({ result, params, loading }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const targetSales = result?.sales ?? 0;
  const animatedSales = useCountUp(targetSales, 450);

  const handleCopy = () => {
    if (!result) return;
    const text = `Predicted Sales: ${money(result.sales)} (95% CI: ${money(result.range[0])} - ${money(result.range[1])})
Projected Profit: ${money(result.profit)}
Item: ${params.subCategory}, Qty: ${params.quantity}, Discount: ${Math.round(params.discount * 100)}%`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#111831] justify-center items-center text-center py-16">
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 grid place-items-center mb-3">
          <span className="h-5 w-5 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Generating Prediction...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#111831] justify-center items-center text-center py-16">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Prediction Yet</p>
      </div>
    );
  }

  const rangeSpan = Math.max(1, result.range[1] - result.range[0]);
  const currentPos = Math.min(100, Math.max(0, ((result.sales - result.range[0]) / rangeSpan) * 100));
  const profitMargin = ((result.profit / (result.sales || 1)) * 100).toFixed(1);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111831] md:p-6 justify-between space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Award size={16} />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Predicted Revenue
          </h3>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#162040] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition"
          aria-label="Copy result"
        >
          {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Hero Card */}
      <motion.div
        key={result.timestamp}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-slate-500/5 to-purple-500/10 p-5 backdrop-blur-sm dark:border-blue-500/30 dark:from-blue-900/20 dark:via-[#111831] dark:to-purple-900/20"
      >
        <div className="flex items-start justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Forecasted Sales
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
              result.tier === 'High Value'
                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                : result.tier === 'Medium Value'
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                : 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/30'
            }`}
          >
            {result.tier}
          </span>
        </div>

        {/* Hero Number */}
        <div className="my-3">
          <div className="font-mono-numbers text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {money(animatedSales)}
          </div>
        </div>

        {/* Confidence Interval Range Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/[0.08]">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Confidence Interval</span>
            <span className="font-mono-numbers text-blue-600 dark:text-blue-400">
              {money(result.range[0])} – {money(result.range[1])}
            </span>
          </div>

          <div className="mt-2 relative h-3 rounded-full bg-slate-200/80 dark:bg-[#0d1326] p-0.5">
            <div className="h-full rounded-full bg-blue-500/30 dark:bg-blue-500/40 w-full relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow-md dark:border-slate-900 transition-all duration-300"
                style={{ left: `${currentPos}%` }}
              />
            </div>
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-slate-400 font-mono-numbers">
            <span>{money(result.range[0])}</span>
            <span>{money(result.range[1])}</span>
          </div>
        </div>
      </motion.div>

      {/* 2-Col Metrics: Profit & Model Certainty */}
      <div className="grid grid-cols-2 gap-3">
        {/* Projected Profit */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-white/[0.08] dark:bg-[#162040]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
              Estimated Profit
            </span>
            {result.profit >= 0 ? (
              <TrendingUp size={14} className="text-emerald-500" />
            ) : (
              <TrendingDown size={14} className="text-red-500" />
            )}
          </div>
          <p
            className={`font-mono-numbers mt-1.5 text-xl font-bold ${
              result.profit >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {money(result.profit)}
          </p>
          <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400 font-mono-numbers">
            {profitMargin}% margin
          </span>
        </div>

        {/* Model Certainty */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-white/[0.08] dark:bg-[#162040]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
              Confidence
            </span>
            <ShieldCheck size={14} className="text-blue-500" />
          </div>
          <p className="font-mono-numbers mt-1.5 text-xl font-bold text-slate-900 dark:text-white">
            {result.confidence}%
          </p>
          <span className="mt-0.5 block text-[11px] text-emerald-600 dark:text-emerald-400">
            High Precision
          </span>
        </div>
      </div>
    </div>
  );
}
