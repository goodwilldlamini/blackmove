import type { ColumnDef, RowData } from '@tanstack/react-table'
import type { features } from '#/lib/table-features'

export interface TableModel<T extends RowData> {
  title: string
  data: T[]
  isSelectible?: boolean
  columns: ColumnDef<typeof features, T>[]
}
