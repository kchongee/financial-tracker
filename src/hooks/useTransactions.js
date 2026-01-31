import { useState, useEffect, useMemo } from 'react';
import { transactionService } from '../services/transactionService';

export function useTransactions(currentDate, selectedDate) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.fetchAll();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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
    const newTx = await transactionService.add(transaction);
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  const deleteTransaction = async (id) => {
    await transactionService.delete(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
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
