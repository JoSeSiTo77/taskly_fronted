import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import {
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPlus,
  FiSun,
  FiUser,
} from 'react-icons/fi'
import { showMessage } from '../message/messageService.js'
import TaskModal from '../taskModal/taskModal.jsx'
import { useTheme } from '../theme/useTheme.js'
import DoneSection from './sections/doneSection.jsx'
import TodoSection from './sections/todoSection.jsx'
import { logoutUser } from './server/logout.js'
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  setTaskDone,
  updateTask,
} from './server/tasks.js'
import './home.css'

function Home() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const menuRef = useRef(null)
  const themeIconRef = useRef(null)
  const transitionTimersRef = useRef(new Map())
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [tasks, setTasks] = useState([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [isAccessDenied, setIsAccessDenied] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [activeView, setActiveView] = useState('todo')
  const [taskTransitions, setTaskTransitions] = useState({})

  const todoTasks = tasks.filter((task) => task.done === false)
  const doneTasks = tasks.filter((task) => task.done === true)
  const visibleTasks = activeView === 'todo' ? todoTasks : doneTasks

  useEffect(() => {
    const closeMenu = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    const closeMenuWithKeyboard = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeMenuWithKeyboard)

    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeMenuWithKeyboard)
    }
  }, [])

  useEffect(() => {
    const transitionTimers = transitionTimersRef.current

    return () => {
      transitionTimers.forEach((timerId) => window.clearTimeout(timerId))
      transitionTimers.clear()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    const loadTasks = async () => {
      const result = await getTasks(controller.signal)

      if (!isActive) {
        return
      }

      setIsLoadingTasks(false)

      if (result.success) {
        setTasks(result.tasks)
        return
      }

      if (result.unauthorized) {
        setIsAccessDenied(true)
        return
      }

      showMessage(result.message)
    }

    loadTasks()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const result = await logoutUser()
    setIsLoggingOut(false)
    showMessage(result.message)

    if (result.success) {
      navigate('/login', { replace: true })
    }
  }

  const handleThemeToggle = () => {
    toggleTheme()
    gsap.fromTo(
      themeIconRef.current,
      { rotate: -110, scale: 0.55, opacity: 0.35 },
      { rotate: 0, scale: 1, opacity: 1, duration: 0.42, ease: 'back.out(2)' },
    )
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleCreateTask = async (taskData) => {
    const result = await createTask(taskData)
    showMessage(result.message)

    if (!result.success) {
      return
    }

    if (result.task) {
      setTasks((currentTasks) => [...currentTasks, result.task])
    }
  }

  const handleOpenTask = async (taskId) => {
    const result = await getTaskById(taskId)

    if (!result.success) {
      showMessage(result.message)
      return
    }

    setSelectedTask(result.task)
  }

  const handleUpdateTask = async (taskData) => {
    const taskId = taskData.id

    if (!taskId) {
      showMessage('Unable to identify the task.')
      return
    }

    const result = await updateTask(taskId, {
      title: taskData.title,
      description: taskData.description,
      done: taskData.done,
    })
    showMessage(result.message)

    if (result.success) {
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? result.task : task)),
      )
    }
  }

  const handleDeleteTask = async (taskId) => {
    const result = await deleteTask(taskId)
    showMessage(result.message)

    if (result.success) {
      const transitionTimer = transitionTimersRef.current.get(taskId)

      if (transitionTimer) {
        window.clearTimeout(transitionTimer)
        transitionTimersRef.current.delete(taskId)
      }

      setTaskTransitions((currentTransitions) => {
        const nextTransitions = { ...currentTransitions }
        delete nextTransitions[taskId]
        return nextTransitions
      })
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      )
    }
  }

  const handleToggleTask = async (task) => {
    const currentTransition = taskTransitions[task.id]
    const currentDone = currentTransition?.done ?? task.done
    const nextDone = !currentDone
    const result = await setTaskDone(task.id, nextDone)
    showMessage(result.message)

    if (!result.success) {
      return
    }

    const previousTimer = transitionTimersRef.current.get(task.id)

    if (previousTimer) {
      window.clearTimeout(previousTimer)
    }

    if (nextDone === task.done) {
      transitionTimersRef.current.delete(task.id)
      setTaskTransitions((currentTransitions) => {
        const nextTransitions = { ...currentTransitions }
        delete nextTransitions[task.id]
        return nextTransitions
      })
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id ? { ...currentTask, ...result.task } : currentTask,
        ),
      )
      return
    }

    setTaskTransitions((currentTransitions) => ({
      ...currentTransitions,
      [task.id]: {
        done: nextDone,
        task: result.task,
      },
    }))

    const timerId = window.setTimeout(() => {
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id
            ? { ...currentTask, ...result.task, done: nextDone }
            : currentTask,
        ),
      )
      setTaskTransitions((currentTransitions) => {
        const nextTransitions = { ...currentTransitions }
        delete nextTransitions[task.id]
        return nextTransitions
      })
      transitionTimersRef.current.delete(task.id)
    }, 5000)

    transitionTimersRef.current.set(task.id, timerId)
  }

  if (isLoadingTasks) {
    return null
  }

  if (isAccessDenied) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="home">
      <header className="home__header">
        <div className="home__header-start">
          <button
            className="home__theme-button"
            type="button"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            onClick={handleThemeToggle}
          >
            <span ref={themeIconRef}>
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </span>
          </button>
        </div>

        <nav className="home__views" aria-label="Task views">
          <button
            className={`home__view-button${
              activeView === 'todo' ? ' home__view-button--active' : ''
            }`}
            type="button"
            aria-pressed={activeView === 'todo'}
            onClick={() => setActiveView('todo')}
          >
            To do
          </button>
          <button
            className={`home__view-button${
              activeView === 'done' ? ' home__view-button--active' : ''
            }`}
            type="button"
            aria-pressed={activeView === 'done'}
            onClick={() => setActiveView('done')}
          >
            Done
          </button>
        </nav>

        <div className="home__menu-wrapper" ref={menuRef}>
          <button
            className="home__menu-button"
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          >
            <FiMenu />
          </button>

          {isMenuOpen && (
            <div className="home__menu" role="menu">
              <button
                className="home__menu-option home__menu-option--profile"
                type="button"
                role="menuitem"
                onClick={() => navigate('/profile')}
              >
                <FiUser />
                My profile
              </button>
              <button
                className="home__menu-option home__menu-option--logout"
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <FiLogOut />
                {isLoggingOut ? 'Closing...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="home__tasks-panel" aria-labelledby="tasks-title">
        <div className="home__tasks-header">
          <div>
            <span className="home__eyebrow">Your workspace</span>
            <h1 id="tasks-title">Tasks</h1>
          </div>
          <span className="home__tasks-count">
            {visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        <div className="home__tasks-list">
          {isLoadingTasks && <p className="home__tasks-status">Loading tasks...</p>}

          {!isLoadingTasks && activeView === 'todo' && (
            <TodoSection
              key="todo-section"
              tasks={todoTasks}
              transitions={taskTransitions}
              onOpen={handleOpenTask}
              onDelete={handleDeleteTask}
              onToggle={handleToggleTask}
            />
          )}

          {!isLoadingTasks && activeView === 'done' && (
            <DoneSection
              key="done-section"
              tasks={doneTasks}
              transitions={taskTransitions}
              onOpen={handleOpenTask}
              onDelete={handleDeleteTask}
              onToggle={handleToggleTask}
            />
          )}
        </div>
      </section>

      <button
        className="home__add-button"
        type="button"
        aria-label="Add task"
        title="Add task"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <FiPlus />
      </button>

      {isCreateModalOpen && (
        <TaskModal onClose={closeCreateModal} onConfirm={handleCreateTask} />
      )}

      {selectedTask && (
        <TaskModal
          initialTask={selectedTask}
          heading="Update task"
          supportingText="Review and update the task information."
          confirmLabel="Confirm"
          requireChanges
          onClose={() => setSelectedTask(null)}
          onConfirm={handleUpdateTask}
        />
      )}

      <span className="home__decoration home__decoration--one" aria-hidden="true" />
      <span className="home__decoration home__decoration--two" aria-hidden="true" />
    </main>
  )
}

export default Home
