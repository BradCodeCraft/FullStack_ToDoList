/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormEvent, useEffect, useState } from "react"
import { Task } from "../shared/task"
import { remult } from "remult";
import { TasksController } from "../shared/TasksController";

const taskRepo = remult.repo(Task);

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Ensures db update on opened instances
  useEffect(() => {
    taskRepo.liveQuery({
      limit: 5
    })
      .subscribe((info) => setTasks(info.applyChanges))
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle });
      setTasks((tasks) => [...tasks, newTask])
      setNewTaskTitle("");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleSetAllCompleted(completed: boolean) {
    await TasksController.handleSetAllCompleted(completed);
  }

  return (
    <div>
      <h1>To Dos</h1>

      <main>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            value={newTaskTitle}
            placeholder="To Do:"
            onChange={(e) => setNewTaskTitle(e.target.value)} />
          <button>
            Add
          </button>
        </form>

        {tasks.map((task) => {
          async function handleDelete() {
            try {
              await taskRepo.delete(task);
              setTasks((tasks) => tasks.filter((t) => t !== task))
            } catch (error: any) {
              alert(error.message);
            }
          }

          function handleSetTask(value: Task) {
            setTasks((tasks) => tasks.map((t) => t === task ? value : t));
          }

          function handleSetComplete(completed: boolean) {
            handleSetTask({ ...task, completed });
          }
          function handleSetTitle(title: string) {
            handleSetTask({ ...task, title });
          }

          async function handleSave() {
            try {
              handleSetTask(await taskRepo.save(task))
            } catch (error: any) {
              alert(error.message);
            }
          }

          return (
            <div key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => handleSetComplete(e.target.checked)}
              />
              <input
                value={task.title}
                onChange={(e) => handleSetTitle(e.target.value)}
              />

              <button onClick={() => handleSave()}>Save</button>
              <button onClick={() => handleDelete()}>Del</button>
            </div>
          )
        })}

        <div>
          <button onClick={(e) => handleSetAllCompleted(true)}>Set all completed</button>
          <button onClick={(e) => handleSetAllCompleted(false)}>Set all uncompleted</button>
        </div>
      </main>
    </div>
  )
}