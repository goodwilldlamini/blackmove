import { useEffect, useState } from 'react'

type TimerValue = {
  days: string
  hours: string
  mins: string
  secs: string
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function computeRemaining(date?: Date): TimerValue {
  const secsLeft = date ? Math.floor((date.getTime() - Date.now()) / 1000) : 0
  const clamped = Math.max(secsLeft, 0)
  return {
    days: pad(Math.floor(clamped / 86400)),
    hours: pad(Math.floor(clamped / 3600) % 24),
    mins: pad(Math.floor(clamped / 60) % 60),
    secs: pad(clamped % 60),
  }
}

export function EdTimer({
  date,
  className,
}: {
  date?: Date
  className?: string
}) {
  const [timeRemaining, setTime] = useState<TimerValue>(() =>
    computeRemaining(date),
  )

  useEffect(() => {
    setTime(computeRemaining(date))
    if (!date || date.getTime() <= Date.now()) return

    const timer = setInterval(() => {
      setTime(computeRemaining(date))
    }, 1000)
    return () => clearInterval(timer)
  }, [date])

  return (
    <TimerText className={className}>
      {timeRemaining.days}:{timeRemaining.hours}:{timeRemaining.mins}:
      {timeRemaining.secs}
    </TimerText>
  )
}

export function TimerText({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`text-xs font-semibold text-muted-foreground uppercase sm:text-sm ${className || ''}`}
    >
      {children}
    </span>
  )
}
