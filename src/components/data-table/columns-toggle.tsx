import type { ReactTable } from '@tanstack/react-table'
import type { RowData } from '@tanstack/table-core'
import { Columns3 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import type { features } from '#/lib/table-features'

export function ColumnsToggle<TData extends RowData>({
  table,
}: {
  table: ReactTable<typeof features, TData>
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="toggle columns">
          <Columns3 />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <h3 className="mb-2 text-sm font-semibold uppercase">Column visibility</h3>
        <div className="grid grid-cols-2 gap-2">
          {table.getAllLeafColumns().map((col) => (
            <label key={col.id} className="flex items-center gap-2 text-sm capitalize">
              <Checkbox
                checked={col.getIsVisible()}
                onCheckedChange={(checked) => col.toggleVisibility(!!checked)}
              />
              {col.id}
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
