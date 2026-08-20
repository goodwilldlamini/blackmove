import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type ColumnVisibilityState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { EmptyWidget } from '#/components/empty'
import { features } from '#/lib/table-features'
import { ColumnsToggle } from './columns-toggle'
import { DebouncedInput } from './debounced-input'
import { ExportBtnExcel } from './export-csv'
import { PaginationBtns } from './pagination'
import { TableFilters } from './table-filters'

export function DataTable<TData extends RowData>({
  title,
  data,
  columns: baseColumns,
  isSelectible,
}: {
  title: string
  data: TData[]
  columns: ColumnDef<typeof features, TData>[]
  isSelectible?: boolean
}) {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const columns: ColumnDef<typeof features, TData>[] = isSelectible
    ? [
        {
          id: 'select',
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllRowsSelected() ||
                (table.getIsSomeRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected() || (row.getIsSomeSelected() && 'indeterminate')}
              onCheckedChange={(v) => row.toggleSelected(!!v)}
            />
          ),
        },
        ...baseColumns,
      ]
    : baseColumns

  const table = useTable({
    features,
    data,
    columns,
    state: {
      pagination,
      columnVisibility,
      rowSelection,
      sorting,
      globalFilter,
      columnFilters,
    },
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy',
  })

  return (
    <div className="flex w-full flex-col rounded-xl bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <h2 className="text-base font-semibold uppercase sm:text-lg">{title}</h2>
        <DebouncedInput
          value={globalFilter}
          onChange={(value) => setGlobalFilter(String(value))}
        />
        <div className="flex items-center gap-2">
          <ExportBtnExcel title={title} table={table} />
          <TableFilters table={table} />
          <ColumnsToggle table={table} />
        </div>
      </div>
      <hr className="border-border" />
      <div className="w-full overflow-x-auto">
        {data.length > 0 && (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={header.column.getCanSort() ? 'cursor-pointer select-none' : undefined}
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                      {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ?? null}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-gray-600">
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {data.length < 1 && <EmptyWidget text="No records to display" />}
      </div>
      <PaginationBtns table={table} />
    </div>
  )
}
