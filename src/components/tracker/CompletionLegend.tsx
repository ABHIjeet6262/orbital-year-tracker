import React from 'react';
import { useTracker } from '../../context/TrackerContext';
import { resolvePalette } from '../../utils/colors';

export const CompletionLegend: React.FC = () => {
  const { circleTone, circlePalette } = useTracker();
  const palette = resolvePalette(circlePalette, circleTone);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-3 text-xs text-stone-500 dark:text-stone-400 select-none">
      <span className="text-[11px] font-medium tracking-wide uppercase text-stone-400 dark:text-stone-500">
        Completion:
      </span>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {palette.levels.map((level, idx) => {
          const color = level.color;

          return (
            <div
              key={idx}
              className="flex items-center gap-1 group relative cursor-help"
            >
              <span
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] border border-black/10 dark:border-white/10 shadow-xs transition-transform group-hover:scale-125"
                style={{ backgroundColor: color }}
              />
              <span className="hidden md:inline text-[11px] text-stone-600 dark:text-stone-300">
                {level.label}
              </span>

              {/* Tooltip on hover for mobile/compact views */}
              <div className="md:hidden absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-stone-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-lg">
                {level.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
