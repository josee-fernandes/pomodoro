import { useMemo, useState, useEffect, useCallback, useRef } from 'react'

const src = '/src/brand_new_day.mp3'

const minutesToMilliseconds = (minutes: number) => minutes * 60 * 1000
const secondsToMilliseconds = (seconds: number) => seconds * 1000

const workingTime = minutesToMilliseconds(0.5)
const restingTime = minutesToMilliseconds(0.25)

const App = () => {
  const [counter, setCounter] = useState(0)

  const [status, setStatus] = useState<TClockStatus>('stopped')
  const [playing, setPlaying] = useState(false)

  const max = useMemo(
    () =>
      status === 'stopped'
        ? 0
        : status === 'working'
        ? workingTime
        : restingTime,
    [status]
  )

  const audioRef = useRef<HTMLAudioElement>(null)

  const startClock = useCallback(() => {
    setCounter(workingTime)
    setStatus('working')
  }, [setStatus])

  const playAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
      setPlaying(true)
    }
  }, [audioRef])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaying(false)
    }
  }, [audioRef])

  const updateStatus = useCallback(() => {
    switch (status) {
      case 'stopped':
        setCounter(0)
        break
      case 'working':
        setCounter(restingTime)
        setStatus('resting')
        playAudio()
        break
      case 'resting':
        setCounter(workingTime)
        setStatus('working')
        playAudio()
        break
      default:
        setCounter(0)
    }
  }, [status, setStatus, playAudio])

  const countdown = useCallback(() => {
    const timeout = setTimeout(() => {
      if (counter > 0) {
        setCounter((oldCounter) => oldCounter - 1000)
      } else if (status !== 'stopped') {
        updateStatus()
      }

      clearTimeout(timeout)
    }, secondsToMilliseconds(1))
  }, [counter, setCounter, status, updateStatus])

  const stopClock = useCallback(() => {
    setCounter(0)
    setStatus('stopped')
    stopAudio()
  }, [stopAudio])

  useEffect(() => {
    if (status !== 'stopped') countdown()
  }, [status, countdown])

  return (
    <div>
      <div>status: {status}</div>

      <div className="max-w-sm">
        <audio
          ref={audioRef}
          src={src}
          loop={true}
          autoPlay={false}
          className="hidden"
        />
        <div className="flex gap-4">
          <input
            type="range"
            min={0}
            max={max}
            value={counter}
            className="w-full"
            readOnly
          />
        </div>
        <div className="flex gap-4">
          {status === 'stopped' && (
            <button onClick={startClock}>▶️ START CLOCK</button>
          )}
          {status !== 'stopped' && (
            <button onClick={stopClock}>⏹️ STOP CLOCK</button>
          )}
        </div>
        <p>workingTime: {workingTime}</p>
        <p>restingTime: {restingTime}</p>
        <p>counter: {counter}</p>
        {playing && (
          <div>
            <p>Status changed ...</p>
            <button className="bg-gray-200 p-2 rounded" onClick={stopAudio}>
              ⛔ STOP AUDIO
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
