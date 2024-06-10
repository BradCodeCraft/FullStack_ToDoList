import { FormEvent, useEffect, useState } from "react"
import { Task } from "./shared/task"
import { remult } from "remult";

const taskRepo = remult.repo(Task)

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    taskRepo.find({
      orderBy: {
        completed: "desc"
      }
    }).then(setTasks)
  }, [])

  async function addTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle })
      setTasks((tasks) => [...tasks, newTask]);
      setNewTaskTitle("");
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div>
      <h1>To Dos</h1>

      <main>
        <form onSubmit={e => addTask(e)}>
          <input
            value={newTaskTitle}
            placeholder="New Task"
            onChange={e => setNewTaskTitle(e.target.value)}
          />
          <button>Add</button>
        </form>
        {tasks.map(task => {
          async function handleDeleteTask() {
            try {
              await taskRepo.delete(task);
              setTasks(tasks => tasks.filter(t => t !== task));
            } catch (error: any) {
              alert(error.message)
            }
          }

          function setTask(value: Task) {
            setTasks((tasks) => tasks.map(t => t === task ? value : t));
          }

          async function setCompleted(completed: boolean) {
            setTask(await taskRepo.save({ ...task, completed }));
          }
          function setTitle(title: string) {
            setTask({ ...task, title })
          }

          async function handleSaveTask() {
            try {
              setTask(await taskRepo.save(task));
            } catch (error: any) {
              alert(error.message)
            }
          }

          return (
            <div key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />
              <input
                value={task.title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button onClick={() => handleSaveTask()}>Save</button>
              <button onClick={() => handleDeleteTask()}>Del</button>
            </div>
          )
        })}
      </main>
    </div>
  )
}

export default App
