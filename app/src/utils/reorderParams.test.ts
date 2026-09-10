import { Param } from '@/types';

import { reorderParams } from './reorderParams';

describe('reorderParams', () => {
  const params: Param[] = [
    { id: 'a', title: 'A' },
    { id: 'b', title: 'B' },
    { id: 'c', title: 'C' },
    { id: 'd', title: 'D' },
  ];
  const allIds = params.map((p) => p.id);

  it('moves an item forward within the full list', () => {
    const result = reorderParams(params, allIds, 'a', 'c');
    expect(result.map((p) => p.id)).toEqual(['b', 'c', 'a', 'd']);
  });

  it('moves an item backward within the full list', () => {
    const result = reorderParams(params, allIds, 'd', 'b');
    expect(result.map((p) => p.id)).toEqual(['a', 'd', 'b', 'c']);
  });

  it('reorders only within a group-filtered subset, preserving absolute slots of non-visible items', () => {
    const five: Param[] = [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
      { id: 'c', title: 'C' },
      { id: 'd', title: 'D' },
      { id: 'e', title: 'E' },
    ];
    const result = reorderParams(five, ['b', 'd'], 'b', 'd');
    expect(result.map((p) => p.id)).toEqual(['a', 'd', 'c', 'b', 'e']);
  });

  it('is a no-op (same reference) when dragged and drop-target ids are the same', () => {
    const result = reorderParams(params, allIds, 'b', 'b');
    expect(result).toBe(params);
  });

  it('is a no-op (same reference) when either id is not in the visible subset', () => {
    const result = reorderParams(params, ['a', 'b', 'c'], 'a', 'd');
    expect(result).toBe(params);
  });

  it('returns an empty array unchanged when fullParams is empty', () => {
    const result = reorderParams([], [], 'a', 'b');
    expect(result).toEqual([]);
  });
});
