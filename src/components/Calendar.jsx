import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Calendar = ({ transactions, selectedDate, onSelectDate, currentDate, onPrevMonth, onNextMonth, onToday }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

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
