import {
  API_ENDPOINTS,
  apiClient,
  getApiErrorMessage,
} from './apiClient.js'

export async function getCurrentSession({ signal, silent = false } = {}) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.userMe, {
      signal,
      _silentSessionCheck: silent,
    })

    return {
      success: true,
      message: null,
      user: {
        email: response.data.email,
        first_name: response.data.first_name,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error),
      user: null,
      unauthorized: error.response?.status === 401,
    }
  }
}
