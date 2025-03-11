import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// Create a new team
export const createTeam = async (teamName, createdBy, members) => {
  try {
    const teamRef = await addDoc(collection(db, "teams"), {
      name: teamName,
      createdBy: createdBy,
      members: members,
    });
    console.log("Team Created with ID:", teamRef.id);
    return teamRef.id;
  } catch (error) {
    console.error("Error creating team:", error);
  }
};

// Add a task to a specific team
export const addTask = async (teamId, taskData) => {
  try {
    const taskRef = await addDoc(collection(db, "teams", teamId, "tasks"), taskData);
    console.log("Task Added with ID:", taskRef.id);
    return taskRef.id;
  } catch (error) {
    console.error("Error adding task:", error);
  }
};
