import { addDays, addHours, addMinutes } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { publishedStatus } from '#/lib/app-data'
import { tempStore } from '#/state/temp.store'
import type { AuctionDuration } from '#/types/auction'

export function DurationPicker() {
  const tempAuction = tempStore((s) => s.tempAuction)
  const updateTempAuction = tempStore((s) => s.updateTempAuction)
  const [duration, setDuration] = useState<AuctionDuration>({})
  const days = Number(duration.days) || 0
  const hours = Number(duration.hours) || 0
  const minutes = Number(duration.minutes) || 0
  const hasPicked = useRef(false)

  useEffect(() => {
    if (hasPicked.current) return
    if (tempAuction.duration) {
      setDuration(tempAuction.duration)
    } else if (tempAuction.closeDate) {
      const now = new Date()
      const secs = Math.max(
        Math.floor((tempAuction.closeDate.getTime() - now.getTime()) / 1000),
        0,
      )
      const derived = {
        days: Math.floor(secs / 86400),
        hours: Math.floor(secs / 3600) % 24,
        minutes: Math.floor(secs / 60) % 60,
      }
      setDuration(derived)
      updateTempAuction({ duration: derived })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempAuction.id])

  useEffect(() => {
    if (!hasPicked.current) return
    if (days || hours || minutes) {
      const closeDate = addMinutes(addHours(addDays(new Date(), days), hours), minutes)
      updateTempAuction({ duration: { days, hours, minutes }, closeDate })
    } else {
      updateTempAuction({ duration: undefined, closeDate: undefined })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, hours, minutes])

  function pick(update: AuctionDuration) {
    hasPicked.current = true
    setDuration((d) => ({ ...d, ...update }))
  }

  const disabled = !!tempAuction.status && tempAuction.status > publishedStatus.value

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full justify-between gap-2">
        <DurationSelect
          disabled={disabled}
          value={days}
          onChange={(v) => pick({ days: v })}
          length={7}
          title="day"
        />
        <DurationSelect
          disabled={disabled}
          value={hours}
          onChange={(v) => pick({ hours: v })}
          length={23}
          title="hour"
        />
        <DurationSelect
          disabled={disabled}
          value={minutes}
          onChange={(v) => pick({ minutes: v })}
          length={59}
          title="minute"
        />
      </div>
      <p className="text-xs text-gray-400">
        This is how long your listing will run after it is approved
      </p>
    </div>
  )
}

function DurationSelect({
  title,
  length,
  onChange,
  value,
  disabled,
}: {
  title: string
  length: number
  onChange: (val: number) => void
  value?: number
  disabled?: boolean
}) {
  return (
    <Select
      disabled={disabled}
      value={value ? String(value) : ''}
      onValueChange={(v) => onChange(Number(v))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`0 ${title}s`} />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length }, (_, index) => (
          <SelectItem key={index} value={String(index + 1)}>
            {index + 1} {title}
            {index === 0 ? '' : 's'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
