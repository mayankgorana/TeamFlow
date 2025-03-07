import React, { useState } from "react";
import "../styles/Dashboard.css";
import DeleteIcon from "@mui/icons-material/Delete";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");

  // Add Task
  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { text: newTask, priority, status: "To-Do" }]);
    setNewTask("");
  };

  // Change Task Status
  const changeStatus = (index, newStatus) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].status = newStatus;
    setTasks(updatedTasks);
  };

  // Delete Task
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="tasks-container">
      <h1 className="task-title">Task Management</h1>

      {/* Add New Task */}
      <div className="task-input">
        <input
          type="text"
          placeholder="Enter task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task, index) => (
          <div key={index} className={`task ${task.priority.toLowerCase()}`}>
            <div className="task-details">
              <p>{task.text} - <strong>{task.priority}</strong></p>
            </div>
            <div className="task-actions">
              <select onChange={(e) => changeStatus(index, e.target.value)} value={task.status}>
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button className="delete-btn" onClick={() => deleteTask(index)}><DeleteIcon /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
