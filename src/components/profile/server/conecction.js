import { validateEmail } from '../../../../jose-contrib/validators.js'
import {
  API_ENDPOINTS,
  apiClient,
  getApiErrorMessage,
  getApiMessage,
} from '../../server/apiClient.js'
import { getCurrentSession } from '../../server/session.js'

export async function getCurrentUser(signal) {
  return getCurrentSession({ signal })
}

export async function updateCurrentUser(changes) {
  try {
    if (Object.hasOwn(changes, 'email')) {
      validateEmail(changes.email)
    }

    const response = await apiClient.patch(API_ENDPOINTS.userMe, changes)

    return {
      success: true,
      message: getApiMessage(response.data, 'Profile updated successfully.'),
      user: response.data.user ?? changes,
    }
  } catch (error) {
    if (error instanceof Error && !error.response) {
      return {
        success: false,
        message: error.message,
        user: null,
      }
    }

    return {
      success: false,
      message: getApiErrorMessage(error),
      user: null,
    }
  }
}

export async function deleteCurrentUser() {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.userMe)

    return {
      success: true,
      message: getApiMessage(response.data, 'Account deleted successfully.'),
    }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error),
    }
  }
}

export async function deleteAllTasks() {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.tasksOwn)

    return {
      success: true,
      message: getApiMessage(response.data, 'Tasks deleted successfully.'),
    }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error),
    }
  }
}
