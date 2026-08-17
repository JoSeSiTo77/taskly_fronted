import axios from 'axios'
import {
  endSessionRefresh,
  expireSession,
  startSessionRefresh,
} from '../message/messageService.js'
import { getApiMessage } from './responseFormatter.js'

export { getApiMessage } from './responseFormatter.js'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const API_ENDPOINTS = {
  register: import.meta.env.VITE_API_REGISTER_ENDPOINT,
  login: import.meta.env.VITE_API_LOGIN_ENDPOINT,
  logout: import.meta.env.VITE_API_LOGOUT_ENDPOINT,
  tasksList: import.meta.env.VITE_API_TASKS_LIST_ENDPOINT,
  taskDetail: import.meta.env.VITE_API_TASK_DETAIL_ENDPOINT,
  userMe: import.meta.env.VITE_API_USER_ME_ENDPOINT,
  tasksOwn: import.meta.env.VITE_API_TASKS_OWN_ENDPOINT,
  refresh: import.meta.env.VITE_API_REFRESH_ENDPOINT,
}

let refreshRequest = null

function isPublicAuthenticationRequest(url = '') {
  return [API_ENDPOINTS.register, API_ENDPOINTS.login].some(
    (endpoint) => url === endpoint || url.endsWith(endpoint),
  )
}

function isExpiredAccessToken(error) {
  return (
    error.response?.status === 401 &&
    error.response?.data?.code === 'token_not_valid'
  )
}

async function refreshSession({ silent = false } = {}) {
  if (!silent) {
    startSessionRefresh()
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}${API_ENDPOINTS.refresh}`,
      {},
      { withCredentials: true },
    )

    if (!silent) {
      endSessionRefresh()
    }

    return response
  } catch (error) {
    if (!silent) {
      endSessionRefresh()
      expireSession(
        getApiMessage(error.response?.data, 'Session expired. Please log in again.'),
      )
    }

    throw error
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      !originalRequest ||
      isPublicAuthenticationRequest(originalRequest.url) ||
      !isExpiredAccessToken(error)
    ) {
      return Promise.reject(error)
    }

    if (originalRequest._sessionRetry) {
      if (!originalRequest._silentSessionCheck) {
        expireSession(
          getApiMessage(error.response?.data, 'Session expired. Please log in again.'),
        )
      }

      return Promise.reject(error)
    }

    originalRequest._sessionRetry = true

    if (!refreshRequest) {
      refreshRequest = refreshSession({
        silent: originalRequest._silentSessionCheck,
      }).finally(() => {
        refreshRequest = null
      })
    }

    try {
      await refreshRequest
      return apiClient(originalRequest)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  },
)

export function getApiErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return getApiMessage(error.response.data, 'The request could not be completed.')
    }

    if (error.request) {
      return 'Unable to connect to the server.'
    }
  }

  return 'An unexpected error occurred.'
}
