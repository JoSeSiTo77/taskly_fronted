import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiMail,
  FiShield,
  FiTrash2,
  FiUser,
} from 'react-icons/fi'
import ConfirmationModal from '../confirmationModal/confirmationModal.jsx'
import { showMessage } from '../message/messageService.js'
import { useTheme } from '../theme/useTheme.js'
import {
  deleteAllTasks,
  deleteCurrentUser,
  getCurrentUser,
  updateCurrentUser,
} from './server/conecction.js'
import './profile.css'

function Profile() {
  useTheme()
  const navigate = useNavigate()
  const [user, setUser] = useState({ first_name: '', email: '' })
  const [originalUser, setOriginalUser] = useState({ first_name: '', email: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isAccessDenied, setIsAccessDenied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [confirmationAction, setConfirmationAction] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const hasChanges =
    user.first_name !== originalUser.first_name || user.email !== originalUser.email

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    const loadUser = async () => {
      const result = await getCurrentUser(controller.signal)

      if (!isActive) {
        return
      }

      setIsLoading(false)

      if (!result.success) {
        if (result.unauthorized) {
          setIsAccessDenied(true)
          return
        }

        showMessage(result.message)
        return
      }

      const currentUser = {
        first_name: result.user.first_name ?? '',
        email: result.user.email ?? '',
      }
      setUser(currentUser)
      setOriginalUser(currentUser)
    }

    loadUser()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [])

  const handleSaveChanges = async (event) => {
    event.preventDefault()

    if (!hasChanges) {
      return
    }

    const changes = {}

    if (user.first_name !== originalUser.first_name) {
      changes.first_name = user.first_name.trim()
    }

    if (user.email !== originalUser.email) {
      changes.email = user.email.trim()
    }

    setIsSaving(true)
    const result = await updateCurrentUser(changes)
    setIsSaving(false)
    showMessage(result.message)

    if (result.success) {
      const updatedUser = {
        ...user,
        ...result.user,
      }
      setUser(updatedUser)
      setOriginalUser(updatedUser)
    }
  }

  const handleConfirmedDeletion = async () => {
    setIsDeleting(true)
    const result =
      confirmationAction === 'account'
        ? await deleteCurrentUser()
        : await deleteAllTasks()
    setIsDeleting(false)
    showMessage(result.message)

    if (!result.success) {
      setConfirmationAction(null)
      return
    }

    if (confirmationAction === 'account') {
      navigate('/register', { replace: true })
      return
    }

    navigate('/home', { replace: true })
  }

  if (isLoading) {
    return null
  }

  if (isAccessDenied) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="profile">
      <header className="profile__header">
        <Link className="profile__back" to="/home">
          <FiArrowLeft />
          Back to tasks
        </Link>

        <span className="profile__brand" aria-label="Taskly">
          <span className="profile__brand-mark">
            <img src="/taskly-logo.png" alt="" />
          </span>
          Taskly
        </span>
      </header>

      <div className="profile__container">
        <section className="profile__intro">
          <span className="profile__eyebrow">Account settings</span>
          <h1>My profile</h1>
          <p>Review your personal information and manage your account.</p>
        </section>

        <section className="profile__card" aria-labelledby="personal-info-title">
          <div className="profile__summary">
            <span className="profile__avatar" aria-hidden="true">
              <FiUser />
            </span>
            <div>
              <h2 id="personal-info-title">Personal information</h2>
              <p>Your account details and contact information.</p>
            </div>
          </div>

          <form className="profile__form" onSubmit={handleSaveChanges} noValidate>
            <label className="profile__field">
              <span>First name</span>
              <span className="profile__input-control">
                <FiUser aria-hidden="true" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="Your first name"
                  autoComplete="given-name"
                  value={user.first_name}
                  disabled={isLoading || isSaving}
                  onChange={(event) =>
                    setUser((currentUser) => ({
                      ...currentUser,
                      first_name: event.target.value,
                    }))
                  }
                />
              </span>
            </label>

            <label className="profile__field">
              <span>Email</span>
              <span className="profile__input-control">
                <FiMail aria-hidden="true" />
                <input
                  type="text"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  value={user.email}
                  disabled={isLoading || isSaving}
                  onChange={(event) =>
                    setUser((currentUser) => ({
                      ...currentUser,
                      email: event.target.value,
                    }))
                  }
                />
              </span>
            </label>

            <div className="profile__form-actions">
              <button
                className="profile__button profile__button--primary"
                type="submit"
                disabled={!hasChanges || isLoading || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </section>

        <section className="profile__danger" aria-labelledby="danger-zone-title">
          <div className="profile__danger-heading">
            <span className="profile__danger-icon" aria-hidden="true">
              <FiShield />
            </span>
            <div>
              <h2 id="danger-zone-title">Danger zone</h2>
              <p>These actions are destructive and cannot be undone.</p>
            </div>
          </div>

          <div className="profile__danger-list">
            <article className="profile__danger-item">
              <div>
                <h3>Delete all tasks</h3>
                <p>Permanently remove every task associated with your account.</p>
              </div>
              <button
                className="profile__danger-button"
                type="button"
                onClick={() => setConfirmationAction('tasks')}
              >
                <FiTrash2 />
                Delete tasks
              </button>
            </article>

            <article className="profile__danger-item">
              <div>
                <h3>Delete account</h3>
                <p>Permanently remove your account and all associated information.</p>
              </div>
              <button
                className="profile__danger-button"
                type="button"
                onClick={() => setConfirmationAction('account')}
              >
                <FiTrash2 />
                Delete account
              </button>
            </article>
          </div>
        </section>
      </div>

      {confirmationAction && (
        <ConfirmationModal
          isConfirming={isDeleting}
          onCancel={() => setConfirmationAction(null)}
          onConfirm={handleConfirmedDeletion}
        />
      )}

      <span className="profile__decoration profile__decoration--one" aria-hidden="true" />
      <span className="profile__decoration profile__decoration--two" aria-hidden="true" />
    </main>
  )
}

export default Profile
