import { useState } from 'react'
import './taskModal.css'

const EMPTY_TASK = { title: '', description: '' }

function TaskModal({
  initialTask = EMPTY_TASK,
  heading = 'Create task',
  supportingText = 'Add the information for your new task.',
  confirmLabel = 'Confirm',
  requireChanges = false,
  onClose,
  onConfirm,
}) {
  const [task, setTask] = useState({
    id: initialTask.id ?? null,
    title: initialTask.title ?? '',
    description: initialTask.description ?? '',
    done: initialTask.done ?? false,
  })
  const hasChanges =
    task.title !== (initialTask.title ?? '') ||
    task.description !== (initialTask.description ?? '')

  const handleSubmit = (event) => {
    event.preventDefault()
    onConfirm(task)
    onClose()
  }

  return (
    <div className="task-modal__backdrop" role="presentation">
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div className="task-modal__brand" aria-hidden="true">
          <img src="/taskly-logo.png" alt="" />
        </div>

        <div className="task-modal__heading">
          <h2 id="task-modal-title">{heading}</h2>
          <p>{supportingText}</p>
        </div>

        <form className="task-modal__form" onSubmit={handleSubmit}>
          <label className="task-modal__field">
            <span>Title</span>
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={task.title}
              onChange={(event) =>
                setTask((currentTask) => ({
                  ...currentTask,
                  title: event.target.value,
                }))
              }
              autoFocus
            />
          </label>

          <label className="task-modal__field">
            <span>Description</span>
            <textarea
              name="description"
              placeholder="Write a description..."
              value={task.description}
              onChange={(event) =>
                setTask((currentTask) => ({
                  ...currentTask,
                  description: event.target.value,
                }))
              }
            />
          </label>

          <div className="task-modal__actions">
            <button
              className="task-modal__button task-modal__button--cancel"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="task-modal__button task-modal__button--confirm"
              type="submit"
              disabled={requireChanges && !hasChanges}
            >
              {confirmLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default TaskModal
