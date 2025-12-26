import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChartGroupContextType {
  startDate: Date;
  endDate: Date;
  setDateRange: (startDate: Date, endDate: Date) => void;
  hoveredDate?: Date;
  setHoveredDate: (date: Date | undefined) => void;
}

const ChartGroupContext = createContext<ChartGroupContextType | undefined>(
  undefined
);

export function ChartGroupProvider({ children }: { children: ReactNode }) {
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 90 * 1000 * 60 * 60 * 24)
  );
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);

  const setDateRange = (newStartDate: Date, newEndDate: Date) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <ChartGroupContext.Provider value={{ startDate, endDate, setDateRange, hoveredDate, setHoveredDate }}>
      {children}
    </ChartGroupContext.Provider>
  );
}

export function useChartGroupData() {
  const context = useContext(ChartGroupContext);
  if (!context) {
    throw new Error('useChartGroupData must be used within a ChartGroupProvider');
  }
  return context;
}
