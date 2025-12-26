import React, { useEffect, useRef, useState } from 'react';
import type { Layout } from 'react-grid-layout';
import {
  CHART_DEFAULT_HEIGHT,
  MAX_SMALL_VIEWPORT_WIDTH,
  MAX_CONDENSED_CHART_WIDTH,
  ChartMode,
} from '../utils/constants';
import { ChartData, getChartMetadata } from '../utils/generateData';
import { HeaderBar } from './HeaderBar';
import { GridLayoutSection } from './GridLayoutSection';
import { BarChart } from './BarChart';

export function ChartGroup() {
  const widthRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [manualOverride, setManualOverride] = useState(false);
  const [isGrid, setIsGrid] = useState(true);
  const [mode, setMode] = useState<ChartMode>('Responsive');
  const [charts, setCharts] = useState<ChartData[]>([]);

  // Default layout for grid mode (3x3 grid)
  const defaultLayout: Layout = Array.from({ length: 9 }, (_, i) => ({
    i: `chart-${i}`,
    x: (i % 3) * 4,
    y: Math.floor(i / 3) * 4,
    w: 4,
    h: 4,
    minW: 2,
  }));

  const [layout, setLayout] = useState<Layout>(defaultLayout);

  useEffect(() => {
    // In a real app, this would be an async API request, and we would want a loading state / error handling
    const chartsData = getChartMetadata();
    setCharts(chartsData);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (widthRef.current) {
        const width = widthRef.current.offsetWidth;
        setWindowWidth(width);
        setIsGrid(width > MAX_SMALL_VIEWPORT_WIDTH);
        if (mode === 'Responsive') {
          setChartWidth(width > MAX_SMALL_VIEWPORT_WIDTH ? width / 3 : width);
        } else if (mode === 'Vertical') {
          setChartWidth(width);
        }
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isGrid, manualOverride, mode]);

  const handleModeChange = (newMode: ChartMode) => {
    setMode(newMode);
    if (newMode === 'Vertical') {
      setIsGrid(false);
      setManualOverride(true);
    } else if (newMode === 'Responsive') {
      setIsGrid(true);
      setManualOverride(true);
    } else if (newMode === 'Free edit') {
      setIsGrid(false);
      setManualOverride(true);
    }
  };

  return (
    <div className="w-full overflow-scroll">
      <div className="w-full min-w-[300px]" ref={widthRef}>
        <HeaderBar mode={mode} onModeChange={handleModeChange} />
        {mode === 'Free edit' ? (
          <GridLayoutSection
            windowWidth={windowWidth}
            layout={layout}
            onLayoutChange={setLayout}
          />
        ) : (
          <div
            className="w-full"
            style={{
              display: isGrid ? 'grid' : undefined,
              gridTemplateColumns: isGrid ? 'repeat(3, 1fr)' : undefined,
            }}
          >
            {!!chartWidth &&
              charts.map((chart) => {
                return (
                  <BarChart
                    key={chart.title}
                    color={chart.color}
                    width={chartWidth}
                    height={CHART_DEFAULT_HEIGHT}
                    title={chart.title}
                    isCondensed={chartWidth < MAX_CONDENSED_CHART_WIDTH}
                  />
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
