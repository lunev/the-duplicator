import { Param } from '@/types';

/**
 * Moves `draggedId` to the position of `dropTargetId` within the visible
 * subset (`visibleIds`), while leaving every param NOT in `visibleIds` at
 * its original absolute index in `fullParams`.
 */
export const reorderParams = (
  fullParams: Param[],
  visibleIds: string[],
  draggedId: string,
  dropTargetId: string,
): Param[] => {
  if (draggedId === dropTargetId) return fullParams;

  const visibleIdSet = new Set(visibleIds);
  const slots: number[] = [];
  const visibleItems: Param[] = [];
  fullParams.forEach((param, index) => {
    if (visibleIdSet.has(param.id)) {
      slots.push(index);
      visibleItems.push(param);
    }
  });

  const fromIndex = visibleItems.findIndex((param) => param.id === draggedId);
  const toIndex = visibleItems.findIndex((param) => param.id === dropTargetId);
  if (fromIndex === -1 || toIndex === -1) return fullParams;

  const reordered = [...visibleItems];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved);

  const result = [...fullParams];
  slots.forEach((absoluteIndex, i) => {
    result[absoluteIndex] = reordered[i];
  });
  return result;
};
