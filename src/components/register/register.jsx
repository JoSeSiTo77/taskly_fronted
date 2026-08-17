import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi'
import { showMessage } from '../message/messageService.js'
import { getCurrentSession } from '../server/session.js'
import { registerUser } from './server/conection.js'
import './register.css'

function Register() {
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
      gsap.from('.register__visual-content > *', {
        opacity: 0,
        x: 24,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power2.out',
      })

      gsap.from('.register__form-panel > *', {
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
      { rotate: 18, scale: 0.75 },
      { rotate: 0, scale: 1, duration: 0.25, ease: 'back.out(2)' },
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    setIsSubmitting(true)

    const result = await registerUser({
      email: String(formData.get('email') ?? ''),
      firstName: String(formData.get('firstName') ?? ''),
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
    <main className="register" ref={pageRef}>
      <section className="register__form-wrapper">
        <div className="register__form-panel">
          <Link className="register__brand" to="/login" aria-label="Taskly, home">
            <span className="register__brand-mark">
              <img src="/taskly-logo.png" alt="" />
            </span>
            Taskly
          </Link>

          <div className="register__heading">
            <span className="register__eyebrow">Start today</span>
            <h1>Create your account</h1>
            <p>A few details and you'll have everything ready to organize your day.</p>
          </div>

          <form className="register__form" onSubmit={handleSubmit}>
            <label className="register__field">
              <span>Email</span>
              <input
                type="text"
                name="email"
                placeholder="name@example.com"
                autoComplete="email"
              />
            </label>

            <label className="register__field">
              <span>First Name</span>
              <input
                type="text"
                name="firstName"
                placeholder="Your name"
                autoComplete="given-name"
              />
            </label>

            <label className="register__field">
              <span>Password</span>
              <span className="register__password-control">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="register__password-toggle"
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
              className="register__submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
              <FiArrowRight />
            </button>
          </form>

          <p className="register__switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>

      <section className="register__visual" aria-label="Application presentation">
        <div className="register__visual-content">
          <span className="register__visual-brand">Taskly</span>

          <div className="register__message">
            <span className="register__eyebrow">Less noise, more progress</span>
            <h2>Turn your plans into small daily achievements.</h2>
            <p>
              A place to focus only on
              what matters.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Register
