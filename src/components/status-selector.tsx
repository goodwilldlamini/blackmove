import {
  approvalStatus,
  concludedStatus,
  endedStatus,
  publishedStatus,
  savedStatus,
} from '#/lib/app-data'
import { tempStore } from '#/state/temp.store'

export function StatusSelector() {
  const tempAuction = tempStore((s) => s.tempAuction)
  const updateTempAuction = tempStore((s) => s.updateTempAuction)

  const userActions = [savedStatus, approvalStatus]
  const statuses = [publishedStatus, endedStatus, concludedStatus]
  const isEditing = !!tempAuction.id
  const isNew = !tempAuction.status || tempAuction.status < publishedStatus.value

  const items = isNew ? userActions : statuses

  return (
    <div className="flex w-full flex-wrap gap-2">
      {items.map((stat) => {
        const isSelected = tempAuction.status === stat.value
        const disabled = isEditing && tempAuction.status! > approvalStatus.value
        return (
          <button
            type="button"
            key={stat.id}
            disabled={!isNew || disabled}
            onClick={() => updateTempAuction({ status: stat.value })}
            className={`rounded-md border px-5 py-3 text-sm font-semibold capitalize transition-colors ${
              isSelected ? 'bg-gray-100 shadow-sm' : 'shadow-md hover:bg-gray-100'
            } ${!isNew ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            {isNew ? stat.action : stat.title}
          </button>
        )
      })}
    </div>
  )
}
