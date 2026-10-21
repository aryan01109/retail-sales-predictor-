import React, { useState } from 'react';
import {
  RotateCcw,
  Zap,
  Plus,
  Minus,
  Sparkles,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import {
  CATEGORIES,
  SUB_CATEGORIES,
  REGIONS,
  SEGMENTS,
  SHIP_MODES,
  PRESETS,
  DEFAULT_PARAMS,
  type PredictionParams,
} from '../../constants/mlConfig';

interface PredictionFormProps {
  params: PredictionParams;
  onChange: (params: PredictionParams) => void;
  onSubmit: (params: PredictionParams) => void;
  loading: boolean;
}

export function PredictionForm({ params, onChange, onSubmit, loading }: PredictionFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCategoryChange = (cat: string) => {
    const availableSubs = SUB_CATEGORIES[cat] || [];
    onChange({
      ...params,
      category: cat,
      subCategory: availableSubs[0] || '',
    });
  };

  const handleQuantityStep = (delta: number) => {
    const nextVal = Math.min(100, Math.max(1, params.quantity + delta));
    onChange({ ...params, quantity: nextVal });
    if (errorMsg) setErrorMsg(null);
  };

  const handleDiscountChange = (val: number) => {
    onChange({ ...params, discount: Math.round(val * 100) / 100 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (params.quantity < 1) {
      setErrorMsg('Quantity must be at least 1.');
      return;
    }
    if (params.discount < 0 || params.discount > 0.8) {
      setErrorMsg('Discount must be between 0% and 80%.');
      return;
    }
    setErrorMsg(null);
    onSubmit(params);
  };

  const availableSubCategories = SUB_CATEGORIES[params.category] || [];

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111831] md:p-6">
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Prediction Parameters
        </h3>
        <button
          type="button"
          onClick={() => {
            onChange(DEFAULT_PARAMS);
            setErrorMsg(null);
          }}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition"
          aria-label="Reset to default parameters"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>

      {/* Quick Test Presets */}
      <div className="mt-3.5 mb-4">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                onChange({ ...params, ...preset.params });
                setErrorMsg(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/70 px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-white/[0.08] dark:bg-[#162040] dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 transition"
            >
              <span>{preset.emoji}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          {/* Row 1: Category & Subcategory */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="select-category"
                className="mb-1.5 block text-[12px] font-semibold text-slate-700 dark:text-slate-300"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="select-category"
                  value={params.category}
                  onChange={e => handleCategoryChange(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-[14px] font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/[0.08] dark:bg-[#0d1326] dark:text-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="select-subcategory"
                className="mb-1.5 block text-[12px] font-semibold text-slate-700 dark:text-slate-300"
              >
                Sub-Category
              </label>
              <div className="relative">
                <select
                  id="select-subcategory"
                  value={params.subCategory}
                  onChange={e => onChange({ ...params, subCategory: e.target.value })}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-[14px] font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/[0.08] dark:bg-[#0d1326] dark:text-white"
                >
                  {availableSubCategories.map(sub => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Region & Segment */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="select-region"
                className="mb-1.5 block text-[12px] font-semibold text-slate-700 dark:text-slate-300"
              >
                Region
              </label>
              <div className="relative">
                <select
                  id="select-region"
                  value={params.region}
                  onChange={e => onChange({ ...params, region: e.target.value })}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-[14px] font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/[0.08] dark:bg-[#0d1326] dark:text-white"
                >
                  {REGIONS.map(reg => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="select-segment"
                className="mb-1.5 block text-[12px] font-semibold text-slate-700 dark:text-slate-300"
              >
                Segment
              </label>
              <div className="relative">
                <select
                  id="select-segment"
                  value={params.segment}
                  onChange={e => onChange({ ...params, segment: e.target.value })}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-[14px] font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/[0.08] dark:bg-[#0d1326] dark:text-white"
                >
                  {SEGMENTS.map(seg => (
                    <option key={seg} value={seg}>
                      {seg}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Quantity Stepper & Discount Slider */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Quantity Stepper */}
            <div>
              <label
                htmlFor="input-quantity"
                className="mb-1.5 flex items-center justify-between text-[12px] font-semibold text-slate-700 dark:text-slate-300"
              >
                <span>Quantity</span>
                <span className="font-mono-numbers text-[12px] text-blue-600 dark:text-blue-400">
                  {params.quantity}
                </span>
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0d1326]">
                <button
                  type="button"
                  onClick={() => handleQuantityStep(-1)}
                  disabled={params.quantity <= 1}
                  className="grid h-10 w-11 place-items-center rounded-l-xl text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <input
                  id="input-quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={params.quantity}
                  onChange={e => {
                    const v = parseInt(e.target.value, 10);
                    onChange({ ...params, quantity: isNaN(v) ? 1 : Math.max(1, Math.min(100, v)) });
                  }}
                  className="font-mono-numbers w-full bg-transparent text-center text-[15px] font-semibold text-slate-900 outline-none dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityStep(1)}
                  disabled={params.quantity >= 100}
                  className="grid h-10 w-11 place-items-center rounded-r-xl text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800 transition"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            {/* Discount Slider */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="input-discount-range"
                  className="text-[12px] font-semibold text-slate-700 dark:text-slate-300"
                >
                  Discount
                </label>
                <span className="font-mono-numbers inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[12px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {Math.round(params.discount * 100)}%
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-white/[0.08] dark:bg-[#0d1326]">
                <input
                  id="input-discount-range"
                  type="range"
                  min="0"
                  max="0.7"
                  step="0.05"
                  value={params.discount}
                  onChange={e => handleDiscountChange(parseFloat(e.target.value))}
                  className="w-full cursor-pointer accent-blue-600"
                  aria-label="Discount slider"
                />
                <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  {[0, 0.15, 0.35, 0.5, 0.7].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleDiscountChange(val)}
                      className={`hover:text-blue-500 transition ${
                        params.discount === val ? 'font-bold text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      {Math.round(val * 100)}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Shipping Class */}
          <div>
            <label
              htmlFor="select-shipmode"
              className="mb-1.5 block text-[12px] font-semibold text-slate-700 dark:text-slate-300"
            >
              Ship Mode
            </label>
            <div className="relative">
              <select
                id="select-shipmode"
                value={params.shipMode}
                onChange={e => onChange({ ...params, shipMode: e.target.value })}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-[14px] font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/[0.08] dark:bg-[#0d1326] dark:text-white"
              >
                {SHIP_MODES.map(mode => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Validation Error banner if any */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-xs font-medium text-red-600 dark:text-red-400 border border-red-500/20">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-[14px] font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 transition duration-150"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Predicting...</span>
              </>
            ) : (
              <>
                <Zap size={16} className="text-blue-200" />
                <span>Generate Prediction</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
