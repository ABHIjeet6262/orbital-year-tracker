import type { PageTheme, CirclePalette } from '../types';

export interface CompletionColorLevel {
  label: string;
  minPercent: number;
  maxPercent: number;
  lightColor: string;
  darkColor: string;
}

export interface PaletteDefinition {
  id: CirclePalette;
  name: string;
  previewColor: string;
  levels: CompletionColorLevel[];
}

export const PALETTES: Record<CirclePalette, PaletteDefinition> = {
  forest: {
    id: 'forest',
    name: 'Forest Green',
    previewColor: '#1b4332',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, lightColor: '#e05353', darkColor: '#ef4444' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, lightColor: '#cce8cf', darkColor: '#1a3a22' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, lightColor: '#9ecda4', darkColor: '#255933' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, lightColor: '#63aa6e', darkColor: '#307d47' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, lightColor: '#388544', darkColor: '#3fa35e' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, lightColor: '#22632c', darkColor: '#4ece77' },
      { label: '100%', minPercent: 100, maxPercent: 100, lightColor: '#13441b', darkColor: '#75f096' },
    ],
  },
  emerald: {
    id: 'emerald',
    name: 'Vibrant Mint',
    previewColor: '#10b981',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, lightColor: '#f43f5e', darkColor: '#fb7185' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, lightColor: '#ccfbf1', darkColor: '#134e48' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, lightColor: '#99f6e4', darkColor: '#115e59' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, lightColor: '#5eead4', darkColor: '#0d9488' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, lightColor: '#2dd4bf', darkColor: '#14b8a6' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, lightColor: '#14b8a6', darkColor: '#2dd4bf' },
      { label: '100%', minPercent: 100, maxPercent: 100, lightColor: '#0f766e', darkColor: '#5eead4' },
    ],
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    previewColor: '#2563eb',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, lightColor: '#e11d48', darkColor: '#f43f5e' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, lightColor: '#dbeafe', darkColor: '#1e3a8a' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, lightColor: '#bfdbfe', darkColor: '#1d4ed8' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, lightColor: '#93c5fd', darkColor: '#2563eb' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, lightColor: '#60a5fa', darkColor: '#3b82f6' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, lightColor: '#3b82f6', darkColor: '#60a5fa' },
      { label: '100%', minPercent: 100, maxPercent: 100, lightColor: '#1e40af', darkColor: '#93c5fd' },
    ],
  },
  amber: {
    id: 'amber',
    name: 'Warm Sunset',
    previewColor: '#d97706',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, lightColor: '#e11d48', darkColor: '#f43f5e' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, lightColor: '#fef3c7', darkColor: '#78350f' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, lightColor: '#fde68a', darkColor: '#92400e' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, lightColor: '#fcd34d', darkColor: '#b45309' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, lightColor: '#fbbf24', darkColor: '#d97706' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, lightColor: '#f59e0b', darkColor: '#f59e0b' },
      { label: '100%', minPercent: 100, maxPercent: 100, lightColor: '#b45309', darkColor: '#fde68a' },
    ],
  },
  amethyst: {
    id: 'amethyst',
    name: 'Amethyst Violet',
    previewColor: '#7c3aed',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, lightColor: '#e11d48', darkColor: '#f43f5e' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, lightColor: '#ede9fe', darkColor: '#4c1d95' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, lightColor: '#ddd6fe', darkColor: '#5b21b6' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, lightColor: '#c4b5fd', darkColor: '#6d28d9' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, lightColor: '#a78bfa', darkColor: '#7c3aed' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, lightColor: '#8b5cf6', darkColor: '#8b5cf6' },
      { label: '100%', minPercent: 100, maxPercent: 100, lightColor: '#5b21b6', darkColor: '#c4b5fd' },
    ],
  },
  monochrome: {
    id: 'monochrome',
    name: 'Minimal Slate',
    previewColor: '#475569',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, lightColor: '#ef4444', darkColor: '#ef4444' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, lightColor: '#e2e8f0', darkColor: '#1e293b' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, lightColor: '#cbd5e1', darkColor: '#334155' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, lightColor: '#94a3b8', darkColor: '#475569' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, lightColor: '#64748b', darkColor: '#64748b' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, lightColor: '#475569', darkColor: '#94a3b8' },
      { label: '100%', minPercent: 100, maxPercent: 100, lightColor: '#0f172a', darkColor: '#f1f5f9' },
    ],
  },
};

export function getCompletionColor(
  percentage: number,
  isRecorded: boolean,
  isValidDay: boolean,
  pageTheme: PageTheme = 'light',
  circlePalette: CirclePalette = 'forest'
): string {
  if (!isValidDay) {
    return pageTheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
  }

  if (!isRecorded) {
    return pageTheme === 'dark' ? '#1f2421' : '#f4f1ea';
  }

  const palette = PALETTES[circlePalette] || PALETTES.forest;
  const levels = palette.levels;

  // 0% completion
  if (percentage === 0) {
    return pageTheme === 'dark' ? levels[0].darkColor : levels[0].lightColor;
  }

  // Find tier
  for (let i = 1; i < levels.length; i++) {
    const level = levels[i];
    if (percentage >= level.minPercent && percentage <= level.maxPercent) {
      return pageTheme === 'dark' ? level.darkColor : level.lightColor;
    }
  }

  return pageTheme === 'dark' ? levels[6].darkColor : levels[6].lightColor;
}

export function getGridBorderColor(pageTheme: PageTheme = 'light'): string {
  if (pageTheme === 'dark') return 'rgba(255, 255, 255, 0.12)';
  return 'rgba(60, 50, 40, 0.15)';
}
