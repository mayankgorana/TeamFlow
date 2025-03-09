import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import "../styles/Dashboard.css";
import DeleteIcon from "@mui/icons-material/Delete";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [teamId, setTeamId] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;
    fetchTeam();
  }, [auth.currentUser]);

  // Fetch team where the current user is a member
  const fetchTeam = async () => {
    if (!auth.currentUser) return;

    const q = query(collection(db, "teams"), where("members", "array-contains", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const teamDoc = querySnapshot.docs[0]; // Assuming user is in one team
      setTeamId(teamDoc.id);
      fetchTasks(teamDoc.id);
    }
  };

  // Fetch tasks from Firestore for the team
  const fetchTasks = async (teamId) => {
    if (!teamId) return;

    const q = collection(db, "teams", teamId, "tasks");
    const querySnapshot = await getDocs(q);
    setTasks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Add new task to the team
  const addTask = async () => {
    if (newTask.trim() === "" || description.trim() === "" || !teamId) return;

    const taskData = {
      title: newTask,
      description,
      priority,
      status: "To-Do",
      assignedTo: null, // Can assign later
    };

    await addDoc(collection(db, "teams", teamId, "tasks"), taskData);
    setNewTask("");
    setDescription("");
    fetchTasks(teamId);
  };

  // Change task status
  const changeStatus = async (id, newStatus) => {
    if (!teamId) return;

    const taskRef = doc(db, "teams", teamId, "tasks", id);
    await updateDoc(taskRef, { status: newStatus });

    setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!teamId) return;

    await deleteDoc(doc(db, "teams", teamId, "tasks", id));
    fetchTasks(teamId);
  };

  return (
    <div className="tasks-container">
      <h1 className="task-title">Team Task Management</h1>

      {/* Add New Task */}
      <div className="task-input">
        <input
          type="text"
          placeholder="Enter task title..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter task description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        {tasks.map((task) => (
          <div key={task.id} className={`task ${task.priority.toLowerCase()}`}>
            <div className="task-details">
              <p className="task-title-text"><strong>{task.title}</strong></p>
              <p className="task-desc">{task.description}</p>
              <p className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</p>
            </div>
            <div className="task-actions">
              <select onChange={(e) => changeStatus(task.id, e.target.value)} value={task.status}>
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
