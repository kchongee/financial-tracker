import React from 'react';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { CATEGORY_TO_JAR_MAPPING } from '../constants';

export const TransactionList = ({ transactions, loading, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center py-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>No transactions found for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map(t => {
        const jarId = CATEGORY_TO_JAR_MAPPING[t.category];
        const isWealth = ['investments', 'long_term_savings', 'education'].includes(jarId);
        const isIncome = t.type === 'income';

        let iconBg = 'bg-rose-100 text-rose-600';
        let amountColor = 'text-slate-900';

        if (isIncome) {
          iconBg = 'bg-emerald-100 text-emerald-600';
          amountColor = 'text-emerald-600';
        } else if (isWealth) {
          iconBg = 'bg-blue-100 text-blue-600';
        }

        return (
          <div key={t.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 group">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${iconBg}`}>
                {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
              </div>
              <div>
                <p className="font-medium text-slate-900">{t.description}</p>
                <p className="text-xs text-slate-500 capitalize">
                  {t.category}
                  {isWealth && <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Wealth</span>}
                  • {t.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`font-bold ${amountColor}`}>
                {isIncome ? '+' : '-'}${t.amount.toLocaleString()}
              </span>
              <button
                onClick={() => onDelete(t.id)}
                className="p-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
