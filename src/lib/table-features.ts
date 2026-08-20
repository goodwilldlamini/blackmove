import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'

// Fuzzy global-search filter, ported from the old table's rankItem-based
// match — the old app declared a matching `fuzzySort` too, but never actually
// assigned it to any column's sortFn, so it's dropped here as dead code.
function fuzzyFilter(
  row: { getValue: (id: string) => unknown },
  columnId: string,
  value: unknown,
) {
  const itemRank = rankItem(String(row.getValue(columnId) ?? ''), String(value))
  return itemRank.passed
}

export const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  columnFacetingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filterFns: { fuzzy: fuzzyFilter },
})
