import { FiTrash2 } from 'react-icons/fi'

function TaskCard({ task, isDone, onOpen, onDelete, onToggle }) {
  return (
    <article
      className={`home__task${isDone ? ' home__task--done' : ''}`}
      role="button"
      tabIndex="0"
      onClick={() => onOpen(task.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(task.id)
        }
      }}
    >
      <label
        className="home__task-check"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isDone}
          aria-label={isDone ? `Mark ${task.title} as pending` : `Mark ${task.title} as done`}
          onChange={() => onToggle(task)}
        />
        <span aria-hidden="true" />
      </label>

      <h2 className="home__task-title">{task.title}</h2>

      <div
        className="home__task-actions"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="home__task-action home__task-action--delete"
          type="button"
          aria-label={`Delete ${task.title}`}
          title="Delete"
          onClick={() => onDelete(task.id)}
        >
          <FiTrash2 />
        </button>
      </div>
    </article>
  )
}

export default TaskCard
