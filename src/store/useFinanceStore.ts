import { create } from 'zustand';
import type { Transaction, Category, Jar, CategoryMapping } from '../types/index.js';
import { transactionService } from '../services/transactionService.js';
import { CATEGORIES, JAR_CONFIG, CATEGORY_TO_JAR_MAPPING } from '../constants/index.js';

interface FinanceState {
  transactions: Transaction[];
  loading: boolean;
  currentDate: Date;
  selectedDate: string | null;
  
  // Configuration
  categories: Category[];
  jarConfig: Jar[];
  categoryToJarMapping: CategoryMapping;

  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  setLoading: (loading: boolean) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: string | null) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  goToday: () => void;
  
  // Async Actions
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<Transaction>;
  deleteTransaction: (id: number) => Promise<void>;
  bulkAddTransactions: (transactions: Omit<Transaction, 'id'>[]) => Promise<Transaction[]>;
  
  // Config Actions
  setCategories: (categories: Category[]) => void;
  setJarConfig: (config: Jar[]) => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  loading: false,
  currentDate: new Date(),
  selectedDate: null,

  // Default Configuration
  categories: CATEGORIES,
  jarConfig: JAR_CONFIG,
  categoryToJarMapping: CATEGORY_TO_JAR_MAPPING,

  setTransactions: (transactions) => set({ transactions }),
  setLoading: (loading) => set({ loading }),
  setCurrentDate: (currentDate) => set({ currentDate, selectedDate: null }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),

  setCategories: (categories) => set({ categories }),
  setJarConfig: (jarConfig) => set({ jarConfig }),

  nextMonth: () => {
    const { currentDate } = get();
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    set({ currentDate: next, selectedDate: null });
  },

  prevMonth: () => {
    const { currentDate } = get();
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    set({ currentDate: prev, selectedDate: null });
  },

  goToday: () => {
    set({ currentDate: new Date(), selectedDate: null });
  },

  fetchTransactions: async () => {
    const { currentDate } = get();
    set({ loading: true });
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startOfMonth = new Date(year, month, 1).toISOString();
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

      const data = await transactionService.fetchRange(startOfMonth, endOfMonth);
      set({ transactions: data as Transaction[] });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      set({ loading: false });
    }
  },

  addTransaction: async (transaction) => {
    const tempId = Date.now();
    const optimisticTx = { ...transaction, id: tempId, isOptimistic: true } as Transaction;

    set((state) => ({ transactions: [optimisticTx, ...state.transactions] }));

    try {
      const newTx = await transactionService.add(transaction) as Transaction;
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === tempId ? newTx : t)),
      }));
      return newTx;
    } catch (error) {
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== tempId),
      }));
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    const { transactions } = get();
    const transactionToRestore = transactions.find((t) => t.id === id);
    if (!transactionToRestore) return;

    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));

    try {
      await transactionService.delete(id);
    } catch (error) {
      set((state) => ({
        transactions: [transactionToRestore, ...state.transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      }));
      throw error;
    }
  },

  bulkAddTransactions: async (newTransactions) => {
    try {
      const added = await transactionService.bulkAdd(newTransactions) as Transaction[];
      set((state) => ({ transactions: [...added, ...state.transactions] }));
      return added;
    } catch (error) {
      console.error('Error in bulk add:', error);
      throw error;
    }
  },
}));

// Selectors
export const selectBaseState = (state: FinanceState) => ({
  currentDate: state.currentDate,
  selectedDate: state.selectedDate,
  loading: state.loading,
  categories: state.categories,
  jarConfig: state.jarConfig,
  categoryToJarMapping: state.categoryToJarMapping,
});

export const selectActions = (state: FinanceState) => ({
  fetchTransactions: state.fetchTransactions,
  addTransaction: state.addTransaction,
  deleteTransaction: state.deleteTransaction,
  bulkAddTransactions: state.bulkAddTransactions,
  nextMonth: state.nextMonth,
  prevMonth: state.prevMonth,
  goToday: state.goToday,
  setSelectedDate: state.setSelectedDate,
});

export const selectFilteredTransactions = (state: FinanceState) => {
  const { transactions, selectedDate, currentDate } = state;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const filtered = transactions.filter(t => {
    if (selectedDate) return t.date === selectedDate;
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  return filtered.sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return b.id > a.id ? 1 : -1;
  });
};

export const selectMonthTransactions = (state: FinanceState) => {
  const { transactions, currentDate } = state;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  return transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};
