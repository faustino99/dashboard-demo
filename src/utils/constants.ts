// Chart Display Constants
export const MIN_BAR_WIDTH = 8;
export const MAX_BAR_WIDTH = 14;
export const BAR_PADDING = 2;
export const CHART_FOOTER_HEIGHT = 32;
export const CHART_X_MARGIN = 16;
export const CHART_Y_MARGIN = 8;
export const CHART_DEFAULT_HEIGHT = 250;
export const MAX_CONDENSED_CHART_WIDTH = 300;

// Responsive Design Constants
export const MAX_SMALL_VIEWPORT_WIDTH = 800;

// Grid Layout Constants
export const GRID_ITEM_MARGIN_PX = 10;
export const GRID_CONTAINER_PADDING_PX = 10;

// Time Constants
export const MS_PER_HOUR = 60 * 60 * 1000;
export const HOURS_PER_DAY = 24;

// Chart Modes
export const CHART_MODES = ['Vertical', 'Responsive', 'Free edit'] as const;
export type ChartMode = (typeof CHART_MODES)[number];

// Mode Options for Selector
export const MODE_OPTIONS = [
  { value: 'Vertical' as const, label: 'Vertical' },
  { value: 'Responsive' as const, label: 'Responsive' },
  { value: 'Free edit' as const, label: 'Free edit' },
];
