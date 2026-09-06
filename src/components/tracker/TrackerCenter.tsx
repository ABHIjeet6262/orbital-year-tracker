import React from 'react';
import { useTracker } from '../../context/TrackerContext';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface TrackerCenterProps {
  cx: number;
  cy: number;
  radius: number;
}

export const TrackerCenter: React.FC<TrackerCenterProps> = ({ cx, cy, radius }) => {
  const {
    year,
    setYear,
    yearStats,
    pageTheme,
    filterHabitId,
    setFilterHabitId,
    habits,
  } = useTracker();

  const filteredHabit = habits.find((h) => h.id === filterHabitId);

  const bgFill = pageTheme === 'dark' ? '#141815' : '#ffffff';
  const strokeColor = pageTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(60, 50, 40, 0.12)';
  const primaryTextColor = pageTheme === 'dark' ? '#f3f4f6' : '#1c1917';
  const secondaryTextColor = pageTheme === 'dark' ? '#9ca3af' : '#78716c';

  return (
    <g className="select-none">
      {/* Center circle background */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={bgFill}
        stroke={strokeColor}
        strokeWidth="1"
        className="shadow-inner"
      />
      {/* Decorative inner hairline ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius - 8}
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.5"
        strokeDasharray="3 3"
      />

      {/* SVG Interactive Content via foreignObject */}
      <foreignObject
        x={cx - radius + 10}
        y={cy - radius + 10}
        width={(radius - 10) * 2}
        height={(radius - 10) * 2}
        className="overflow-visible"
      >
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
          {/* Year Navigation */}
          <div className="flex items-center justify-center space-x-1 mb-0.5">
            <button
              onClick={() => setYear(year - 1)}
              aria-label="Previous Year"
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <span
              className="text-2xl font-serif tracking-widest font-medium"
              style={{ color: primaryTextColor }}
            >
              {year}
            </span>
            <button
              onClick={() => setYear(year + 1)}
              aria-label="Next Year"
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div
            className="w-12 h-px my-1 opacity-40"
            style={{ backgroundColor: secondaryTextColor }}
          />

          {/* Consistency metric */}
          <div className="mt-0.5">
            <span
              className="text-xs font-medium tracking-tight"
              style={{ color: secondaryTextColor }}
            >
              {yearStats.averageCompletion}% consistency
            </span>
          </div>

          {/* Active habit filter tag if active */}
          {filteredHabit ? (
            <div className="mt-2 flex items-center justify-center">
              <button
                onClick={() => setFilterHabitId(null)}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer"
                title="Click to reset filter to all habits"
              >
                <Filter size={10} />
                <span className="truncate max-w-[80px]">{filteredHabit.name}</span>
                <span>✕</span>
              </button>
            </div>
          ) : (
            <div className="text-[10px] text-stone-400 dark:text-stone-500 font-light mt-0.5 tracking-wider">
              {yearStats.perfectDays} perfect days
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
};
