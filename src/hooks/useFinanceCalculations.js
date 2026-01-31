import { useMemo } from 'react';
import { CATEGORY_TO_JAR_MAPPING, JAR_CONFIG, CATEGORIES } from '../constants';

export function useFinanceCalculations(transactions, currentDate) {
  const totals = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    return monthTransactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        acc.income += curr.amount;
      } else {
        acc.expenses += curr.amount;
      }
      return acc;
    }, { income: 0, expenses: 0 });
  }, [transactions, currentDate]);

  const balance = totals.income - totals.expenses;
  const dynamicBudget = totals.income * 0.54;

  const jarAllocations = useMemo(() => {
    const jarData = {};
    JAR_CONFIG.forEach(jar => {
      jarData[jar.id] = { total: 0, categories: {} };
    });

    transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear() && t.type === 'expense';
      })
      .forEach(t => {
        const jarId = CATEGORY_TO_JAR_MAPPING[t.category];
        if (jarId) {
          jarData[jarId].total += t.amount;
          jarData[jarId].categories[t.category] = (jarData[jarId].categories[t.category] || 0) + t.amount;
        }
      });

    return JAR_CONFIG.map(jar => {
      const target = totals.income * jar.percentage;
      const current = jarData[jar.id].total || 0;
      const percentage = target > 0 ? (current / target) * 100 : 0;
      const isOver = current > target;

      const categoryBreakdown = Object.entries(jarData[jar.id].categories).map(([catId, amount]) => ({
        id: catId,
        name: CATEGORIES.find(c => c.id === catId)?.name || catId,
        amount,
      }));

      return {
        ...jar,
        target,
        current,
        percentage: Math.min(percentage, 100),
        isOver,
        categories: categoryBreakdown,
      };
    });
  }, [totals.income, transactions, currentDate]);

  const consumptionExpenses = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return transactions
      .filter(t => {
        const d = new Date(t.date);
        const isCurrentMonth = d.getFullYear() === year && d.getMonth() === month;
        if (!isCurrentMonth || t.type !== 'expense') return false;

        const jarId = CATEGORY_TO_JAR_MAPPING[t.category];
        return ['necessities', 'play', 'give', 'buffer'].includes(jarId);
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, currentDate]);

  const prevMonthData = useMemo(() => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const year = prevMonth.getFullYear();
    const month = prevMonth.getMonth();

    const prevTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    const income = prevTransactions
      .filter(t => t.type === 'income' && !t.description.includes('Buffer Sweep'))
      .reduce((sum, t) => sum + t.amount, 0);

    const bufferTarget = income * 0.06;
    const bufferSpent = prevTransactions
      .filter(t => t.type === 'expense' && CATEGORY_TO_JAR_MAPPING[t.category] === 'buffer')
      .reduce((sum, t) => sum + t.amount, 0);

    const leftover = Math.max(0, bufferTarget - bufferSpent);

    const isAlreadySwept = transactions.some(t =>
      t.description.includes(`Buffer Sweep from ${prevMonth.toLocaleString('default', { month: 'short' })}`)
    );

    return { leftover, isAlreadySwept, monthName: prevMonth.toLocaleString('default', { month: 'long' }) };
  }, [transactions, currentDate]);

  return {
    totals,
    balance,
    dynamicBudget,
    jarAllocations,
    consumptionExpenses,
    prevMonthData
  };
}
