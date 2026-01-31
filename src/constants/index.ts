import type { Category, Jar, CategoryMapping } from '../types/index.js';

export const CATEGORIES: Category[] = [
  { id: 'housing', name: 'Housing', color: 'bg-blue-500' },
  { id: 'food', name: 'Food', color: 'bg-emerald-500' },
  { id: 'transport', name: 'Transport', color: 'bg-amber-500' },
  { id: 'fun', name: 'Fun', color: 'bg-rose-500' },
  { id: 'utilities', name: 'Utilities', color: 'bg-cyan-500' },
  { id: 'education', name: 'Education', color: 'bg-purple-500' },
  { id: 'savings', name: 'Savings', color: 'bg-green-500' },
  { id: 'investments', name: 'Investments', color: 'bg-indigo-500' },
  { id: 'giving', name: 'Giving', color: 'bg-pink-500' },
  { id: 'buffer', name: 'Buffer', color: 'bg-amber-500' },
  { id: 'income', name: 'Income', color: 'bg-slate-500' },
];

export const JAR_CONFIG: Jar[] = [
  { id: 'necessities', name: 'Necessities', percentage: 0.40, color: 'bg-blue-500' },
  { id: 'investments', name: 'Investments (INV)', percentage: 0.22, color: 'bg-indigo-500' },
  { id: 'long_term_savings', name: 'Long-Term Savings (LTSS)', percentage: 0.11, color: 'bg-green-500' },
  { id: 'education', name: 'Education (EDU)', percentage: 0.13, color: 'bg-purple-500' },
  { id: 'play', name: 'Play (FUN)', percentage: 0.05, color: 'bg-rose-500' },
  { id: 'give', name: 'Give', percentage: 0.03, color: 'bg-pink-500' },
  { id: 'buffer', name: 'Buffer', percentage: 0.06, color: 'bg-amber-500' },
];

export const CATEGORY_TO_JAR_MAPPING: CategoryMapping = {
  housing: 'necessities',
  food: 'necessities',
  transport: 'necessities',
  utilities: 'necessities',
  fun: 'play',
  education: 'education',
  savings: 'long_term_savings',
  investments: 'investments',
  giving: 'give',
  buffer: 'buffer',
};
