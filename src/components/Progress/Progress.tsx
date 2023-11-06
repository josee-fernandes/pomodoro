import { PropsWithChildren, useMemo } from 'react'

interface IProgress extends PropsWithChildren {
  time: number
  status: TClockStatus
}

const Progress: React.FC<IProgress> = ({ children, time, status }) => {
  const color = useMemo(
    () =>
      status === 'stopped'
        ? '#ffffff'
        : status === 'working'
        ? 'rgb(245, 158, 11)'
        : 'rgb(16, 185, 129)',
    [status]
  )

  return (
    <div className="relative border-purple-500">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
      <svg
        className="progress"
        height="180"
        width="180"
        style={{
          animationDuration: `${time}ms`,
          animationPlayState: status === 'stopped' ? 'paused' : 'running',
          animationName: status === 'working' ? 'working' : 'resting',
          strokeDashoffset: status === 'working' ? 0 : 533.8,
        }}
      >
        <circle
          cx="90"
          cy="90"
          r="85"
          stroke={color}
          stroke-width="10"
          fill="none"
        />
      </svg>
    </div>
  )
}

Progress.displayName = 'Progress'

export default Progress
