/**
 * Data point type with timestamp and value
 */
export type DataPoint = {
  timestamp: Date;
  value: number;
};

export type ChartData = {
  title: string;
  color: string;
};

const COLORS = ['#0072DB', '#34D399', '#F87171'];

/**
 * Generates random data points between two dates
 * Each data point has a day-granular timestamp and a random value between 5 and 100
 * @param startDate - The start date for data generation
 * @param endDate - The end date for data generation
 * @returns Array of DataPoint objects
 */
export async function generateRandomData(
  startDate: Date,
  endDate: Date
): Promise<DataPoint[]> {
  const data: DataPoint[] = [];

  // mock delay to simulate async data fetching
  await new Promise(resolve => setTimeout(resolve, 1500));

  const MS_PER_HOUR = 60 * 60 * 1000;
  const INTERVAL_HOURS = 24; // generate data every 24 hours (1 day)

  const start = new Date(startDate);
  start.setMinutes(0, 0, 0);

  const end = new Date(endDate);
  end.setMinutes(0, 0, 0);

  // Iterate through each 24-hour interval (daily) from start to end
  const current = new Date(start);
  while (current <= end) {
    // Generate random value between 5 and 100
    const value = Math.floor(Math.random() * (100 - 5 + 1)) + 5;

    data.push({ timestamp: new Date(current), value });

    // Move to next 24-hour (daily) interval
    current.setTime(current.getTime() + INTERVAL_HOURS * MS_PER_HOUR);
  }

  // Sort by date (oldest to newest)
  return data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

export function getChartMetadata(): ChartData[] {
  // In a real app, we would fetch this from an API
  return Array.from({ length: 9 }, (_, i) => ({
    title: `Chart ${i + 1}`,
    color: COLORS[Math.floor(i / 3)],
  }));
}
