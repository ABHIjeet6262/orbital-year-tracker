export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
] as const;

export const MONTH_SHORT_NAMES = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
] as const;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year: number, monthIndex: number): number {
  // monthIndex: 0 = Jan, 11 = Dec
  if (monthIndex === 1) {
    return isLeapYear(year) ? 29 : 28;
  }
  const daysMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysMap[monthIndex];
}

export function formatDateString(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function parseDateString(dateStr: string): { year: number; monthIndex: number; day: number } {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  return {
    year: parseInt(yearStr, 10),
    monthIndex: parseInt(monthStr, 10) - 1,
    day: parseInt(dayStr, 10),
  };
}

export function formatFriendlyDate(dateStr: string): string {
  const { year, monthIndex, day } = parseDateString(dateStr);
  const monthName = MONTH_NAMES[monthIndex];
  return `${monthName} ${day}, ${year}`;
}

export function getTodayString(): string {
  const now = new Date();
  return formatDateString(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isSameDay(d1: string, d2: string): boolean {
  return d1 === d2;
}

export function isDateBefore(d1: string, d2: string): boolean {
  return d1 < d2;
}

export function isDateAfter(d1: string, d2: string): boolean {
  return d1 > d2;
}
