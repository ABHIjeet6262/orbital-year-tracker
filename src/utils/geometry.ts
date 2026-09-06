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

// 32 Total sectors (360° / 32 = 11.25° per sector):
// Dedicated Month Column is centered at 12 o'clock (-90°), bounded by two symmetrically inclined lines:
// - Left inclined line at -95.625° (boundary between Day 31 and Month)
// - Right inclined line at -84.375° (boundary between Month and Day 1)
// Days 1..31 occupy the remaining 31 sectors clockwise around the circle.
export const TOTAL_SECTORS = 32;
export const SECTOR_ANGLE = 360 / TOTAL_SECTORS; // 11.25 degrees

/**
 * Returns angles for the dedicated Month column:
 * Centered at 12 o'clock (-90°), bounded by two inclined radial lines (-95.625° to -84.375°)
 */
export function getMonthColumnAngles(): { startAngle: number; endAngle: number; midAngle: number } {
  const midAngle = -90; // Top center 12 o'clock
  const startAngle = midAngle - SECTOR_ANGLE / 2; // -95.625° (inclined line beside Day 31)
  const endAngle = midAngle + SECTOR_ANGLE / 2;   // -84.375° (inclined line beside Day 1)
  return { startAngle, endAngle, midAngle };
}

/**
 * Returns angles for Day 1..31:
 * Day 1 starts at the inclined line beside the Month column (-84.375°) and continues clockwise to Day 31
 */
export function getDayAngles(dayOfMonth: number): { startAngle: number; endAngle: number; midAngle: number } {
  const startAngle = -90 + SECTOR_ANGLE / 2 + (dayOfMonth - 1) * SECTOR_ANGLE;
  const endAngle = startAngle + SECTOR_ANGLE;
  const midAngle = startAngle + SECTOR_ANGLE / 2;

  return { startAngle, endAngle, midAngle };
}
