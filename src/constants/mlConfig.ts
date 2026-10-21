export interface PredictionParams {
  category: string;
  subCategory: string;
  region: string;
  segment: string;
  quantity: number;
  discount: number;
  shipMode: string;
}

export interface PredictionResult {
  sales: number;
  profit: number;
  confidence: number;
  range: [number, number];
  tier: 'High Value' | 'Medium Value' | 'Standard Value';
  timestamp: string;
}

export interface MetricCardItem {
  id: string;
  label: string;
  value: string;
  sub: string;
  highlight?: string;
  tone: 'primary' | 'success' | 'accent' | 'warning' | 'default';
  icon: string;
}

export const CATEGORIES = ['Technology', 'Furniture', 'Office Supplies'] as const;

export const SUB_CATEGORIES: Record<string, string[]> = {
  Technology: ['Phones', 'Accessories', 'Machines', 'Copiers'],
  Furniture: ['Chairs', 'Tables', 'Bookcases', 'Furnishings'],
  'Office Supplies': [
    'Storage',
    'Binders',
    'Paper',
    'Art',
    'Appliances',
    'Envelopes',
    'Labels',
    'Fasteners',
  ],
};

export const REGIONS = ['West', 'East', 'Central', 'South'] as const;

export const SEGMENTS = ['Consumer', 'Corporate', 'Home Office'] as const;

export const SHIP_MODES = [
  'Standard Class',
  'Second Class',
  'First Class',
  'Same Day',
] as const;

export const BASE_PRICES: Record<string, number> = {
  Phones: 340,
  Accessories: 85,
  Machines: 650,
  Copiers: 920,
  Chairs: 290,
  Tables: 480,
  Bookcases: 230,
  Furnishings: 95,
  Storage: 145,
  Binders: 38,
  Paper: 48,
  Art: 32,
  Appliances: 215,
  Envelopes: 24,
  Labels: 19,
  Fasteners: 16,
};

export const REGION_MULTIPLIERS: Record<string, number> = {
  West: 1.06,
  East: 1.03,
  Central: 0.98,
  South: 0.94,
};

export const SEGMENT_MULTIPLIERS: Record<string, number> = {
  Corporate: 1.09,
  'Home Office': 1.04,
  Consumer: 1.0,
};

export const DEFAULT_PARAMS: PredictionParams = {
  category: 'Technology',
  subCategory: 'Phones',
  region: 'West',
  segment: 'Consumer',
  quantity: 3,
  discount: 0.1, // 10%
  shipMode: 'Standard Class',
};

export const PRESETS = [
  {
    id: 'bulk-tech',
    label: 'Bulk Phones (Tech)',
    emoji: '📱',
    params: {
      category: 'Technology',
      subCategory: 'Phones',
      quantity: 5,
      discount: 0.05,
      segment: 'Corporate',
      region: 'West',
      shipMode: 'Second Class',
    },
  },
  {
    id: 'discount-chairs',
    label: 'Office Chairs (20% Off)',
    emoji: '🪑',
    params: {
      category: 'Furniture',
      subCategory: 'Chairs',
      quantity: 2,
      discount: 0.2,
      segment: 'Consumer',
      region: 'East',
      shipMode: 'Standard Class',
    },
  },
  {
    id: 'paper-bulk',
    label: 'Bulk Paper Supplies',
    emoji: '📦',
    params: {
      category: 'Office Supplies',
      subCategory: 'Paper',
      quantity: 12,
      discount: 0.15,
      segment: 'Home Office',
      region: 'Central',
      shipMode: 'Standard Class',
    },
  },
];

export const MODEL_METRICS: MetricCardItem[] = [
  {
    id: 'arch',
    label: 'Model Architecture',
    value: 'Random Forest',
    sub: '',
    highlight: 'Regressor',
    tone: 'primary',
    icon: 'Cpu',
  },
  {
    id: 'r2',
    label: 'R² Score',
    value: '0.892',
    sub: '',
    highlight: '89.2% accuracy',
    tone: 'success',
    icon: 'TrendingUp',
  },
  {
    id: 'mae',
    label: 'Mean Absolute Error',
    value: '$28.40',
    sub: '',
    highlight: 'MAE',
    tone: 'primary',
    icon: 'ShieldCheck',
  },
  {
    id: 'rmse',
    label: 'Root Mean Squared Err',
    value: '$44.15',
    sub: '',
    highlight: 'RMSE',
    tone: 'accent',
    icon: 'Activity',
  },
  {
    id: 'latency',
    label: 'Inference Latency',
    value: '11.8 ms',
    sub: '',
    highlight: 'Real-time',
    tone: 'warning',
    icon: 'Zap',
  },
];

export const FEATURE_IMPORTANCE_DATA = [
  { feature: 'Order Quantity', importance: 38, weight: '38.0%' },
  { feature: 'Sub-Category', importance: 27, weight: '27.0%' },
  { feature: 'Discount Rate', importance: 17, weight: '17.0%' },
  { feature: 'Category Class', importance: 10, weight: '10.0%' },
  { feature: 'Region Geo', importance: 5, weight: '5.0%' },
  { feature: 'Shipping Mode', importance: 3, weight: '3.0%' },
];

export const CALIBRATION_SCATTER_DATA = [
  { id: 1, actual: 120, predicted: 125, item: 'Paper' },
  { id: 2, actual: 230, predicted: 220, item: 'Binders' },
  { id: 3, actual: 340, predicted: 355, item: 'Chairs' },
  { id: 4, actual: 510, predicted: 495, item: 'Storage' },
  { id: 5, actual: 680, predicted: 700, item: 'Phones' },
  { id: 6, actual: 820, predicted: 790, item: 'Machines' },
  { id: 7, actual: 950, predicted: 970, item: 'Copiers' },
  { id: 8, actual: 420, predicted: 435, item: 'Tables' },
  { id: 9, actual: 180, predicted: 175, item: 'Accessories' },
  { id: 10, actual: 310, predicted: 295, item: 'Appliances' },
  { id: 11, actual: 590, predicted: 610, item: 'Furnishings' },
  { id: 12, actual: 740, predicted: 730, item: 'Phones' },
  { id: 13, actual: 890, predicted: 915, item: 'Machines' },
  { id: 14, actual: 260, predicted: 270, item: 'Storage' },
  { id: 15, actual: 640, predicted: 630, item: 'Chairs' },
];

export function runInference(params: PredictionParams): PredictionResult {
  const base = BASE_PRICES[params.subCategory] || 120;
  const regMult = REGION_MULTIPLIERS[params.region] || 1.0;
  const segMult = SEGMENT_MULTIPLIERS[params.segment] || 1.0;

  const rawSales = base * params.quantity * (1 - params.discount * 0.42) * regMult * segMult;
  const sales = Math.round(rawSales * 100) / 100;

  // Margin calculation: discounts reduce margin directly
  const margin = Math.max(0.04, 0.24 - params.discount * 0.36);
  const profit = Math.round(sales * margin * 100) / 100;

  // Confidence & range
  const confidence = Math.round(91 + (1 - params.discount * 0.2) * 5);
  const spread = sales * 0.055;
  const rangeMin = Math.max(0, Math.round(sales - spread));
  const rangeMax = Math.round(sales + spread);

  const tier = sales >= 800 ? 'High Value' : sales >= 300 ? 'Medium Value' : 'Standard Value';

  return {
    sales,
    profit,
    confidence,
    range: [rangeMin, rangeMax],
    tier,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}
