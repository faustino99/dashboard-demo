import { GRID_CONTAINER_PADDING_PX, GRID_ITEM_MARGIN_PX } from './constants';

export const FREE_EDIT_TARGET_CELL_WIDTH_PX = 100;

export function computeFreeEditCols(
  containerW: number,
  targetCellWidthPx: number = FREE_EDIT_TARGET_CELL_WIDTH_PX
): number {
  const marginX = GRID_ITEM_MARGIN_PX;
  const paddingX = GRID_CONTAINER_PADDING_PX;
  const usable = containerW - paddingX * 2 + marginX;
  const cols = Math.max(
    1,
    Math.min(12, Math.floor(usable / (targetCellWidthPx + marginX)))
  );
  return cols;
}
