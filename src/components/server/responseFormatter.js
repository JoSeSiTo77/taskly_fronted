function findFirstMessage(value) {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(findFirstMessage).find(Boolean) ?? null
  }

  if (value && typeof value === 'object') {
    if (typeof value.message === 'string') {
      return value.message
    }

    return Object.values(value).map(findFirstMessage).find(Boolean) ?? null
  }

  return null
}

export function getApiMessage(data, fallbackMessage) {
  if (
    data &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    Array.isArray(data.password) &&
    data.password.length > 0
  ) {
    return 'This password is too weak.'
  }

  return findFirstMessage(data) ?? fallbackMessage
}
