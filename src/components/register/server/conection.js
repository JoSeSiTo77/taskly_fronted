import {
  validateEmail,
  validatePassword,
} from '../../../../jose-contrib/validators.js'
import {
  API_ENDPOINTS,
  apiClient,
  getApiErrorMessage,
  getApiMessage,
} from '../../server/apiClient.js'

export function prepareRegisterData({ email, firstName, password }) {
  const data = {
    email: email.trim(),
    firstName: firstName.trim(),
    password,
  }

  try {
    validateEmail(data.email)
    validatePassword(data.password, 8, {}, data.email, data.firstName)

    return {
      data,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function registerUser(formValues) {
  const validation = prepareRegisterData(formValues)

  if (validation.error) {
    return {
      success: false,
      message: validation.error,
      user: null,
    }
  }

  const payload = {
    email: validation.data.email,
    first_name: validation.data.firstName,
    password: validation.data.password,
  }

  try {
    const response = await apiClient.post(API_ENDPOINTS.register, payload)

    return {
      success: true,
      message: getApiMessage(response.data, 'User created successfully.'),
      user: {
        firstName: response.data?.user?.first_name ?? payload.first_name,
        email: response.data?.user?.email ?? payload.email,
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
