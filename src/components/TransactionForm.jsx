import React from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../constants';

export const TransactionForm = ({ isOpen, onClose, onAdd, transaction, setTransaction }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(e);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">New Transaction</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTransaction({ ...transaction, type: 'expense' })}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${transaction.type === 'expense' ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-500 ring-offset-1' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setTransaction({ ...transaction, type: 'income' })}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500 ring-offset-1' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={transaction.amount}
                onChange={e => setTransaction({ ...transaction, amount: e.target.value })}
                className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              type="text"
              required
              value={transaction.description}
              onChange={e => setTransaction({ ...transaction, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="e.g. Grocery Shopping"
            />
          </div>

          {transaction.type === 'expense' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={transaction.category}
                onChange={e => setTransaction({ ...transaction, category: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {CATEGORIES.filter(c => c.id !== 'income').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={transaction.date}
              onChange={e => setTransaction({ ...transaction, date: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors mt-4"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};
