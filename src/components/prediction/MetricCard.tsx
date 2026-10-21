import { motion } from 'framer-motion';
import { Cpu, TrendingUp, ShieldCheck, Activity, Zap } from 'lucide-react';
import type { MetricCardItem } from '../../constants/mlConfig';

const iconMap: Record<string, any> = {
  Cpu,
  TrendingUp,
  ShieldCheck,
  Activity,
  Zap,
};

const toneStyles = {
  primary: {
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    iconBg: 'bg-blue-500/10 text-blue-500',
    ring: 'group-hover:border-blue-500/30',
  },
  success: {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    iconBg: 'bg-emerald-500/10 text-emerald-500',
    ring: 'group-hover:border-emerald-500/30',
  },
  accent: {
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    iconBg: 'bg-purple-500/10 text-purple-500',
    ring: 'group-hover:border-purple-500/30',
  },
  warning: {
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    iconBg: 'bg-amber-500/10 text-amber-500',
    ring: 'group-hover:border-amber-500/30',
  },
  default: {
    badge: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    iconBg: 'bg-slate-500/10 text-slate-500',
    ring: 'group-hover:border-slate-500/30',
  },
};

interface MetricCardProps {
  item: MetricCardItem;
  index?: number;
}

export function MetricCard({ item, index = 0 }: MetricCardProps) {
  const IconComponent = iconMap[item.icon] || Cpu;
  const tone = toneStyles[item.tone] || toneStyles.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      whileHover={{ y: -2 }}
      className={`group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 dark:border-white/[0.08] dark:bg-[#111831] ${tone.ring}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
            {item.label}
          </span>
          <span className={`grid h-8 w-8 place-items-center rounded-xl ${tone.iconBg} transition-transform duration-200 group-hover:scale-105`}>
            <IconComponent size={16} />
          </span>
        </div>

        <div className="mt-2">
          <div className="font-mono-numbers text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {item.value}
          </div>
          {item.sub && (
            <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
              {item.sub}
            </p>
          )}
        </div>
      </div>

      {item.highlight && (
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${tone.badge}`}>
            {item.highlight}
          </span>
        </div>
      )}
    </motion.div>
  );
}
