import React, { useState } from "react";
import { createTeam } from "../services/teamService";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState("");

  const handleCreateTeam = async () => {
    if (!teamName || !members) {
      alert("Please enter team name and members");
      return;
    }

    const membersArray = members.split(",").map((m) => m.trim());
    await createTeam(teamName, "user123", membersArray);
  };

  return (
    <div>
      <h2>Create Team</h2>
      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Members (comma-separated)"
        value={members}
        onChange={(e) => setMembers(e.target.value)}
      />
      <button onClick={handleCreateTeam}>Create Team</button>
    </div>
  );
};

export default CreateTeam;
