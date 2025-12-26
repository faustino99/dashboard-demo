import React from 'react';
import { GridLayout } from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { BarChart } from './BarChart';
import {
  GRID_ITEM_MARGIN_PX,
  GRID_CONTAINER_PADDING_PX,
  MAX_CONDENSED_CHART_WIDTH,
} from '../utils/constants';
import { getChartMetadata } from '../utils/generateData';
import { computeFreeEditCols } from '../utils/gridLayout';

interface GridLayoutSectionProps {
  windowWidth: number;
  layout: Layout;
  onLayoutChange: (newLayout: Layout) => void;
}

export function GridLayoutSection({
  windowWidth,
  layout,
  onLayoutChange,
}: GridLayoutSectionProps) {
  const charts = getChartMetadata();

  return (
    <GridLayout
      className="layout"
      layout={layout}
      gridConfig={{
        cols: computeFreeEditCols(windowWidth || 1200),
        rowHeight: 60,
        margin: [GRID_ITEM_MARGIN_PX, GRID_ITEM_MARGIN_PX],
        containerPadding: [
          GRID_CONTAINER_PADDING_PX,
          GRID_CONTAINER_PADDING_PX,
        ],
      }}
      width={windowWidth || 1200}
      onLayoutChange={onLayoutChange}
      dragConfig={{
        handle: '.drag-handle',
      }}
      resizeConfig={{
        enabled: true,
        handles: ['se'],
      }}
    >
      {charts.map((chart, index) => {
        const currLayout = layout.find((l) => l.i === `chart-${index}`);
        const wUnits = currLayout?.w ?? 4;
        const hUnits = currLayout?.h ?? 4;
        const containerW = windowWidth || 1200;
        const cols = computeFreeEditCols(containerW);
        const rowHeight = 60;
        const marginX = GRID_ITEM_MARGIN_PX;
        const marginY = GRID_ITEM_MARGIN_PX;
        const paddingX = GRID_CONTAINER_PADDING_PX;
        const colWidth =
          (containerW - marginX * (cols - 1) - paddingX * 2) / cols;
        const widthPx = Math.round(wUnits * colWidth + (wUnits - 1) * marginX);
        const heightPx = Math.round(
          hUnits * rowHeight + (hUnits - 1) * marginY
        );

        return (
          <div
            key={`chart-${index}`}
            style={{
              position: 'relative',
              backgroundColor: 'white',
            }}
          >
            <div
              className="drag-handle absolute top-2 left-2 cursor-move z-10 bg-white opacity-80 border border-gray-300 rounded-sm p-1 flex items-center justify-center w-6 h-6 select-none"
              title="Drag to move"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="12,1 8,5 16,5" fill="#111" />
                <rect x="11" y="5" width="2" height="14" fill="#111" />
                <polygon points="12,23 8,19 16,19" fill="#111" />
                <polygon points="1,12 5,8 5,16" fill="#111" />
                <rect x="5" y="11" width="14" height="2" fill="#111" />
                <polygon points="23,12 19,8 19,16" fill="#111" />
              </svg>
            </div>
            <BarChart
              color={chart.color}
              width={widthPx}
              height={heightPx}
              title={chart.title}
              isCondensed={widthPx < MAX_CONDENSED_CHART_WIDTH}
            />
          </div>
        );
      })}
    </GridLayout>
  );
}
