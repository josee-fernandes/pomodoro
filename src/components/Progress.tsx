import { PropsWithChildren } from 'react'

interface IProgress extends PropsWithChildren {
  time: number
  status: TClockStatus
}

export const Progress: React.FC<IProgress> = ({ children, time, status }) => {
  return (
    <div className="relative border-purple-500">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
      <svg
        className="progress"
        height="150"
        width="150"
        style={{
          animationDuration: `${time}ms`,
          animationPlayState: status === 'stopped' ? 'paused' : 'running',
          animationName: status === 'working' ? 'working' : 'resting',
          strokeDashoffset: status === 'working' ? 0 : 439.6,
        }}
      >
        <circle
          cx="75"
          cy="75"
          r="70"
          stroke="rgb(168, 85, 247)"
          stroke-width="10"
          fill="none"
        />
      </svg>
    </div>
  )
}
