import type { CircleTone, CirclePalette } from '../types';

export interface CompletionColorLevel {
  label: string;
  minPercent: number;
  maxPercent: number;
  color: string;
}

export interface PaletteDefinition {
  id: CirclePalette;
  name: string;
  tone: CircleTone;
  previewColor: string;
  levels: CompletionColorLevel[];
}

export const BRIGHT_PALETTES: PaletteDefinition[] = [
  {
    id: 'sage_bright',
    name: 'Sage Forest',
    tone: 'bright',
    previewColor: '#1b4332',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, color: '#e05353' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, color: '#cce8cf' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, color: '#9ecda4' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, color: '#63aa6e' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, color: '#388544' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, color: '#22632c' },
      { label: '100%', minPercent: 100, maxPercent: 100, color: '#13441b' },
    ],
  },
  {
    id: 'mint_bright',
    name: 'Spring Mint',
    tone: 'bright',
    previewColor: '#0d9488',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, color: '#f43f5e' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, color: '#ccfbf1' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, color: '#99f6e4' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, color: '#5eead4' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, color: '#2dd4bf' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, color: '#14b8a6' },
      { label: '100%', minPercent: 100, maxPercent: 100, color: '#0f766e' },
    ],
  },
  {
    id: 'sky_bright',
    name: 'Azure Sky',
    tone: 'bright',
    previewColor: '#2563eb',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, color: '#e11d48' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, color: '#dbeafe' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, color: '#bfdbfe' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, color: '#93c5fd' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, color: '#60a5fa' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, color: '#3b82f6' },
      { label: '100%', minPercent: 100, maxPercent: 100, color: '#1e40af' },
    ],
  },
  {
    id: 'amber_bright',
    name: 'Sunrise Amber',
    tone: 'bright',
    previewColor: '#d97706',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, color: '#e11d48' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, color: '#fef3c7' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, color: '#fde68a' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, color: '#fcd34d' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, color: '#fbbf24' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, color: '#f59e0b' },
      { label: '100%', minPercent: 100, maxPercent: 100, color: '#b45309' },
    ],
  },
  {
    id: 'rose_bright',
    name: 'Cherry Blossom',
    tone: 'bright',
    previewColor: '#e11d48',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, color: '#dc2626' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, color: '#ffe4e6' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, color: '#fecdd3' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, color: '#fda4af' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, color: '#fb7185' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, color: '#f43f5e' },
      { label: '100%', minPercent: 100, maxPercent: 100, color: '#be123c' },
    ],
  },
  {
    id: 'slate_bright',
    name: 'Paper Slate',
    tone: 'bright',
    previewColor: '#334155',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, color: '#ef4444' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, color: '#e2e8f0' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, color: '#cbd5e1' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, color: '#94a3b8' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, color: '#64748b' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, color: '#475569' },
      { label: '100%', minPercent: 100, maxPercent: 100, color: '#0f172a' },
    ],
  },
];

export const DARK_PALETTES: PaletteDefinition[] = [
  {
    id: 'forest_dark',
    name: 'Midnight Forest',
    tone: 'dark',
    previewColor: '#3fa35e',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, color: '#ef4444' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, color: '#1a3a22' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, color: '#255933' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, color: '#307d47' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, color: '#3fa35e' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, color: '#4ece77' },
      { label: '100%', minPercent: 100, maxPercent: 100, color: '#75f096' },
    ],
  },
  {
    id: 'mint_dark',
    name: 'Cyber Mint',
    tone: 'dark',
    previewColor: '#14b8a6',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, color: '#fb7185' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, color: '#134e48' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, color: '#115e59' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, color: '#0d9488' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, color: '#14b8a6' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, color: '#2dd4bf' },
      { label: '100%', minPercent: 100, maxPercent: 100, color: '#5eead4' },
    ],
  },
  {
    id: 'ocean_dark',
    name: 'Ocean Indigo',
    tone: 'dark',
    previewColor: '#3b82f6',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, color: '#f43f5e' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, color: '#1e3a8a' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, color: '#1d4ed8' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, color: '#2563eb' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, color: '#3b82f6' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, color: '#60a5fa' },
      { label: '100%', minPercent: 100, maxPercent: 100, color: '#93c5fd' },
    ],
  },
  {
    id: 'sunset_dark',
    name: 'Solar Flare',
    tone: 'dark',
    previewColor: '#f59e0b',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, color: '#f43f5e' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, color: '#78350f' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, color: '#92400e' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, color: '#b45309' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, color: '#d97706' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, color: '#f59e0b' },
      { label: '100%', minPercent: 100, maxPercent: 100, color: '#fde68a' },
    ],
  },
  {
    id: 'amethyst_dark',
    name: 'Neon Amethyst',
    tone: 'dark',
    previewColor: '#8b5cf6',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, color: '#f43f5e' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, color: '#4c1d95' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, color: '#5b21b6' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, color: '#6d28d9' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, color: '#7c3aed' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, color: '#8b5cf6' },
      { label: '100%', minPercent: 100, maxPercent: 100, color: '#c4b5fd' },
    ],
  },
  {
    id: 'slate_dark',
    name: 'Obsidian Slate',
    tone: 'dark',
    previewColor: '#64748b',
    levels: [
      { label: '0%', minPercent: 0, maxPercent: 0, color: '#ef4444' },
      { label: '1–20%', minPercent: 1, maxPercent: 20, color: '#1e293b' },
      { label: '21–40%', minPercent: 21, maxPercent: 40, color: '#334155' },
      { label: '41–60%', minPercent: 41, maxPercent: 60, color: '#475569' },
      { label: '61–80%', minPercent: 61, maxPercent: 80, color: '#64748b' },
      { label: '81–99%', minPercent: 81, maxPercent: 99, color: '#94a3b8' },
      { label: '100%', minPercent: 100, maxPercent: 100, color: '#f1f5f9' },
    ],
  },
];

