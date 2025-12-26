import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);

  // Keep internal temp dates in sync when the controlled props change
  useEffect(() => {
    setTempStartDate(startDate);
  }, [startDate]);

  useEffect(() => {
    setTempEndDate(endDate);
  }, [endDate]);

  const handleDateChange = (newStart: Date | null, newEnd: Date | null) => {
    if (newStart && newEnd) {
      if (newStart > newEnd) {
        // Swap if start is after end
        onDateRangeChange(newEnd, newStart);
      } else {
        onDateRangeChange(newStart, newEnd);
      }
    }
  };

  function formatRangeDisplay(s: Date, e: Date) {
    const opts: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    };
    return `${s.toLocaleDateString('en-US', opts)} - ${e.toLocaleDateString('en-US', opts)}`;
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Display cell showing current date range */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="py-1.5 px-3 border border-gray-300 rounded-sm background-white cursor-pointer text-md font-medium flex items-center gap-3 min-w-[250px] select-none"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <path
            d="M5.33333 1.33331V3.99998M10.6667 1.33331V3.99998M2 6.66665H14M3.33333 2.66665H12.6667C13.403 2.66665 14 3.2636 14 3.99998V13.3333C14 14.0697 13.403 14.6666 12.6667 14.6666H3.33333C2.59695 14.6666 2 14.0697 2 13.3333V3.99998C2 3.2636 2.59695 2.66665 3.33333 2.66665Z"
            stroke="#09090B"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-gray-900 text-sm font-medium">
          {formatRangeDisplay(startDate, endDate)}
        </span>
      </div>

      {/* Calendar picker modal */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-md p-4 z-50 shadow-md">
          <div
            className="flex items-start justify-around gap-3"
            style={{
              flexDirection: window.innerWidth < 500 ? 'column' : 'row',
            }}
          >
            {/* Start date picker */}
            <div className="flex-0">
              <DatePicker
                selected={tempStartDate}
                onChange={(date) => {
                  setTempStartDate(date);
                  if (date && tempEndDate) {
                    handleDateChange(date, tempEndDate);
                  }
                }}
                selectsStart
                startDate={tempStartDate}
                endDate={tempEndDate}
                inline
                maxDate={tempEndDate || new Date()}
              />
            </div>

            {/* End date picker */}
            <div className="flex-0">
              <DatePicker
                selected={tempEndDate}
                onChange={(date) => {
                  setTempEndDate(date);
                  if (date && tempStartDate) {
                    handleDateChange(tempStartDate, date);
                    setIsOpen(false);
                  }
                }}
                selectsEnd
                startDate={tempStartDate}
                endDate={tempEndDate}
                inline
                minDate={tempStartDate}
              />
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close picker when clicking outside */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40"
        />
      )}
    </div>
  );
}
