import React, { useState } from 'react';
import { Cpu, Zap } from 'lucide-react';
import { MetricCard } from '../components/prediction/MetricCard';
import { PredictionForm } from '../components/prediction/PredictionForm';
import { ResultPanel } from '../components/prediction/ResultPanel';
import { LogsTable } from '../components/prediction/LogsTable';
import {
  MODEL_METRICS,
  DEFAULT_PARAMS,
  runInference,
  type PredictionParams,
  type PredictionResult,
} from '../constants/mlConfig';

export function Prediction() {
  const [params, setParams] = useState<PredictionParams>(DEFAULT_PARAMS);
  const [result, setResult] = useState<PredictionResult | null>(() => runInference(DEFAULT_PARAMS));
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    Array<{ id: string; params: PredictionParams; result: PredictionResult }>
  >(() => [
    {
      id: 'init-1',
      params: DEFAULT_PARAMS,
      result: runInference(DEFAULT_PARAMS),
    },
    {
      id: 'init-2',
      params: {
        category: 'Furniture',
        subCategory: 'Chairs',
        region: 'East',
        segment: 'Corporate',
        quantity: 4,
        discount: 0.15,
        shipMode: 'Second Class',
      },
      result: runInference({
        category: 'Furniture',
        subCategory: 'Chairs',
        region: 'East',
        segment: 'Corporate',
        quantity: 4,
        discount: 0.15,
        shipMode: 'Second Class',
      }),
    },
  ]);

  const handlePredict = (activeParams: PredictionParams) => {
    setLoading(true);
    setTimeout(() => {
      const forecast = runInference(activeParams);
      setResult(forecast);
      setHistory(prev => [
        {
          id: `pred-${Date.now()}`,
          params: { ...activeParams },
          result: forecast,
        },
        ...prev.slice(0, 9),
      ]);
      setLoading(false);
    }, 280);
  };

  const handleSelectFromHistory = (reloadedParams: PredictionParams) => {
    setParams(reloadedParams);
    handlePredict(reloadedParams);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Sales Prediction
          </h1>
        </div>

        {/* Live Engine Status Badges */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <Cpu size={13} />
            <span>Random Forest</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready</span>
          </div>
        </div>
      </div>

      {/* Section 1: Model Metric Cards (5 Columns on Desktop) */}
      <section aria-label="Model Performance Metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {MODEL_METRICS.map((metric, index) => (
            <MetricCard key={metric.id} item={metric} index={index} />
          ))}
        </div>
      </section>

      {/* Section 2: Main Grid — Input Form (7 cols) + Hero Output Panel (5 cols) */}
      <section aria-label="Prediction Configuration and Results">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7">
            <PredictionForm
              params={params}
              onChange={setParams}
              onSubmit={handlePredict}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-5">
            <ResultPanel
              result={result}
              params={params}
              loading={loading}
            />
          </div>
        </div>
      </section>




      {/* Section 4: Recent Predictions Audit Log Table */}
      <section aria-label="Prediction History">
        <LogsTable
          logs={history}
          onClear={handleClearHistory}
          onSelect={handleSelectFromHistory}
        />
      </section>
    </div>
  );
}
