import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import "../styles/Dashboard.css";
import DeleteIcon from "@mui/icons-material/Delete";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [teamId, setTeamId] = useState(null);
  const [teams, setTeams] = useState([]); // Store list of teams
  const [newTeamName, setNewTeamName] = useState(""); // For creating new teams

  // Fetch user teams on authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchTeams(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all teams where user is a member
  const fetchTeams = async () => {
    const querySnapshot = await getDocs(collection(db, "teams"));

    const allTeams = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTeams(allTeams);

    if (allTeams.length > 0) {
      fetchTasks(allTeams);
    }
  };

  // Create a new team
  const createTeam = async () => {
    if (newTeamName.trim() === "") return;

    const teamData = {
      name: newTeamName,
      members: [auth.currentUser.uid],
    };

    const teamRef = await addDoc(collection(db, "teams"), teamData);
    setTeams([...teams, { id: teamRef.id, ...teamData }]);
    setNewTeamName(""); // Clear input
  };

  // Switch team and fetch tasks
  const switchTeam = (id) => {
    setTeamId(id);
    fetchTasks(id);
  };

  // Fetch tasks for the selected team
  const fetchTasks = async (teamId) => {
    if (!teamId) return;

    const tasksCollectionRef = collection(db, `teams/${teamId}/tasks`);
    const querySnapshot = await getDocs(tasksCollectionRef);

    const fetchedTasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      teamId: teamId, // Ensure tasks are assigned to the correct team
    }));

    setTasks(fetchedTasks);
  };

  // Add a new task
  const addTask = async () => {
    if (newTask.trim() === "" || description.trim() === "" || !teamId) return;

    const taskData = {
      title: newTask,
      description,
      priority: priority || "Medium",
      status: "To-Do",
      assignedTo: null,
    };

    await addDoc(collection(db, `teams/${teamId}/tasks`), taskData);
    setNewTask("");
    setDescription("");
    fetchTasks(teamId);
  };

  // Change task status
  const changeStatus = async (id, newStatus) => {
    if (!teamId) return;

    const taskRef = doc(db, `teams/${teamId}/tasks`, id);
    await updateDoc(taskRef, { status: newStatus });

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  // Delete a task
  const deleteTask = async (id) => {
    if (!teamId) return;

    await deleteDoc(doc(db, `teams/${teamId}/tasks`, id));
    fetchTasks(teamId);
  };

  return (
    <div className="tasks-container">
      <h1 className="task-title">Team Task Management</h1>
      {/* Create & Switch Teams */}
      <div className="team-management">
        <h2>Teams</h2>

        {/* Create New Team - Styled Same as Task Input */}
        <div className="task-input">
          <input
            type="text"
            placeholder="Enter new team name..."
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="input-field"
          />
          <button onClick={createTeam} className="add-task-btn">
            Create Team
          </button>
          <select
            onChange={(e) => switchTeam(e.target.value)}
            value={teamId || ""}
            className="input-field"
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <h2>Add Task</h2>
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
      <hr />
      {/* Task List */}
      <div className="task-list">
        {tasks.map((task, index) => {
          if (!task || !task.priority) {
            console.error(`Task at index ${index} is invalid`, task);
          }
          return (
            <div
              key={task.id}
              className={`task ${(task.priority || "Medium").toLowerCase()}`}
            >
              <div className="task-details">
                <p className="task-title-text">
                  <strong>{task.title}</strong>
                </p>
                <p className="task-desc">{task.description}</p>
                <p
                  className={`priority ${(
                    task.priority || "Medium"
                  ).toLowerCase()}`}
                >
                  {task.priority || "Medium"}
                </p>
              </div>
              <div className="task-actions">
                <select
                  onChange={(e) => changeStatus(task.id, e.target.value)}
                  value={task.status}
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;
