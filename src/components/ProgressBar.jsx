import React from 'react';

export const ProgressBar = ({ current, max, label = "Monthly Budget" }) => {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const remaining = max - current;
  const isOverBudget = remaining < 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className={isOverBudget ? 'text-rose-600 font-bold' : 'text-slate-500'}>
          {max > 0 ? (isOverBudget ? 'Over Budget' : `${Math.round(percentage)}% Used`) : 'No Budget'}
        </span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>${current.toLocaleString()} spent</span>
        <span>${Math.abs(remaining).toLocaleString()} {isOverBudget ? 'over' : 'left'}</span>
      </div>
    </div>
  );
};
