import React, { useEffect, useMemo, useState } from 'react';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { DataPoint, generateRandomData } from '../utils/generateData';
import {
  MIN_BAR_WIDTH,
  BAR_PADDING,
  CHART_FOOTER_HEIGHT,
  CHART_X_MARGIN,
  CHART_Y_MARGIN,
  MAX_BAR_WIDTH,
} from '../utils/constants';
import { groupDataPoints } from '../utils/barChartUtils';
import { useChartGroupData } from '../contexts/ChartGroupContext';
import { formatDateRange } from '../utils/formatDateRange';
import { isMissingData } from '../utils/isMissingData';

export type BarChartProps = {
  color: string;
  width: number;
  height: number;
  title: string;
  isCondensed?: boolean;
};

export function BarChart({
  color,
  width,
  height,
  title,
  isCondensed,
}: BarChartProps) {
  const chartHeight = height - CHART_FOOTER_HEIGHT - CHART_Y_MARGIN * 2;
  const chartWidth = width - CHART_X_MARGIN * 2;
  const { startDate, endDate, setDateRange, setHoveredDate, hoveredDate } =
    useChartGroupData();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataPoint[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await generateRandomData(startDate, endDate);
        setData(data);
      } catch {
        // in a real app, you'd want to handle API errors here
      } finally {
        setIsLoading(false);
      }
    }

    if (
      isMissingData({
        data: data,
        newStartDate: startDate,
        newEndDate: endDate,
      })
    ) {
      fetchData();
    }
  }, [startDate, endDate]);

  const { groups, maxValue } = useMemo(() => {
    if (!data) {
      return {
        groups: undefined,
        maxValue: undefined,
      };
    }

    return groupDataPoints(data, startDate, endDate, chartWidth);
  }, [data, startDate, endDate, chartWidth]);

  const numBars = groups?.length ?? 0;
  const availableForBars = Math.max(
    0,
    chartWidth - BAR_PADDING * (numBars + 1)
  );
  const baseComputed =
    numBars > 0 ? Math.floor(availableForBars / numBars) : MIN_BAR_WIDTH;
  const barRemainder = numBars > 0 ? availableForBars % numBars : 0;
  const barWidth = Math.min(MAX_BAR_WIDTH, baseComputed);

  const selectedGroup = useMemo(
    () =>
      groups?.find((g) => {
        return (
          g.start.getTime() <= hoveredDate?.getTime() &&
          g.end.getTime() >= hoveredDate?.getTime()
        );
      }),
    [groups, hoveredDate]
  );

  const yScale = useMemo(() => {
    return scaleLinear<number>({
      range: [chartHeight, 0],
      round: true,
      domain: [0, (maxValue ?? 100) + 20],
    });
  }, [chartHeight, maxValue]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - svgRect.left;
    setIsDragging(true);
    setDragStart(relativeX);
    setDragEnd(relativeX);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || dragStart === null) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - svgRect.left;
    setDragEnd(relativeX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
    if (!isDragging || dragStart === null || dragEnd === null) {
      return;
    }

    // Calculate the percentage of the chart that was selected
    const minX = Math.min(dragStart, dragEnd);
    const maxX = Math.max(dragStart, dragEnd);

    if (maxX - minX < barWidth * 2) return; // Ignore small selections

    const minPercent = minX / chartWidth;
    const maxPercent = maxX / chartWidth;

    // Convert percentages to dates
    const timeRange = endDate.getTime() - startDate.getTime();
    const newStartDate = new Date(startDate.getTime() + timeRange * minPercent);
    const newEndDate = new Date(startDate.getTime() + timeRange * maxPercent);

    setDateRange(newStartDate, newEndDate);

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  const overlayWidth =
    dragStart !== null && dragEnd !== null ? Math.abs(dragEnd - dragStart) : 0;

  return (
    <div
      style={{
        width,
        height,
      }}
    >
      <div style={{
        margin: `${CHART_Y_MARGIN}px ${CHART_X_MARGIN}px`,
      }}>
        {isLoading || !data ? (
          <div
            className="flex items-center justify-center border-b border-gray-300"
            style={{
              width: chartWidth,
              height: chartHeight,
            }}
          >
            <div>Loading...</div>
          </div>
        ) : (
          <svg
            width={chartWidth}
            height={chartHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setHoveredDate(null);
              if (isDragging) {
                setIsDragging(false);
                setDragStart(null);
                setDragEnd(null);
              }
            }}
            className="user-select-none border-b border-gray-300"
            style={{
              cursor: isDragging ? 'col-resize' : 'pointer',
            }}
          >
            <Group>
              {groups
                ?.map((g, i) => {
                  let barX = BAR_PADDING + i * (barWidth + BAR_PADDING);
                  // Take into account any remainder pixels, which are distributed one per bar, left to right
                  barX += Math.min(i, barRemainder);
                  const barHeight = chartHeight - yScale(g.value);
                  const barY = chartHeight - barHeight - 1;
                  const isHovered =
                    selectedGroup?.start?.getTime() === g.start.getTime();
                  const widthWithRemainder =
                    barWidth + (i < barRemainder ? 1 : 0);

                  return [
                    <rect
                      key={`hover-bar-${g.start}-${g.end}`}
                      x={barX}
                      y={0}
                      width={widthWithRemainder}
                      rx={widthWithRemainder / 2}
                      height={chartHeight}
                      fill="gray"
                      opacity={isHovered && !isDragging ? 0.2 : 0}
                      onMouseEnter={() => {
                        setHoveredDate(g.start);
                      }}
                    />,
                    <rect
                      key={`bar-${g.start}-${g.end}`}
                      x={barX}
                      y={barY}
                      width={widthWithRemainder}
                      height={barHeight}
                      fill={color}
                      rx={widthWithRemainder / 2}
                      onMouseEnter={() => {
                        setHoveredDate(g.start);
                      }}
                    />,
                  ];
                })
                .flat()}
              {isDragging && dragStart !== null && dragEnd !== null && (
                <rect
                  x={Math.min(dragStart, dragEnd)}
                  y={0}
                  width={overlayWidth}
                  height={chartHeight}
                  fill={color}
                  stroke={color}
                  strokeWidth={2}
                  pointerEvents="none"
                  opacity={0.3}
                  rx={8}
                />
              )}
            </Group>
          </svg>
        )}
        <div
          className="flex mt-1 justify-between items-center"
          style={{
            height: CHART_FOOTER_HEIGHT,
          }}
        >
          <p className="my-0 mx-2 font-medium text-black text-md font-sans">
            {isCondensed && hoveredDate ? null : title}
          </p>
          {selectedGroup && (
            <div
              className="rounded-sm flex items-center h-5"
              style={{
                border: `1px solid ${color}`,
              }}
            >
              <div
                className="h-5 flex items-center rounded-tl-sm rounded-bl-sm"
                style={{
                  backgroundColor: color,
                }}
              >
                <p className="text-white font-sans mx-2 text-xs">
                  {formatDateRange(
                    selectedGroup.start,
                    selectedGroup.end,
                    isCondensed
                  )}
                </p>
              </div>
              <p className="font-sans text-xs mx-2">
                {selectedGroup?.value ?? 0}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
