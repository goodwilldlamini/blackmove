import type { ReactTable } from '@tanstack/react-table'
import type { RowData } from '@tanstack/table-core'
import { saveAs } from 'file-saver'
import { FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'
import { Button } from '#/components/ui/button'
import type { features } from '#/lib/table-features'

export function ExportBtnExcel<TData extends RowData>({
  table,
  title,
}: {
  title: string
  table: ReactTable<typeof features, TData>
}) {
  function exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(
      table.getSortedRowModel().flatRows.map((row, index) =>
        Object.assign(
          {},
          ...table
            .getVisibleFlatColumns()
            .filter((col) => col.accessorFn !== undefined)
            .map((col) => ({ [col.id]: col.accessorFn!(row.original, index) })),
        ),
      ),
    )
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })
    saveAs(blob, `${title}_${Date.now()}.xlsx`)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="text-success"
      onClick={exportToExcel}
      aria-label="export to excel"
      title="export to excel"
    >
      <FileSpreadsheet />
    </Button>
  )
}
