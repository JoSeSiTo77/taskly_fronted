export const MESSAGE_EVENT = 'taskly:show-message'
export const SESSION_REFRESH_START_EVENT = 'taskly:session-refresh-start'
export const SESSION_REFRESH_END_EVENT = 'taskly:session-refresh-end'
export const SESSION_EXPIRED_EVENT = 'taskly:session-expired'

export function showMessage(text) {
  if (typeof window === 'undefined' || !text) {
    return
  }

  window.dispatchEvent(
    new CustomEvent(MESSAGE_EVENT, {
      detail: String(text),
    }),
  )
}

export function startSessionRefresh() {
  window.dispatchEvent(new CustomEvent(SESSION_REFRESH_START_EVENT))
}

export function endSessionRefresh() {
  window.dispatchEvent(new CustomEvent(SESSION_REFRESH_END_EVENT))
}

export function expireSession(message) {
  window.dispatchEvent(
    new CustomEvent(SESSION_EXPIRED_EVENT, {
      detail: message,
    }),
  )
}
