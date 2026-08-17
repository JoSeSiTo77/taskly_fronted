import {
  API_ENDPOINTS,
  apiClient,
  getApiErrorMessage,
  getApiMessage,
} from '../../server/apiClient.js'

export async function loginUser({ email, password }) {
  const payload = {
    email: email.trim(),
    password,
  }

  try {
    const response = await apiClient.post(API_ENDPOINTS.login, payload)

    return {
      success: true,
      message: getApiMessage(response.data, 'Successful login'),
      user: {
        firstName: response.data.user.first_name,
        email: response.data.user.email,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error),
      user: null,
    }
  }
}
