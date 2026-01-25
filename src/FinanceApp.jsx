import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar as CalendarIcon,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// --- Constants & Mock Data ---

const BUDGET_LIMIT = 2500;

const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: 'bg-blue-500' },
  { id: 'food', name: 'Food', color: 'bg-emerald-500' },
  { id: 'transport', name: 'Transport', color: 'bg-amber-500' },
  { id: 'fun', name: 'Fun', color: 'bg-rose-500' },
  { id: 'utilities', name: 'Utilities', color: 'bg-cyan-500' },
  { id: 'income', name: 'Income', color: 'bg-slate-500' }, // For income transactions
];

const INITIAL_TRANSACTIONS = [
  { id: 1, date: '2026-01-01', amount: 3500, category: 'income', type: 'income', description: 'Monthly Salary' },
  { id: 2, date: '2026-01-02', amount: 1200, category: 'housing', type: 'expense', description: 'Rent Payment' },
  { id: 3, date: '2026-01-05', amount: 150, category: 'food', type: 'expense', description: 'Grocery Run' },
  { id: 4, date: '2026-01-08', amount: 45, category: 'transport', type: 'expense', description: 'Gas Station' },
  { id: 5, date: '2026-01-10', amount: 80, category: 'fun', type: 'expense', description: 'Dinner & Movie' },
  { id: 6, date: '2026-01-12', amount: 120, category: 'utilities', type: 'expense', description: 'Electric Bill' },
  { id: 7, date: '2026-01-15', amount: 200, category: 'food', type: 'expense', description: 'Weekly Groceries' },
  { id: 8, date: '2026-01-18', amount: 60, category: 'transport', type: 'expense', description: 'Uber Rides' },
  { id: 9, date: '2026-01-20', amount: 500, category: 'income', type: 'income', description: 'Freelance Project' },
  { id: 10, date: '2026-01-22', amount: 90, category: 'fun', type: 'expense', description: 'Concert Tickets' },
  // Previous Month (Dec 2025)
  { id: 11, date: '2025-12-25', amount: 150, category: 'fun', type: 'expense', description: 'Christmas Gifts' },
  { id: 12, date: '2025-12-31', amount: 200, category: 'food', type: 'expense', description: 'NYE Party Supplies' },
  // Next Month (Feb 2026)
  { id: 13, date: '2026-02-01', amount: 3500, category: 'income', type: 'income', description: 'Monthly Salary' },
  { id: 14, date: '2026-02-14', amount: 120, category: 'fun', type: 'expense', description: 'Valentine\'s Dinner' },
];

// --- Helper Components ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 ${className}`}>
    {children}
  </div>
);

