import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Progress } from './components/Progress'

import { format } from 'date-fns'

const src = '/src/brand_new_day.mp3'

const minutesToMilliseconds = (minutes: number) => minutes * 60 * 1000
const secondsToMilliseconds = (seconds: number) => seconds * 1000

const workingTime = minutesToMilliseconds(25)
const restingTime = minutesToMilliseconds(5)

const App = () => {
  const [counter, setCounter] = useState(0)

  const [status, setStatus] = useState<TClockStatus>('stopped')
  const [playing, setPlaying] = useState(false)

  const timeString = useMemo(() => format(counter, 'mm:ss'), [counter])

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
        setCounter((oldCounter) =>
          oldCounter !== 0 ? oldCounter - 1000 : oldCounter
        )
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
    <div className="w-screen h-screen flex items-center justify-center flex-col border-2">
      <audio
        ref={audioRef}
        src={src}
        loop={true}
        autoPlay={false}
        className="hidden"
      />
      <div className="flex items-center justify-center flex-col gap-4">
        <div>
          <Progress
            time={status === 'working' ? workingTime : restingTime}
            status={status}
          >
            <p className="text-center font-black text-5xl leading-3">
              {timeString}
            </p>
          </Progress>
        </div>
        <div className="">
          {status === 'stopped' && !playing && (
            <button
              className="bg-emerald-500 text-white font-bold p-2 rounded"
              onClick={startClock}
            >
              START CLOCK
            </button>
          )}
          {status !== 'stopped' && !playing && (
            <button
              className="bg-red-500 text-white font-bold p-2 rounded"
              onClick={stopClock}
            >
              STOP CLOCK
            </button>
          )}
        </div>
        {playing && (
          <div className="flex flex-col gap-2">
            <p className="text-center font-bold">
              {status === 'working' ? 'WORK!' : 'REST!'}
            </p>
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
