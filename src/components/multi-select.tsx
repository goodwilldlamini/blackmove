import { useState } from 'react'
import { Checkbox } from '#/components/ui/checkbox'
import { Label } from '#/components/ui/label'
import { toast } from '#/lib/toast'

export function MultiSelect({
  options,
  label,
  onChange,
  value,
  max,
}: {
  label: string
  options: { value: string; label: string }[]
  onChange: (arr: string[]) => void
  value?: string[]
  max?: number
}) {
  const [selected, setSelected] = useState<string[]>(value || [])
  const [expanded, setExpanded] = useState(false)
  const limit = 6

  function onCheckboxChange(checked: boolean, item: { value: string }) {
    if (checked && max && selected.length >= max) {
      toast.error(`You can select a maximum of ${max} items`)
      return
    }
    const newList = checked
      ? [...selected, item.value]
      : selected.filter((el) => el !== item.value)
    setSelected(newList)
    onChange(newList)
  }

  const sortedOptions = [...options].sort((a, b) => a.label.localeCompare(b.label))
  const displayedOptions =
    sortedOptions.length > limit
      ? expanded
        ? sortedOptions
        : sortedOptions.slice(0, limit)
      : sortedOptions

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <Label>{label}:</Label>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {displayedOptions.map((item) => (
          <label key={item.value} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={selected.includes(item.value)}
              onCheckedChange={(checked) => onCheckboxChange(!!checked, item)}
            />
            {item.label}
          </label>
        ))}
        {options.length > limit && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-info underline"
          >
            Show {expanded ? 'less' : 'more'}
          </button>
        )}
      </div>
    </div>
  )
}
