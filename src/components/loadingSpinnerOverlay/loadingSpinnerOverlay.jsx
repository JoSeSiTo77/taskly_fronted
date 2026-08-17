import { useEffect, useRef, useState } from 'react'
import './loadingSpinnerOverlay.css'

const LOADING_MESSAGES = [
  "It's not you, it's me... 😢",
  'Searching for the meaning of life... please wait.',
  '🕵️ Deleting your browsing history... just kidding.',
  '☕ Waking up the programmers with caffeine.',
  '🧠 Thinking of a believable excuse for this delay.',
  "📶 Checking whether the neighbors' Wi-Fi works better.",
  '🪐 Aligning the planets to process your request.',
  '👾 Recruiting additional pixels.',
  '🕶️ Loading the Matrix, one moment.',
  "🐕 The dog ate the code; we're rewriting it.",
  "🌀 Generating an artificial delay to make it look like we're working hard.",
]

function LoadingSpinnerOverlay({
  isActive,
  activationKey = 0,
  minimumDuration = 1500,
  onHidden,
}) {
  const activationTimeRef = useRef(0)
  const observedActivationRef = useRef(0)
  const showTimeoutRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const onHiddenRef = useRef(onHidden)
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    onHiddenRef.current = onHidden
  }, [onHidden])

  useEffect(() => {
    window.clearTimeout(hideTimeoutRef.current)

    if (activationKey !== observedActivationRef.current) {
      observedActivationRef.current = activationKey
      activationTimeRef.current = Date.now()
      window.clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = window.setTimeout(() => {
        setMessage(
          LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)],
        )
        setIsVisible(true)
      }, 0)
    }

    if (isActive || !activationTimeRef.current) {
      return () => window.clearTimeout(hideTimeoutRef.current)
    }

    const elapsedTime = Date.now() - activationTimeRef.current
    const remainingTime = Math.max(0, minimumDuration - elapsedTime)

    hideTimeoutRef.current = window.setTimeout(() => {
      activationTimeRef.current = 0
      setIsVisible(false)
      onHiddenRef.current?.()
    }, remainingTime)

    return () => window.clearTimeout(hideTimeoutRef.current)
  }, [activationKey, isActive, minimumDuration])

  useEffect(
    () => () => {
      window.clearTimeout(showTimeoutRef.current)
      window.clearTimeout(hideTimeoutRef.current)
    },
    [],
  )

  if (!isVisible) {
    return null
  }

  return (
    <div
      className="loading-spinner-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-spinner-overlay__content">
        <span className="loading-spinner-overlay__spinner" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinnerOverlay
