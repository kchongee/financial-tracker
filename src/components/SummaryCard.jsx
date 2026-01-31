import React from 'react';
import { Card } from './Card';

export const SummaryCard = ({ title, amount, type, icon }) => {
  const Icon = icon;
  const isPositive = type === 'income' || (type === 'balance' && amount >= 0);
  const colorClass = isPositive ? 'text-emerald-600' : 'text-rose-600';

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className={`text-2xl font-bold mt-1 ${colorClass}`}>
            {amount < 0 ? '-' : ''}${Math.abs(amount).toLocaleString()}
          </h3>
        </div>
        <div className={`p-2 rounded-lg ${isPositive ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          <Icon className={colorClass} size={20} />
        </div>
      </div>
    </Card>
  );
};