// Lookup Map for all palettes
export const ALL_PALETTES: Record<string, PaletteDefinition> = {
  // Bright
  sage_bright: BRIGHT_PALETTES[0],
  mint_bright: BRIGHT_PALETTES[1],
  sky_bright: BRIGHT_PALETTES[2],
  amber_bright: BRIGHT_PALETTES[3],
  rose_bright: BRIGHT_PALETTES[4],
  slate_bright: BRIGHT_PALETTES[5],
  // Dark
  forest_dark: DARK_PALETTES[0],
  mint_dark: DARK_PALETTES[1],
  ocean_dark: DARK_PALETTES[2],
  sunset_dark: DARK_PALETTES[3],
  amethyst_dark: DARK_PALETTES[4],
  slate_dark: DARK_PALETTES[5],
  // Backward-compatibility aliases
  forest: DARK_PALETTES[0],
  emerald: DARK_PALETTES[1],
  ocean: DARK_PALETTES[2],
  amber: DARK_PALETTES[3],
  amethyst: DARK_PALETTES[4],
  monochrome: DARK_PALETTES[5],
};

// Default backward compatible PALETTES export
export const PALETTES = ALL_PALETTES;

export function getPalettesByTone(tone: CircleTone): PaletteDefinition[] {
  return tone === 'bright' ? BRIGHT_PALETTES : DARK_PALETTES;
}

export function resolvePalette(paletteId: CirclePalette, tone: CircleTone): PaletteDefinition {
  if (ALL_PALETTES[paletteId]) {
    const pal = ALL_PALETTES[paletteId];
    // If exact tone match, return it
    if (pal.tone === tone) return pal;
  }

  // If alias or mismatch, pick appropriate matching default
  if (paletteId === 'forest' || paletteId === 'sage_bright' || paletteId === 'forest_dark') {
    return tone === 'bright' ? BRIGHT_PALETTES[0] : DARK_PALETTES[0];
  }
  if (paletteId === 'emerald' || paletteId === 'mint_bright' || paletteId === 'mint_dark') {
    return tone === 'bright' ? BRIGHT_PALETTES[1] : DARK_PALETTES[1];
  }
  if (paletteId === 'ocean' || paletteId === 'sky_bright' || paletteId === 'ocean_dark') {
    return tone === 'bright' ? BRIGHT_PALETTES[2] : DARK_PALETTES[2];
  }
  if (paletteId === 'amber' || paletteId === 'amber_bright' || paletteId === 'sunset_dark') {
    return tone === 'bright' ? BRIGHT_PALETTES[3] : DARK_PALETTES[3];
  }
  if (paletteId === 'amethyst' || paletteId === 'rose_bright' || paletteId === 'amethyst_dark') {
    return tone === 'bright' ? BRIGHT_PALETTES[4] : DARK_PALETTES[4];
  }
  if (paletteId === 'monochrome' || paletteId === 'slate_bright' || paletteId === 'slate_dark') {
    return tone === 'bright' ? BRIGHT_PALETTES[5] : DARK_PALETTES[5];
  }

  return tone === 'bright' ? BRIGHT_PALETTES[0] : DARK_PALETTES[0];
}

export function getCompletionColor(
  percentage: number,
  isRecorded: boolean,
  isValidDay: boolean,
  circleTone: CircleTone = 'dark',
  circlePalette: CirclePalette = 'forest_dark'
): string {
  if (!isValidDay) {
    return circleTone === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
  }

  if (!isRecorded) {
    return circleTone === 'dark' ? '#1c221e' : '#f4f0e6';
  }

  const palette = resolvePalette(circlePalette, circleTone);
  const levels = palette.levels;

  // 0% completion
  if (percentage === 0) {
    return levels[0].color;
  }

  // Find tier
  for (let i = 1; i < levels.length; i++) {
    const level = levels[i];
    if (percentage >= level.minPercent && percentage <= level.maxPercent) {
      return level.color;
    }
  }

  return levels[levels.length - 1].color;
}

export function getGridBorderColor(circleTone: CircleTone = 'dark'): string {
  if (circleTone === 'dark') return 'rgba(255, 255, 255, 0.12)';
  return 'rgba(60, 50, 40, 0.14)';
}

