import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateTask = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUsers, setAssignedUsers] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/tasks", {
        title,
        description,
        assignedUsers: assignedUsers.split(",").map(id => id.trim())
      });
      navigate("/tasks");
    } catch {
      setError("Failed to create task");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Task</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            placeholder="Assigned user IDs (comma separated)"
            value={assignedUsers}
            onChange={(e) => setAssignedUsers(e.target.value)}
          />

          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
