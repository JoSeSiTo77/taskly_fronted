import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi'
import { showMessage } from '../message/messageService.js'
import { getCurrentSession } from '../server/session.js'
import { loginUser } from './server/conection.js'
import './login.css'

function Login() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const passwordIconRef = useRef(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    const checkSession = async () => {
      const result = await getCurrentSession({
        signal: controller.signal,
        silent: true,
      })

      if (!isActive) {
        return
      }

      setIsAuthenticated(result.success)
      setIsCheckingSession(false)
    }

    checkSession()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [])

  useLayoutEffect(() => {
    if (isCheckingSession || isAuthenticated) {
      return undefined
    }

    const context = gsap.context(() => {
      gsap.from('.login__visual-content > *', {
        opacity: 0,
        x: -24,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power2.out',
      })

      gsap.from('.login__form-panel > *', {
        opacity: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.12,
      })
    }, pageRef)

    return () => context.revert()
  }, [isAuthenticated, isCheckingSession])

  const togglePassword = () => {
    setShowPassword((currentValue) => !currentValue)
    gsap.fromTo(
      passwordIconRef.current,
      { rotate: -18, scale: 0.75 },
      { rotate: 0, scale: 1, duration: 0.25, ease: 'back.out(2)' },
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    setIsSubmitting(true)

    const result = await loginUser({
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    })

    setIsSubmitting(false)
    showMessage(result.message)

    if (result.success) {
      navigate('/home', {
        state: {
          firstName: result.user.firstName,
        },
      })
    }
  }

  if (isCheckingSession) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return (
    <main className="login" ref={pageRef}>
      <section className="login__visual" aria-label="Application presentation">
        <div className="login__visual-content">
          <Link className="login__brand" to="/login" aria-label="Taskly, home">
            <span className="login__brand-mark">
              <img src="/taskly-logo.png" alt="" />
            </span>
            Taskly
          </Link>

          <div className="login__message">
            <span className="login__eyebrow">Organize. Focus. Move forward.</span>
            <h1>
              No excuses
            </h1>
            <h1>
              Keep going
            </h1>
            <p>
              The temporary pain of discipline weighs grams;
              the regret of failure weighs tons.
            </p>
          </div>

          <div className="login__preview" aria-hidden="true">
            <div className="login__preview-header">
              <span>Today</span>
              <span>3 tasks</span>
            </div>
            <div className="login__preview-task login__preview-task--done">
              <img className="login__preview-check" src="/taskly-logo.png" alt="" />
              <span>Review pending tasks</span>
            </div>
            <div className="login__preview-task">
              <span className="login__preview-circle" />
              <span>Prepare presentation</span>
            </div>
            <div className="login__preview-task">
              <span className="login__preview-circle" />
              <span>Plan the week</span>
            </div>
          </div>
        </div>
      </section>

      <section className="login__form-wrapper">
        <div className="login__form-panel">
          <span className="login__mobile-brand">
            <span className="login__brand-mark">
              <img src="/taskly-logo.png" alt="" />
            </span>
            Taskly
          </span>

          <div className="login__heading">
            <span className="login__eyebrow">Welcome back</span>
            <h2>Sign in</h2>
            <p>Enter your details to continue with your tasks.</p>
          </div>

          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <label className="login__field">
              <span>Email</span>
              <input
                type="text"
                name="email"
                placeholder="name@example.com"
                autoComplete="email"
              />
            </label>

            <label className="login__field">
              <span>Password</span>
              <span className="login__password-control">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login__password-toggle"
                  onClick={togglePassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  <span ref={passwordIconRef}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </button>
              </span>
            </label>

            <button
              className="login__submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
              <FiArrowRight />
            </button>
          </form>

          <p className="login__switch">
            Don't have an account yet? <Link to="/register">Register</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
