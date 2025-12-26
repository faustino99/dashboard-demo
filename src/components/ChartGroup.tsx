import React, { useEffect, useRef, useState } from 'react';
import type { Layout } from 'react-grid-layout';
import {
  CHART_DEFAULT_HEIGHT,
  MAX_SMALL_VIEWPORT_WIDTH,
  MAX_CONDENSED_CHART_WIDTH,
  ChartMode,
} from '../utils/constants';
import { ChartData, getChartMetadata } from '../utils/generateData';
import { computeFreeEditCols } from '../utils/gridLayout';
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
  const [hasCustomLayout, setHasCustomLayout] = useState(false);

  const buildDefaultLayout = (cols: number): Layout => {
    const chartWidth = Math.max(2, cols / 3);
    const chartsPerRow = Math.max(1, Math.floor(cols / chartWidth));

    return Array.from({ length: 9 }, (_, i) => {
      return {
        i: `chart-${i}`,
        x: (i % chartsPerRow) * chartWidth,
        y: Math.floor(i / chartsPerRow) * 4,
        w: chartWidth,
        h: 4,
        minW: 2,
      };
    });
  };

  const [layout, setLayout] = useState<Layout>(() =>
    buildDefaultLayout(computeFreeEditCols(1200))
  );

  useEffect(() => {
    // In a real app, this would be an async API request, and we would want a loading state / error handling
    const chartsData = getChartMetadata();
    setCharts(chartsData);
  }, []);

  useEffect(() => {
    if (!windowWidth || hasCustomLayout) {
      return;
    }

    const cols = computeFreeEditCols(windowWidth);
    setLayout(buildDefaultLayout(cols));
  }, [windowWidth, hasCustomLayout]);

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

  const handleLayoutChange = (newLayout: Layout) => {
    setHasCustomLayout(true);
    setLayout(newLayout);
  };

  return (
    <div className="w-full overflow-scroll">
      <div className="w-full min-w-[300px]" ref={widthRef}>
        <HeaderBar mode={mode} onModeChange={handleModeChange} />
        {mode === 'Free edit' ? (
          <GridLayoutSection
            windowWidth={windowWidth}
            layout={layout}
            onLayoutChange={handleLayoutChange}
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
