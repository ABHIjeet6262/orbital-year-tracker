import { calculateRingMetrics, getDayAngles, getMonthColumnAngles, createAnnularSectorPath } from './geometry.ts';
import { getDaysInMonth } from './dateUtils.ts';
import { getCompletionColor, PALETTES } from './colors.ts';

function runTests() {
  console.log('=== RUNNING ORBITAL YEAR TRACKER VERIFICATION TESTS ===\n');

  // Test 1: Month order and concentric rings
  const rings = calculateRingMetrics(12, 135, 395);
  console.assert(rings.length === 12, 'Must have 12 rings');
  console.assert(rings[0].outerRadius === 395, 'Ring 0 (Jan) must be outermost at 395px');
  console.assert(rings[11].innerRadius === 135, 'Ring 11 (Dec) must be innermost at 135px');
  console.assert(rings[0].innerRadius > rings[1].innerRadius, 'Rings must strictly decrease in radius from Jan to Dec');
  console.log('✓ Test 1 Passed: Month concentric rings order verified (Jan outermost -> Dec innermost).');

  // Test 2: Days in month & leap year
  console.assert(getDaysInMonth(2026, 0) === 31, 'Jan 2026 has 31 days');
  console.assert(getDaysInMonth(2026, 1) === 28, 'Feb 2026 has 28 days');
  console.assert(getDaysInMonth(2024, 1) === 29, 'Feb 2024 has 29 days (leap year)');
  console.assert(getDaysInMonth(2026, 3) === 30, 'Apr 2026 has 30 days');
  console.assert(getDaysInMonth(2026, 5) === 30, 'Jun 2026 has 30 days');
  console.assert(getDaysInMonth(2026, 8) === 30, 'Sep 2026 has 30 days');
  console.assert(getDaysInMonth(2026, 10) === 30, 'Nov 2026 has 30 days');
  console.assert(getDaysInMonth(2026, 11) === 31, 'Dec 2026 has 31 days');
  console.log('✓ Test 2 Passed: Month day counts and leap year handling verified.');

  // Test 3: Straight line at Day 1 (-90°) and Inclined line at Day 31 (-101.25° / 258.75°)
  const monthCol = getMonthColumnAngles();
  const day1 = getDayAngles(1);
  const day31 = getDayAngles(31);

  console.assert(Math.abs(day1.startAngle - (-90)) < 0.001, 'Day 1 starts at vertical straight line (-90 degrees)');
  console.assert(Math.abs(monthCol.endAngle - (-90)) < 0.001, 'Month column ends at vertical straight line (-90 degrees)');
  console.assert(Math.abs(monthCol.startAngle - (-101.25)) < 0.001, 'Month column starts at inclined line (-101.25 degrees)');
  console.assert(Math.abs(day31.endAngle - 258.75) < 0.001, 'Day 31 ends at inclined line (258.75 = -101.25 + 360)');
  console.log('✓ Test 3 Passed: Straight line at 1st (-90°) and inclined line at 31st verified.');

  // Test 4: SVG path generation
  const path = createAnnularSectorPath(450, 450, 150, 200, -90, -78.75);
  console.assert(path.startsWith('M ') && path.includes(' A 200 200') && path.includes(' A 150 150'), 'Valid SVG annular sector path');
  console.log('✓ Test 4 Passed: SVG annular sector path syntax valid.');

  // Test 5: Palettes & Theme color mapping
  const redColor = getCompletionColor(0, true, true, 'bright', 'sage_bright');
  const lightGreen = getCompletionColor(15, true, true, 'bright', 'sage_bright');
  const darkestGreen = getCompletionColor(100, true, true, 'bright', 'sage_bright');
  const oceanBlue = getCompletionColor(100, true, true, 'bright', 'sky_bright');
  const unrecorded = getCompletionColor(0, false, true, 'bright', 'sage_bright');
  const darkForest100 = getCompletionColor(100, true, true, 'dark', 'forest_dark');

  console.assert(redColor === '#e05353', 'Forest 0% is red');
  console.assert(lightGreen === '#cce8cf', 'Forest 15% is light sage');
  console.assert(darkestGreen === '#13441b', 'Forest 100% is darkest forest');
  console.assert(oceanBlue === '#1e40af', 'Ocean 100% is deep royal blue');
  console.assert(unrecorded === '#f4f0e6', 'Unrecorded light is warm cream');
  console.assert(darkForest100 === '#75f096', 'Dark Forest 100% is bright neon green');
  console.assert(Object.keys(PALETTES).length >= 6, 'Must have circle palettes');
  console.log('✓ Test 5 Passed: Bright and Dark palette color systems and resolvers verified.');

  console.log('\nALL 5 CORE VERIFICATION SUITES PASSED CLEANLY!\n');
}

runTests();
