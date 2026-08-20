import type { Column, ReactTable } from '@tanstack/react-table'
import type { RowData } from '@tanstack/table-core'
import { Filter } from 'lucide-react'
import { useMemo } from 'react'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { features } from '#/lib/table-features'

const ALL_VALUE = '__all__'

export function TableFilters<TData extends RowData>({
  table,
}: {
  table: ReactTable<typeof features, TData>
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="toggle filters">
          <Filter />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase">filters</h3>
          <Button variant="ghost" size="sm" onClick={() => table.resetColumnFilters()}>
            Reset
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {table
            .getAllLeafColumns()
            .filter((column) => column.getCanFilter())
            .map((col) => (
              <ColumnFilter key={col.id} column={col} />
            ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ColumnFilter<TData extends RowData>({
  column,
}: {
  column: Column<typeof features, TData>
}) {
  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.getFacetedUniqueValues()],
  )

  return (
    <div className="flex flex-col gap-1">
      <Label className="capitalize">{column.id}</Label>
      <Select
        value={(column.getFilterValue() as string) || ALL_VALUE}
        onValueChange={(value) => column.setFilterValue(value === ALL_VALUE ? undefined : value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All</SelectItem>
          {sortedUniqueValues.slice(0, 5000).map((value) => (
            <SelectItem key={String(value)} value={String(value)}>
              {String(value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
