import { DataPoint } from './generateData';

export type IsMissingDataParams = {
  data?: DataPoint[];
  newStartDate: Date;
  newEndDate: Date;
};

export function isMissingData({
  data,
  newStartDate,
  newEndDate,
}: IsMissingDataParams) {
  if (!data) {
    return true;
  }
  const dataStart = new Date(data[0].timestamp);
  const dataEnd = new Date(data[data.length - 1].timestamp);
  return dataStart > newStartDate || dataEnd < newEndDate;
}
