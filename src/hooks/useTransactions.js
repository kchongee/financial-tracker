import { useState, useEffect, useMemo, useCallback } from 'react';
import { transactionService } from '../services/transactionService';

export function useTransactions(currentDate, selectedDate) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startOfMonth = new Date(year, month, 1).toISOString();
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

      const data = await transactionService.fetchRange(startOfMonth, endOfMonth);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (selectedDate) {
      filtered = transactions.filter(t => t.date === selectedDate);
    } else {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      filtered = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === month;
      });
    }

    return [...filtered].sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.id > a.id ? 1 : -1;
    });
  }, [transactions, selectedDate, currentDate]);

  const monthTransactions = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [transactions, currentDate]);

  const addTransaction = async (transaction) => {
    const tempId = Date.now();
    const optimisticTx = { ...transaction, id: tempId, isOptimistic: true };

    // Optimistic Update
    setTransactions(prev => [optimisticTx, ...prev]);

    try {
      const newTx = await transactionService.add(transaction);
      // Replace optimistic item with real one
      setTransactions(prev => prev.map(t => t.id === tempId ? newTx : t));
      return newTx;
    } catch (error) {
      // Rollback
      setTransactions(prev => prev.filter(t => t.id !== tempId));
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    const transactionToRestore = transactions.find(t => t.id === id);
    if (!transactionToRestore) return;

    // Optimistic Update
    setTransactions(prev => prev.filter(t => t.id !== id));

    try {
      await transactionService.delete(id);
    } catch (error) {
      // Rollback
      setTransactions(prev => [transactionToRestore, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
      throw error;
    }
  };

  const bulkAddTransactions = async (newTransactions) => {
    const added = await transactionService.bulkAdd(newTransactions);
    setTransactions(prev => [...added, ...prev]);
    return added;
  };

  return {
    transactions,
    filteredTransactions,
    monthTransactions,
    loading,
    setLoading,
    addTransaction,
    deleteTransaction,
    bulkAddTransactions,
    refresh: fetchTransactions
  };
}
