import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useFinanceStore, selectFilteredTransactions, selectMonthTransactions } from './store/useFinanceStore';
import { useFinanceCalculations } from './hooks/useFinanceCalculations';

// Components
import { Header } from './components/Header';
import { SummaryCard } from './components/SummaryCard';
import { Card } from './components/Card';
import { ProgressBar } from './components/ProgressBar';
import { CategoryChart } from './components/CategoryChart';
import { JarAllocation } from './components/JarAllocation';
import { Calendar } from './components/Calendar';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';

export default function FinanceApp() {
  const {
    currentDate,
    selectedDate,
    loading,
    categories,
    jarConfig,
    categoryToJarMapping,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    bulkAddTransactions,
    setCurrentDate,
    setSelectedDate,
    nextMonth,
    prevMonth,
    goToday
  } = useFinanceStore();

  const filteredTransactions = useFinanceStore(selectFilteredTransactions);
  const monthTransactions = useFinanceStore(selectMonthTransactions);

  const [activeTab, setActiveTab] = useState('category');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTx, setNewTx] = useState({
    amount: '',
    description: '',
    category: 'food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch transactions on mount and when currentDate changes
  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, currentDate]);

  const {
    totals,
    balance,
    dynamicBudget,
    jarAllocations,
    consumptionExpenses,
    prevMonthData
  } = useFinanceCalculations(monthTransactions, currentDate, {
    categories,
    jarConfig,
    categoryToJarMapping
  });

  // Handlers
  const handlePrevMonth = () => prevMonth();
  const handleNextMonth = () => nextMonth();
  const handleToday = () => goToday();

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.description) return;

    try {
      await addTransaction({
        amount: parseFloat(newTx.amount),
        description: newTx.description,
        category: newTx.type === 'income' ? 'income' : newTx.category,
        type: newTx.type,
        date: newTx.date
      });
      setIsFormOpen(false);
      setNewTx({
        amount: '',
        description: '',
        category: 'food',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      alert('Failed to add transaction.');
    }
  };

  const handleSweepBuffer = async (amount, monthName) => {
    if (!window.confirm(`Sweep $${amount.toFixed(2)} from ${monthName} Buffer and reallocate?`)) return;

    const today = new Date().toISOString().split('T')[0];
    const sweepTransactions = [
      { amount, description: `Buffer Sweep from ${monthName.substring(0, 3)} (Out)`, category: 'buffer', type: 'expense', date: today },
      { amount: amount * 0.5, description: `Buffer Sweep from ${monthName.substring(0, 3)} (to INV)`, category: 'investments', type: 'income', date: today },
      { amount: amount * 0.3, description: `Buffer Sweep from ${monthName.substring(0, 3)} (to LTSS)`, category: 'savings', type: 'income', date: today },
      { amount: amount * 0.2, description: `Buffer Sweep from ${monthName.substring(0, 3)} (to FUN)`, category: 'fun', type: 'income', date: today }
    ];

    try {
      await bulkAddTransactions(sweepTransactions);
    } catch (error) {
      alert('Failed to sweep buffer.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">

        <Header currentDate={currentDate} onAddClick={() => setIsFormOpen(true)} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard title="Total Income" amount={totals.income} type="income" icon={TrendingUp} />
          <SummaryCard title="Total Expenses" amount={totals.expenses} type="expense" icon={TrendingDown} />
          <SummaryCard title="Net Balance" amount={balance} type="balance" icon={DollarSign} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card>
              <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
                <button
                  onClick={() => setActiveTab('category')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'category' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  By Category
                </button>
                <button
                  onClick={() => setActiveTab('jars')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'jars' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  6 Jars
                </button>
              </div>

              {activeTab === 'category' ? (
                <div className="space-y-6">
                  <ProgressBar current={consumptionExpenses} max={dynamicBudget} label="Spending Allocation (54%)" />
                  <div className="border-t border-slate-100 pt-6">
                    <CategoryChart transactions={monthTransactions} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {prevMonthData.leftover > 0 && !prevMonthData.isAlreadySwept && (
                    <button
                      onClick={() => handleSweepBuffer(prevMonthData.leftover, prevMonthData.monthName)}
                      className="w-full text-[10px] bg-amber-100 text-amber-700 px-2 py-2 rounded-lg font-bold hover:bg-amber-200 transition-colors"
                    >
                      Sweep ${prevMonthData.leftover.toFixed(0)} from {prevMonthData.monthName}
                    </button>
                  )}
                  <JarAllocation allocations={jarAllocations} monthlyIncome={totals.income} />
                </div>
              )}
            </Card>
            <Card>
              <Calendar
                transactions={monthTransactions}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onToday={handleToday}
              />
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Recent Transactions</h2>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  {selectedDate ? `Filtered: ${selectedDate}` : currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <TransactionList
                transactions={filteredTransactions}
                loading={loading}
                onDelete={deleteTransaction}
              />
            </Card>
          </div>
        </div>

        <TransactionForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onAdd={handleAddSubmit}
          transaction={newTx}
          setTransaction={setNewTx}
        />
      </div>
    </div>
  );
}
