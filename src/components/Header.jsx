import React from 'react';
import { Wallet, Plus } from 'lucide-react';

export const Header = ({ currentDate, onAddClick }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="text-emerald-600" />
          FinanceTracker
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Overview for {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-slate-900/10"
      >
        <Plus size={18} />
        Add Transaction
      </button>
    </header>
  );
};
