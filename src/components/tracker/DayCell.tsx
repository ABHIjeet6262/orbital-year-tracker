import React from 'react';
import type { DayProgress } from '../../types';
import { createAnnularSectorPath, polarToCartesian } from '../../utils/geometry';

interface DayCellProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  progress: DayProgress;
  isSelected: boolean;
  borderColor: string;
  onHover: (e: React.MouseEvent<SVGPathElement>, progress: DayProgress) => void;
  onLeave: () => void;
  onClick: (dateStr: string) => void;
}

export const DayCell: React.FC<DayCellProps> = React.memo(({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  progress,
  isSelected,
  borderColor,
  onHover,
  onLeave,
  onClick,
}) => {
  if (!progress.isValidDay) {
    const pathData = createAnnularSectorPath(cx, cy, innerRadius, outerRadius, startAngle, endAngle);
    return (
      <path
        d={pathData}
        fill={progress.color}
        stroke={borderColor}
        strokeWidth="0.5"
        strokeDasharray="2,2"
        opacity="0.3"
        style={{ pointerEvents: 'none' }}
      />
    );
  }

  const pathData = createAnnularSectorPath(cx, cy, innerRadius, outerRadius, startAngle, endAngle);
  const midAngle = (startAngle + endAngle) / 2;
  const midRadius = (innerRadius + outerRadius) / 2;
  const dotPos = polarToCartesian(cx, cy, midRadius, midAngle);

  return (
    <g className="cursor-pointer transition-all duration-150 group">
      <path
        d={pathData}
        fill={progress.color}
        stroke={isSelected ? '#10b981' : borderColor}
        strokeWidth={isSelected ? '2' : '0.65'}
        className={`transition-all duration-150 ${
          progress.isValidDay
            ? 'hover:opacity-85 hover:brightness-110 active:scale-[0.99] origin-center'
            : ''
        }`}
        onMouseEnter={(e) => onHover(e, progress)}
        onMouseMove={(e) => onHover(e, progress)}
        onMouseLeave={onLeave}
        onClick={() => onClick(progress.dateString)}
        style={{
          filter: isSelected ? 'drop-shadow(0 0 3px rgba(16, 185, 129, 0.5))' : undefined,
        }}
      />
      {progress.isToday && (
        <circle
          cx={dotPos.x}
          cy={dotPos.y}
          r="2.2"
          fill="#ffffff"
          stroke="#10b981"
          strokeWidth="1.2"
          className="pointer-events-none animate-pulse"
        />
      )}
    </g>
  );
});

DayCell.displayName = 'DayCell';
