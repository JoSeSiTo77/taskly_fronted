import {
  API_ENDPOINTS,
  apiClient,
  getApiErrorMessage,
  getApiMessage,
} from '../../server/apiClient.js'

export async function logoutUser() {
  try {
    const response = await apiClient.post(API_ENDPOINTS.logout)

    return {
      success: true,
      message: getApiMessage(response.data, 'Session closed successfully.'),
    }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error),
    }
  }
}