const SummaryCard = ({ title, amount, type, icon: Icon }) => {
  const isPositive = type === 'income';
  const isNeutral = type === 'balance';

  let colorClass = 'text-slate-900';
  if (type === 'income') colorClass = 'text-emerald-600';
  if (type === 'expense') colorClass = 'text-rose-600';

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 text-sm font-medium">{title}</span>
        <div className={`p-2 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : isNeutral ? 'bg-slate-100 text-slate-600' : 'bg-rose-50 text-rose-600'}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className={`text-2xl font-bold ${colorClass}`}>
          ${amount.toLocaleString()}
        </h3>
      </div>
    </Card>
  );
};

const ProgressBar = ({ current, max }) => {
  const percentage = Math.min((current / max) * 100, 100);
  const remaining = max - current;
  const isOverBudget = remaining < 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">Monthly Budget</span>
        <span className={isOverBudget ? 'text-rose-600 font-bold' : 'text-slate-500'}>
          {isOverBudget ? 'Over Budget' : `${Math.round(percentage)}% Used`}
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

const CategoryChart = ({ transactions }) => {
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

const Calendar = ({ transactions, selectedDate, onSelectDate, currentDate, onPrevMonth, onNextMonth, onToday }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const activeDates = useMemo(() => {
    return new Set(
      transactions
        .filter(t => {
          const d = new Date(t.date);
          return d.getMonth() === month && d.getFullYear() === year;
        })
        .map(t => new Date(t.date).getDate())
    );
  }, [transactions, month, year]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onPrevMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
            <ChevronLeft size={20} />
          </button>
          <h3 className="font-semibold text-slate-900">{monthName} {year}</h3>
          <button onClick={onNextMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToday}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded font-medium transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => onSelectDate(null)}
            className="text-xs text-slate-500 hover:text-emerald-600 font-medium"
          >
            Clear Filter
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-xs text-slate-400 py-1">{d}</div>
        ))}

        {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} />)}

        {days.map(day => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = selectedDate === dateStr;
          const hasActivity = activeDates.has(day);

          return (
            <button
              key={day}
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
              className={`
                aspect-square rounded-lg text-sm flex flex-col items-center justify-center relative transition-colors
                ${isSelected ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-slate-50 text-slate-700'}
                ${!isSelected && hasActivity ? 'font-bold' : ''}
              `}
            >
              {day}
              {hasActivity && !isSelected && (
                <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Component ---

export default function FinanceApp() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date('2026-01-01')); // Start with mock data month
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTx, setNewTx] = useState({
    amount: '',
    description: '',
    category: 'food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  // Derived State
  const filteredTransactions = useMemo(() => {
    if (selectedDate) {
      return transactions.filter(t => t.date === selectedDate);
    }
    // Filter by current month view if no specific date selected
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [transactions, selectedDate, currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null); // Clear selection when changing months
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  const totals = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        acc.income += curr.amount;
      } else {
        acc.expenses += curr.amount;
      }
      return acc;
    }, { income: 0, expenses: 0 });
  }, [transactions]);

  const balance = totals.income - totals.expenses;

  // Handlers
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.description) return;

    const transaction = {
      id: Date.now(),
      ...newTx,
      amount: parseFloat(newTx.amount),
      // Auto-set category to income if type is income
      category: newTx.type === 'income' ? 'income' : newTx.category
    };

    setTransactions(prev => [transaction, ...prev]);
    setIsFormOpen(false);
    setNewTx({
      amount: '',
      description: '',
      category: 'food',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
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
            onClick={() => setIsFormOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-slate-900/10"
          >
            <Plus size={18} />
            Add Transaction
          </button>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="Total Income"
            amount={totals.income}
            type="income"
            icon={TrendingUp}
          />
          <SummaryCard
            title="Total Expenses"
            amount={totals.expenses}
            type="expense"
            icon={TrendingDown}
          />
          <SummaryCard
            title="Net Balance"
            amount={balance}
            type="balance"
            icon={DollarSign}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Stats & Calendar */}
          <div className="space-y-6">
            <Card>
              <ProgressBar current={totals.expenses} max={BUDGET_LIMIT} />
            </Card>
            <Card>
              <CategoryChart transactions={transactions} />
            </Card>
            <Card>
              <Calendar
                transactions={transactions}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onToday={handleToday}
              />
            </Card>
          </div>

          {/* Right Column: Transactions */}
          <div className="lg:col-span-2">
            <Card className="h-full min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Recent Transactions</h2>
                {selectedDate && (
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    Filtered: {selectedDate}
                  </span>
                )}
                {!selectedDate && (
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <p>No transactions found for this period.</p>
                  </div>
                ) : (
                  filteredTransactions.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 group">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{t.description}</p>
                          <p className="text-xs text-slate-500 capitalize">{t.category} • {t.date}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Add Transaction Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">New Transaction</h2>
                <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewTx({ ...newTx, type: 'expense' })}
                      className={`py-2 rounded-lg text-sm font-medium transition-colors ${newTx.type === 'expense' ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-500 ring-offset-1' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewTx({ ...newTx, type: 'income' })}
                      className={`py-2 rounded-lg text-sm font-medium transition-colors ${newTx.type === 'income' ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500 ring-offset-1' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
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
                      value={newTx.amount}
                      onChange={e => setNewTx({ ...newTx, amount: e.target.value })}
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
                    value={newTx.description}
                    onChange={e => setNewTx({ ...newTx, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="e.g. Grocery Shopping"
                  />
                </div>

                {newTx.type === 'expense' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                      value={newTx.category}
                      onChange={e => setNewTx({ ...newTx, category: e.target.value })}
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
                    value={newTx.date}
                    onChange={e => setNewTx({ ...newTx, date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-transform active:scale-[0.98]"
                >
                  Save Transaction
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
