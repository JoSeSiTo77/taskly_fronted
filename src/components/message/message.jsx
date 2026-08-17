import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { FiInfo, FiX } from 'react-icons/fi'
import LoadingSpinnerOverlay from '../loadingSpinnerOverlay/loadingSpinnerOverlay.jsx'
import {
  MESSAGE_EVENT,
  SESSION_EXPIRED_EVENT,
  SESSION_REFRESH_END_EVENT,
  SESSION_REFRESH_START_EVENT,
} from './messageService.js'
import './message.css'

const MESSAGE_DURATION = 4000

function Message() {
  const navigate = useNavigate()
  const messageRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const sessionMessageTimeoutRef = useRef(null)
  const pendingSessionMessageRef = useRef(null)
  const [text, setText] = useState('')
  const [isRefreshingSession, setIsRefreshingSession] = useState(false)
  const [refreshActivation, setRefreshActivation] = useState(0)

  useEffect(() => {
    const messageElement = messageRef.current

    const hideMessage = () => {
      window.clearTimeout(hideTimeoutRef.current)

      gsap.to(messageElement, {
        y: '140%',
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => setText(''),
      })
    }

    const handleMessage = (event) => {
      window.clearTimeout(hideTimeoutRef.current)
      setText(event.detail)

      gsap.killTweensOf(messageElement)
      gsap.fromTo(
        messageElement,
        { y: '140%', autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' },
      )

      hideTimeoutRef.current = window.setTimeout(hideMessage, MESSAGE_DURATION)
    }

    const handleRefreshStart = () => {
      setRefreshActivation((currentActivation) => currentActivation + 1)
      setIsRefreshingSession(true)
    }
    const handleRefreshEnd = () => setIsRefreshingSession(false)
    const handleSessionExpired = (event) => {
      pendingSessionMessageRef.current =
        event.detail || 'Session expired, login again.'
    }

    window.addEventListener(MESSAGE_EVENT, handleMessage)
    window.addEventListener(SESSION_REFRESH_START_EVENT, handleRefreshStart)
    window.addEventListener(SESSION_REFRESH_END_EVENT, handleRefreshEnd)
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)

    return () => {
      window.removeEventListener(MESSAGE_EVENT, handleMessage)
      window.removeEventListener(SESSION_REFRESH_START_EVENT, handleRefreshStart)
      window.removeEventListener(SESSION_REFRESH_END_EVENT, handleRefreshEnd)
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
      window.clearTimeout(hideTimeoutRef.current)
      window.clearTimeout(sessionMessageTimeoutRef.current)
      gsap.killTweensOf(messageElement)
    }
  }, [])

  const handleRefreshOverlayHidden = () => {
    const sessionMessage = pendingSessionMessageRef.current

    if (!sessionMessage) {
      return
    }

    pendingSessionMessageRef.current = null
    navigate('/login', { replace: true })
    window.clearTimeout(sessionMessageTimeoutRef.current)
    sessionMessageTimeoutRef.current = window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent(MESSAGE_EVENT, {
          detail: sessionMessage,
        }),
      )
    }, 100)
  }

  const message = (
    <div
      className="message"
      ref={messageRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="message__icon" aria-hidden="true">
        <FiInfo />
      </span>
      <p className="message__text">{text}</p>
      <button
        className="message__close"
        type="button"
        aria-label="Close message"
        onClick={() => {
          window.clearTimeout(hideTimeoutRef.current)
          gsap.to(messageRef.current, {
            y: '140%',
            autoAlpha: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => setText(''),
          })
        }}
      >
        <FiX />
      </button>
    </div>
  )

  return createPortal(
    <>
      {message}
      <LoadingSpinnerOverlay
        isActive={isRefreshingSession}
        activationKey={refreshActivation}
        onHidden={handleRefreshOverlayHidden}
      />
    </>,
    document.body,
  )
}

export default Message
