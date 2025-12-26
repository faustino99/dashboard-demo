import React from 'react';
import Select, { SingleValue } from 'react-select';
import { DateRangePicker } from './DateRangePicker';
import { useChartGroupData } from '../contexts/ChartGroupContext';
import { MODE_OPTIONS, ChartMode } from '../utils/constants';

interface HeaderBarProps {
  mode: ChartMode;
  onModeChange: (mode: ChartMode) => void;
}

export function HeaderBar({ mode, onModeChange }: HeaderBarProps) {
  const { startDate, endDate, setDateRange } = useChartGroupData();

  const handleModeChange = (
    option: SingleValue<{
      value: ChartMode;
      label: string;
    }>
  ) => {
    const value = option?.value;
    if (!value) return;
    onModeChange(value);
  };

  return (
    <div className="flex flex-row max-[500px]:flex-col w-full p-5 bg-gray-50 border-b border-gray-200  justify-between items-center gap-5 sticky top-0 z-50">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span
              className='text-sm font-medium text-gray-800'
            >
              Mode:
            </span>
            <div className='min-w-[150px]'>
              <Select
                options={MODE_OPTIONS}
                value={MODE_OPTIONS.find((o) => o.value === mode)}
                onChange={handleModeChange}
                isSearchable={false}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: 20,
                    width: 150,
                    borderColor: '#ccc',
                    boxShadow: 'none',
                    outline: 'none',
                    fontSize: 14,
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#ccc',
                    },
                    ...(state.isFocused
                      ? {
                          borderColor: '#ccc',
                          boxShadow: 'none',
                        }
                      : {}),
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: '0 4px',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    fontSize: 14,
                  }),
                  placeholder: (base) => ({
                    ...base,
                    fontSize: 14,
                  }),
                  input: (base) => ({
                    ...base,
                    fontSize: 14,
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    padding: 2,
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    padding: 4,
                  }),
                  menu: (base) => ({
                    ...base,
                    margin: 0,
                  }),
                  menuList: (base) => ({
                    ...base,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }),
                  option: (base, state) => ({
                    ...base,
                    fontSize: 14,
                    cursor: 'pointer',
                    padding: 6,
                    backgroundColor: state.isSelected
                      ? '#e5e7eb' // neutral gray for selected
                      : state.isFocused
                        ? '#f3f4f6' // lighter gray for hover/focus
                        : 'white',
                    color: '#111827',
                  }),
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={setDateRange}
      />
    </div>
  );
}
