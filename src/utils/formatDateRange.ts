export function formatDateRange(start: Date, end: Date, isCondensed: boolean): string {
  const MS_PER_HOUR = 60 * 60 * 1000;
  const MS_PER_DAY = MS_PER_HOUR * 24;

  const datePart = start.toLocaleDateString('en-US', {
    year: isCondensed ? '2-digit' : 'numeric',
    month: isCondensed ? '2-digit' : 'short',
    day: isCondensed ? '2-digit' : 'numeric',
  });

  const daysRepresented =
    Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;

  return `${datePart}${daysRepresented !== 1 ? ` (${daysRepresented}D)` : ''}`;
}
