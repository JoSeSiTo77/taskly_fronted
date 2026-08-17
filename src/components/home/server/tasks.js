import {
  API_ENDPOINTS,
  apiClient,
  getApiErrorMessage,
  getApiMessage,
} from '../../server/apiClient.js'

export async function getTasks(signal) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.tasksList, { signal })
    const tasks = Array.isArray(response.data) ? response.data : []

    return {
      success: true,
      tasks,
      message: null,
    }
  } catch (error) {
    return {
      success: false,
      tasks: [],
      message: getApiErrorMessage(error),
      unauthorized: error.response?.status === 401,
    }
  }
}

export async function createTask({ title, description }) {
  try {
    const response = await apiClient.post(API_ENDPOINTS.tasksList, {
      title,
      description,
    })
    const responseTask = response.data?.task ?? response.data
    const task =
      responseTask && typeof responseTask === 'object' && responseTask.id
        ? responseTask
        : null

    return {
      success: true,
      task,
      message:
        typeof response.data?.message === 'string'
          ? response.data.message
          : 'Task created successfully.',
    }
  } catch (error) {
    return {
      success: false,
      task: null,
      message: getApiErrorMessage(error),
    }
  }
}

export async function getTaskById(taskId) {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.taskDetail}${encodeURIComponent(taskId)}/`,
    )

    return {
      success: true,
      task: response.data,
      message: null,
    }
  } catch (error) {
    return {
      success: false,
      task: null,
      message: getApiErrorMessage(error),
    }
  }
}

export async function updateTask(taskId, { title, description, done }) {
  try {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.taskDetail}${encodeURIComponent(taskId)}/`,
      {
        title,
        description,
      },
    )
    const responseTask = response.data?.task ?? response.data
    const task = {
      id: responseTask?.id ?? taskId,
      title: responseTask?.title ?? title,
      description: responseTask?.description ?? description,
      done: responseTask?.done ?? done,
    }

    return {
      success: true,
      task,
      message: 'Task updated successfully.',
    }
  } catch (error) {
    return {
      success: false,
      task: null,
      message: getApiErrorMessage(error),
    }
  }
}

export async function setTaskDone(taskId, done) {
  try {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.taskDetail}${encodeURIComponent(taskId)}/`,
      { done },
    )
    const responseTask = response.data?.task ?? response.data

    return {
      success: true,
      task: {
        ...responseTask,
        id: responseTask?.id ?? taskId,
        done: responseTask?.done ?? done,
      },
      message:
        typeof response.data?.message === 'string'
          ? response.data.message
          : done
            ? 'Task marked as done.'
            : 'Task marked as pending.',
    }
  } catch (error) {
    return {
      success: false,
      task: null,
      message: getApiErrorMessage(error),
    }
  }
}

export async function deleteTask(taskId) {
  try {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.taskDetail}${encodeURIComponent(taskId)}/`,
    )

    return {
      success: true,
      message: getApiMessage(response.data, 'Task deleted successfully.'),
    }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error),
    }
  }
}
