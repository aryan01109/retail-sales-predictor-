import {mockRows} from '../data/mock';
import type {Filters,Row} from '../types';
const base=import.meta.env.VITE_API_BASE_URL as string|undefined;
export const api={
 async dashboard(){if(!base)return null;const r=await fetch(`${base}/dashboard`);if(!r.ok)throw new Error('Dashboard request failed');return r.json()},
 async predict(payload:Record<string,unknown>){if(!base) return null;const r=await fetch(`${base}/predict`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!r.ok)throw new Error('Prediction request failed');return r.json()},
 async modelMetrics(){if(!base)return null;const r=await fetch(`${base}/model/metrics`);if(!r.ok)throw new Error('Model metrics request failed');return r.json()}
};
export function filterRows(filters:Filters){return mockRows.filter(r=>(filters.year==='All'||String(new Date(r.orderDate).getFullYear())===filters.year)&&(filters.region==='All'||r.region===filters.region)&&(filters.category==='All'||r.category===filters.category)&&(filters.segment==='All'||r.segment===filters.segment)&&(filters.shipMode==='All'||r.shipMode===filters.shipMode))}
export const aggregate=(rows:Row[],key:keyof Row)=>Object.entries(rows.reduce<Record<string,number>>((a,r)=>{const k=String(r[key]);a[k]=(a[k]||0)+r.sales;return a},{})).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
export const profitAggregate=(rows:Row[],key:keyof Row)=>Object.entries(rows.reduce<Record<string,number>>((a,r)=>{const k=String(r[key]);a[k]=(a[k]||0)+r.profit;return a},{})).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
