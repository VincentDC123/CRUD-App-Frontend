import './App.css'
import { useState, useEffect } from 'react';

// function App() {
//   const [greeting, setGreeting] = useState('');

//   useEffect(() => {
//     fetch('/api/todo')
//       .then((res) => res.text())
//       .then(setGreeting);
//   }, []);

//   return (
//     <>
//       <div>
//         <h1>{greeting}</h1>
//         <h2></h2>
//         <input type="text" /> <br />
//         <button>Add</button>
//       </div>
//     </>
//   )
// }

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isPriority, setIsPriority] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);


  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/todo');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: newTask,
          description: newDescription,
          isPriority: isPriority,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const addedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, addedTask]);
      setNewTask('');
      setNewDescription('');
      setIsPriority(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    }
  };

  const removeTask = async (id) => {
    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove task');
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/todo/${editTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: newTask,
          description: newDescription,
          isPriority: isPriority,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const updatedTask = await response.json();
      setTasks((prevTasks) => 
        prevTasks.map((task) => (task.id === editTaskId ? updatedTask : task))
      );
      resetForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    }
  }

  const resetForm = () => {
    setNewTask('');
    setNewDescription('');
    setIsPriority(false);
    setEditTaskId(null);
  }

  const startEdit = (task) => {
    setNewTask(task.task);
    setNewDescription(task.description);
    setIsPriority(task.isPriority);
    setEditTaskId(task.id);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <div>
      <h1>Task List</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Task</th>
              <th>Description</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.task}</td>
                <td>{task.description}</td>
                <td>{task.isPriority ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => startEdit(task)}>Edit</button>
                  <button onClick={() => removeTask(task.id)}>Remove</button>
                </td>              
              </tr>
            ))}
          </tbody>
        </table>

        <h2>{editTaskId ? 'Edit Task' : 'Add New Task'}</h2>
        <form onSubmit={editTaskId ? updateTask : addTask}>
          <input
            type="text"
            placeholder="Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            required
          />
          <label>
            <input
              type="checkbox"
              checked={isPriority}
              onChange={() => setIsPriority(!isPriority)}
            />
            Is Priority
          </label>
          <button type="submit">{editTaskId ? 'Update Task' : 'Add Task'}</button>
        </form>
      </div>
    </>
  )
}

export default App
