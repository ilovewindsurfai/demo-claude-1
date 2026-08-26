import { useMemo, useState } from 'react'
import './App.css'

type Task = {
  id: number
  text: string
  done: boolean
}

type Filter = 'all' | 'active' | 'done'

const initialTasks: Task[] = [
  { id: 1, text: 'Explorer le projet', done: true },
  { id: 2, text: 'Ajouter une tâche', done: false },
  { id: 3, text: 'Cocher une tâche terminée', done: false },
]

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const remaining = useMemo(() => tasks.filter((t) => !t.done).length, [tasks])

  const visibleTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((t) => !t.done)
      case 'done':
        return tasks.filter((t) => t.done)
      default:
        return tasks
    }
  }, [tasks, filter])

  function addTask(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setTasks((prev) => [...prev, { id: Date.now(), text: trimmed, done: false }])
    setText('')
  }

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  function removeTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <main id="app">
      <h1>Demo React</h1>
      <p className="subtitle">Une petite liste de tâches pour illustrer React + Vite + TypeScript</p>

      <form className="add-form" onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ajouter une tâche…"
          aria-label="Nouvelle tâche"
        />
        <button type="submit">Ajouter</button>
      </form>

      <div className="filters" role="group" aria-label="Filtrer les tâches">
        {(['all', 'active', 'done'] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Toutes' : f === 'active' ? 'À faire' : 'Terminées'}
          </button>
        ))}
      </div>

      <ul className="task-list">
        {visibleTasks.length === 0 && <li className="empty">Aucune tâche ici</li>}
        {visibleTasks.map((task) => (
          <li key={task.id} className={task.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              <span>{task.text}</span>
            </label>
            <button
              type="button"
              className="remove"
              onClick={() => removeTask(task.id)}
              aria-label={`Supprimer "${task.text}"`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <p className="status">{remaining} tâche(s) restante(s)</p>
    </main>
  )
}

export default App
