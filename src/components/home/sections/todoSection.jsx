import TaskCard from './taskCard.jsx'

function TodoSection({ tasks, transitions, onOpen, onDelete, onToggle }) {
  return (
    <section className="home__task-section" aria-label="Tasks to do">
      {tasks.length === 0 && <p className="home__tasks-status">No content</p>}

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isDone={transitions[task.id]?.done ?? false}
          onOpen={onOpen}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </section>
  )
}

export default TodoSection
