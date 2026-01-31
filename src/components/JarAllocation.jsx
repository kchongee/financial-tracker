import React from 'react';
import { PieChart } from 'lucide-react';

export const JarAllocation = ({ allocations, monthlyIncome }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <PieChart size={16} />
          6 Jar Allocation
        </h3>
      </div>
      <div className="space-y-3">
        {allocations.map(jar => (
          <div key={jar.id}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">{jar.name}</span>
              <span className={jar.isOver ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                ${jar.current.toLocaleString()} / ${jar.target.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${jar.isOver ? 'bg-rose-500' : jar.color} rounded-full transition-all duration-300`}
                  style={{ width: `${jar.percentage}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 w-8 text-right">
                {Math.round(jar.percentage)}%
              </span>
            </div>
            {jar.categories.length > 0 && (
              <div className="ml-3 space-y-1">
                {jar.categories.map(cat => (
                  <div key={cat.id} className="flex justify-between text-[11px] text-slate-500">
                    <span>• {cat.name}</span>
                    <span>${cat.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {monthlyIncome === 0 && (
          <div className="text-center py-4 text-slate-400 text-sm">
            No income this month
          </div>
        )}
      </div>
    </div>
  );
};
