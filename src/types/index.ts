export interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
  isOptimistic?: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Jar {
  id: string;
  name: string;
  percentage: number;
  color: string;
}

export type CategoryMapping = Record<string, string>;

export interface JarAllocationData extends Jar {
  target: number;
  current: number;
  percentage: number;
  isOver: boolean;
  categories: { id: string; name: string; amount: number }[];
}
