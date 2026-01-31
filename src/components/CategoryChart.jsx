import React, { useMemo } from 'react';
import { PieChart } from 'lucide-react';
import { CATEGORIES } from '../constants';

export const CategoryChart = ({ transactions }) => {
  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    const total = Object.values(grouped).reduce((a, b) => a + b, 0);

    return Object.entries(grouped)
      .map(([catId, amount]) => ({
        ...CATEGORIES.find(c => c.id === catId),
        amount,
        percentage: (amount / total) * 100
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
        <PieChart size={16} />
        Spending by Category
      </h3>
      <div className="space-y-3">
        {expensesByCategory.map(cat => (
          <div key={cat.id} className="group">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">{cat.name}</span>
              <span className="text-slate-500">${cat.amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} rounded-full`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 w-8 text-right">
                {Math.round(cat.percentage)}%
              </span>
            </div>
          </div>
        ))}
        {expensesByCategory.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No expenses yet
          </div>
        )}
      </div>
    </div>
  );
};
