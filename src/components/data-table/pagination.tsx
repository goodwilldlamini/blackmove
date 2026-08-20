import type { ReactTable } from '@tanstack/react-table'
import type { RowData } from '@tanstack/table-core'
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { features } from '#/lib/table-features'

export function PaginationBtns<TData extends RowData>({
  table,
}: {
  table: ReactTable<typeof features, TData>
}) {
  return (
    <div className="flex w-full items-center gap-4 p-4">
      <span className="text-xs text-muted-foreground sm:text-sm">
        Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
      </span>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-xs text-muted-foreground sm:inline sm:text-sm">
          Items per page
        </span>
        <Select
          value={String(table.state.pagination.pageSize)}
          onValueChange={(v) => table.setPageSize(Number(v))}
        >
          <SelectTrigger className="w-fit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 25, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            aria-label="first page"
          >
            <ChevronFirst />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            aria-label="prev page"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            aria-label="next page"
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            aria-label="last page"
          >
            <ChevronLast />
          </Button>
        </div>
      </div>
    </div>
  )
}
