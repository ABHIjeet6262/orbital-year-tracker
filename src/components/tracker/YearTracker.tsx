import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useTracker } from '../../context/TrackerContext';
import { DayCell } from './DayCell';
import { TrackerCenter } from './TrackerCenter';
import { DayTooltip } from './DayTooltip';
import {
  calculateRingMetrics,
  getDayAngles,
  getMonthColumnAngles,
  polarToCartesian,
  createAnnularSectorPath,
  TOTAL_SECTORS,
  SECTOR_ANGLE,
} from '../../utils/geometry';
import { MONTH_SHORT_NAMES } from '../../utils/dateUtils';
import {
  getGridBorderColor,
  getPalettesByTone,
  resolvePalette,
  BRIGHT_PALETTES,
  DARK_PALETTES,
} from '../../utils/colors';
import type { DayProgress } from '../../types';
import { ZoomIn, ZoomOut, RotateCcw, Palette, Check, Sun, Moon } from 'lucide-react';

export const YearTracker: React.FC = () => {
  const {
    year,
    circleTone,
    setCircleTone,
    circlePalette,
    setCirclePalette,
    selectedDate,
    openDayDrawer,
    getDayProgressByIndices,
    activeHabits,
    completions,
  } = useTracker();

  // SVG Dimension Constants
  const SVG_SIZE = 920;
  const CENTER = SVG_SIZE / 2;
  const OUTER_BOUND_RADIUS = 395;
  const INNER_BOUND_RADIUS = 135;
  const DAY_NUMBER_RADIUS = OUTER_BOUND_RADIUS + 20;

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showPaletteMenu, setShowPaletteMenu] = useState<boolean>(false);

  // Tooltip state
  const [tooltipData, setTooltipData] = useState<{
    progress: DayProgress | null;
    position: { x: number; y: number };
  }>({ progress: null, position: { x: 0, y: 0 } });

  const containerRef = useRef<HTMLDivElement>(null);

  // Compute 12 month concentric rings (0 = Jan outermost, 11 = Dec innermost)
  const ringMetrics = useMemo(() => {
    return calculateRingMetrics(12, INNER_BOUND_RADIUS, OUTER_BOUND_RADIUS);
  }, []);

  const borderColor = useMemo(() => getGridBorderColor(circleTone), [circleTone]);
  const monthColumn = useMemo(() => getMonthColumnAngles(), []);

  // Handlers for cell hover
  const handleCellHover = useCallback(
    (e: React.MouseEvent<SVGPathElement>, progress: DayProgress) => {
      setTooltipData({
        progress,
        position: { x: e.clientX, y: e.clientY },
      });
    },
    []
  );

  const handleCellLeave = useCallback(() => {
    setTooltipData((prev) => ({ ...prev, progress: null }));
  }, []);

  // Pan / Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(2.5, z + 0.2));
  const handleZoomOut = () => setZoom((z) => Math.max(0.7, z - 0.2));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const monthCellBg = circleTone === 'dark' ? '#181e1a' : '#ece8df';
  const monthTextColor = circleTone === 'dark' ? '#e2e8f0' : '#1c1917';
  const activePal = resolvePalette(circlePalette, circleTone);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[680px] lg:max-w-[740px] xl:max-w-[800px] mx-auto flex items-center justify-center select-none touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Zoom / Pan / Circle Theme Controls */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex flex-col gap-1.5 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md p-1.5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-md">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleResetView}
          title="Reset View"
          className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw size={16} />
        </button>

        <div className="h-px bg-stone-200 dark:bg-stone-700 my-0.5" />

        {/* Circle Theme Palette Selector Button */}
        <div className="relative">
          <button
            onClick={() => setShowPaletteMenu(!showPaletteMenu)}
            title="Circle Color Themes (Bright & Dark)"
            className="p-1.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          >
            <Palette size={16} />
          </button>

          {showPaletteMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowPaletteMenu(false)}
              />
              <div className="absolute right-0 sm:right-full sm:mr-2 top-full sm:top-0 mt-2 sm:mt-0 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-2.5 z-40 animate-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-stone-100 dark:border-stone-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Circle Theme
                  </span>
                </div>

                {/* Circle Bright vs Dark Tone Toggle */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl mb-2.5">
                  <button
                    onClick={() => {
                      setCircleTone('bright');
                      if (!BRIGHT_PALETTES.some((p) => p.id === circlePalette)) {
                        setCirclePalette('sage_bright');
                      }
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      circleTone === 'bright'
                        ? 'bg-white text-stone-900 shadow-xs font-semibold'
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    <Sun size={13} className="text-amber-500" />
                    <span>Bright</span>
                  </button>
                  <button
                    onClick={() => {
                      setCircleTone('dark');
                      if (!DARK_PALETTES.some((p) => p.id === circlePalette)) {
                        setCirclePalette('forest_dark');
                      }
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      circleTone === 'dark'
                        ? 'bg-stone-900 text-stone-100 dark:bg-stone-700 shadow-xs font-semibold'
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    <Moon size={13} className="text-emerald-400" />
                    <span>Dark</span>
                  </button>
                </div>

                {/* Dynamic Options for Selected Tone */}
                <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-1 mb-1">
                  {circleTone === 'bright' ? 'Bright Palettes' : 'Dark Palettes'}
                </div>

                <div className="space-y-1">
                  {getPalettesByTone(circleTone).map((pal) => {
                    const isSelected = activePal.id === pal.id;
                    return (
                      <button
                        key={pal.id}
                        onClick={() => {
                          setCirclePalette(pal.id);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500/30'
                            : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/70'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex items-center -space-x-1">
                            <span
                              className="w-3 h-3 rounded-full border border-black/10 dark:border-white/10"
                              style={{ backgroundColor: pal.levels[1].color }}
                            />
                            <span
                              className="w-3 h-3 rounded-full border border-black/10 dark:border-white/10"
                              style={{ backgroundColor: pal.levels[4].color }}
                            />
                            <span
                              className="w-3 h-3 rounded-full border border-black/10 dark:border-white/10 z-10"
                              style={{ backgroundColor: pal.levels[6].color }}
                            />
                          </div>
                          <span>{pal.name}</span>
                        </div>
                        {isSelected && <Check size={13} className="text-emerald-600 dark:text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Vector SVG */}
      <svg
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className="w-full h-full filter drop-shadow-xs transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
        {/* Base Background Circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={OUTER_BOUND_RADIUS + 2}
          fill="none"
          stroke={borderColor}
          strokeWidth="1.2"
        />

        {/* Radial Grid Lines (32 total divisions) */}
        {Array.from({ length: TOTAL_SECTORS }, (_, i) => i).map((sectorIdx) => {
          // sectorIdx 0 is left boundary of Month column (-95.625°), sectorIdx 1 is right boundary (-84.375°)
          const lineAngle = monthColumn.startAngle + sectorIdx * SECTOR_ANGLE;
          const pStart = polarToCartesian(CENTER, CENTER, INNER_BOUND_RADIUS, lineAngle);
          const pEnd = polarToCartesian(CENTER, CENTER, OUTER_BOUND_RADIUS, lineAngle);

          // Give distinct crispness to both inclined month boundary lines
          const isMonthBoundary = sectorIdx === 0 || sectorIdx === 1;

          return (
            <line
              key={`grid-line-${sectorIdx}`}
              x1={pStart.x}
              y1={pStart.y}
              x2={pEnd.x}
              y2={pEnd.y}
              stroke={borderColor}
              strokeWidth={isMonthBoundary ? '1.2' : '0.5'}
              opacity={isMonthBoundary ? '0.95' : '0.6'}
            />
          );
        })}

        {/* Perimeter Labels: "MONTH" over Month Column + Day Numbers 1..31 over Day Sectors */}
        <g className="select-none pointer-events-none">
          {/* "MONTH" Label above Month Column */}
          {(() => {
            const mPos = polarToCartesian(CENTER, CENTER, DAY_NUMBER_RADIUS, monthColumn.midAngle);
            return (
              <text
                x={mPos.x}
                y={mPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fontWeight="700"
                letterSpacing="0.06em"
                className="fill-emerald-700 dark:fill-emerald-400 font-sans"
              >
                MONTH
              </text>
            );
          })()}

          {/* Day Numbers 1 to 31: 1 starts immediately at straight line, 31 ends at inclined line */}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
            const { midAngle } = getDayAngles(dayNum);
            const numPos = polarToCartesian(CENTER, CENTER, DAY_NUMBER_RADIUS, midAngle);

            return (
              <text
                key={`perimeter-num-${dayNum}`}
                x={numPos.x}
                y={numPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                className="fill-stone-400 dark:fill-stone-500 font-medium"
              >
                {dayNum}
              </text>
            );
          })}
        </g>

        {/* Render 12 Concentric Month Rings */}
        {ringMetrics.map((ring) => {
          const mIndex = ring.monthIndex; // 0 = Jan (outermost) to 11 = Dec (innermost)
          const midRadius = (ring.innerRadius + ring.outerRadius) / 2;

          // Dedicated Month Cell Path (from inclined line at 31st to straight line at 1st)
          const monthCellPath = createAnnularSectorPath(
            CENTER,
            CENTER,
            ring.innerRadius,
            ring.outerRadius,
            monthColumn.startAngle,
            monthColumn.endAngle
          );

          // Center point for Month text inside Month Column cell
          const textPos = polarToCartesian(CENTER, CENTER, midRadius, monthColumn.midAngle);

          return (
            <g key={`ring-month-${mIndex}`} className={`month-ring-${mIndex}`}>
              {/* Concentric boundary line */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={ring.innerRadius}
                fill="none"
                stroke={borderColor}
                strokeWidth="0.75"
              />

              {/* 1. Dedicated Month Header Cell */}
              <g className="select-none pointer-events-none">
                <path
                  d={monthCellPath}
                  fill={monthCellBg}
                  stroke={borderColor}
                  strokeWidth="0.85"
                />
                <text
                  x={textPos.x}
                  y={textPos.y + 0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9.5"
                  fontWeight="700"
                  letterSpacing="0.08em"
                  fill={monthTextColor}
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                >
                  {MONTH_SHORT_NAMES[mIndex]}
                </text>
              </g>

              {/* 2. Days 1 to 31 Cells (Day 1 starts at the straight line, Day 31 ends at the inclined line) */}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
                const { startAngle, endAngle } = getDayAngles(dayNum);
                const progress = getDayProgressByIndices(year, mIndex, dayNum);
                const isSelected = selectedDate === progress.dateString;

                return (
                  <DayCell
                    key={`cell-${mIndex}-${dayNum}`}
                    cx={CENTER}
                    cy={CENTER}
                    innerRadius={ring.innerRadius}
                    outerRadius={ring.outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    progress={progress}
                    isSelected={isSelected}
                    borderColor={borderColor}
                    onHover={handleCellHover}
                    onLeave={handleCellLeave}
                    onClick={openDayDrawer}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Calm Central Circular Hub */}
        <TrackerCenter cx={CENTER} cy={CENTER} radius={INNER_BOUND_RADIUS} />
      </svg>

      {/* Floating Hover Tooltip */}
      {tooltipData.progress && (
        <DayTooltip
          progress={tooltipData.progress}
          position={tooltipData.position}
          activeHabits={activeHabits}
          record={completions[tooltipData.progress.dateString]}
        />
      )}
    </div>
  );
};
