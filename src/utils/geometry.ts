export interface Point {
  x: number;
  y: number;
}

export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): Point {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * Creates an SVG path string for an annular sector (donut slice)
 */
export function createAnnularSectorPath(
  centerX: number,
  centerY: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
  gapAngle: number = 0
): string {
  const adjustedStart = startAngle + gapAngle / 2;
  const adjustedEnd = endAngle - gapAngle / 2;

  const p1 = polarToCartesian(centerX, centerY, outerRadius, adjustedStart);
  const p2 = polarToCartesian(centerX, centerY, outerRadius, adjustedEnd);
  const p3 = polarToCartesian(centerX, centerY, innerRadius, adjustedEnd);
  const p4 = polarToCartesian(centerX, centerY, innerRadius, adjustedStart);

  const angleDiff = adjustedEnd - adjustedStart;
  const largeArcFlag = angleDiff > 180 ? 1 : 0;

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
}

export interface RingMetrics {
  monthIndex: number;
  innerRadius: number;
  outerRadius: number;
  thickness: number;
}

export function calculateRingMetrics(
  totalRings: number = 12,
  innerBoundRadius: number = 135,
  outerBoundRadius: number = 395
): RingMetrics[] {
  const totalThickness = outerBoundRadius - innerBoundRadius;
  const thickness = totalThickness / totalRings;

  const rings: RingMetrics[] = [];

  // Month 0 (Jan) is OUTERMOST, Month 11 (Dec) is INNERMOST
  for (let m = 0; m < totalRings; m++) {
    const outerRadius = outerBoundRadius - m * thickness;
    const innerRadius = outerRadius - thickness;
    rings.push({
      monthIndex: m,
      innerRadius,
      outerRadius,
      thickness,
    });
  }

  return rings;
}

// 32 Total sectors:
// Day 1 starts at top straight line (-90 degrees)
// Days 1..31 go clockwise: Day 1 (-90° to -78.75°), Day 2, ..., Day 31 (247.5° to 258.75°)
// Month Column sits between Day 31 and Day 1: from inclined line (258.75° / -101.25°) to straight line (-90°)
export const TOTAL_SECTORS = 32;
export const SECTOR_ANGLE = 360 / TOTAL_SECTORS; // 11.25 degrees

/**
 * Returns angles for the dedicated Month column:
 * Spans from inclined line (-101.25°) to vertical straight line (-90°) at 12 o'clock
 */
export function getMonthColumnAngles(): { startAngle: number; endAngle: number; midAngle: number } {
  const startAngle = -90 - SECTOR_ANGLE; // -101.25 degrees (inclined line by 31st)
  const endAngle = -90;                 // -90 degrees (straight line by 1st)
  const midAngle = -90 - SECTOR_ANGLE / 2; // -95.625 degrees
  return { startAngle, endAngle, midAngle };
}

/**
 * Returns angles for Day 1..31:
 * Day 1 starts at the vertical straight line (-90°) and continues clockwise to Day 31
 */
export function getDayAngles(dayOfMonth: number): { startAngle: number; endAngle: number; midAngle: number } {
  const startAngle = -90 + (dayOfMonth - 1) * SECTOR_ANGLE;
  const endAngle = -90 + dayOfMonth * SECTOR_ANGLE;
  const midAngle = startAngle + SECTOR_ANGLE / 2;

  return { startAngle, endAngle, midAngle };
}
