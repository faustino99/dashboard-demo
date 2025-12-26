import { DataPoint } from './generateData';
import {
  MIN_BAR_WIDTH,
  BAR_PADDING,
  MS_PER_HOUR,
  HOURS_PER_DAY,
} from './constants';

export function calculateNumBars(width: number): number {
  return Math.floor(width / (MIN_BAR_WIDTH + BAR_PADDING));
}

export type BarGroup = {
  start: Date;
  end: Date;
  count: number;
  value: number; // aggregated value (sum of datapoint values)
  points: DataPoint[];
};

/**
 * Group datapoints into bar bins based on start/end range and available width.
 * Returns groups (one per bar), the computed number of bars, and the max aggregated value.
 */
export function groupDataPoints(
  data: DataPoint[],
  startDate: Date,
  endDate: Date,
  width: number
): { groups: BarGroup[]; maxValue: number } {
  const start = new Date(startDate);
  start.setMinutes(0, 0, 0);
  const end = new Date(endDate);
  end.setMinutes(0, 0, 0);

  if (end < start) {
    throw new Error('endDate must be on or after startDate');
  }

  const dataInRange = data.filter(
    (dp) => dp.timestamp >= start && dp.timestamp <= end
  );

  const barsToFillWidth = calculateNumBars(width);
  if (barsToFillWidth <= 0) return { groups: [], maxValue: 0 };

  const totalHours =
    Math.floor((end.getTime() - start.getTime()) / MS_PER_HOUR) + 1;

  // base granularity is 24 hours (1 day), and we allow increments of 24 hours (24, 48, 72, ...)
  const BASE = HOURS_PER_DAY;

  // choose the smallest integer hourSize (multiple of BASE) such that number of bars fits in width
  let hourSize = BASE;
  let numBars = Math.ceil(totalHours / hourSize);
  for (let h = BASE; h <= totalHours; h += BASE) {
    const needed = Math.ceil(totalHours / h);
    if (needed <= barsToFillWidth) {
      hourSize = h;
      numBars = needed;
      break;
    }
  }

  if (numBars > barsToFillWidth) {
    hourSize = Math.ceil(totalHours / barsToFillWidth / BASE) * BASE;
    numBars = Math.ceil(totalHours / hourSize);
  }

  // create groups each spanning exactly `hourSize` hours (groups may extend past `end`)
  const groups: BarGroup[] = Array.from({ length: numBars }, (_, i) => {
    const gs = new Date(start.getTime() + i * hourSize * MS_PER_HOUR);
    gs.setMinutes(0, 0, 0);
    const ge = new Date(start.getTime() + (i + 1) * hourSize * MS_PER_HOUR - 1);
    return { start: gs, end: ge, count: 0, value: 0, points: [] };
  });

  // assign each datapoint to the appropriate fixed-size bin
  for (const dp of dataInRange) {
    const d = new Date(dp.timestamp);
    d.setMinutes(0, 0, 0);
    if (d < start || d > end) continue;

    const hourIndex = Math.floor((d.getTime() - start.getTime()) / MS_PER_HOUR);
    const bin = Math.min(numBars - 1, Math.floor(hourIndex / hourSize));

    const g = groups[bin];
    g.points.push(dp);
    g.count += 1;
    g.value += dp.value;
  }

  const maxValue = groups.reduce((m, g) => Math.max(m, g.value), 0);

  return { groups, maxValue };
}
