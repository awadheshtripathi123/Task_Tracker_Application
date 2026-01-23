import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateTask = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/tasks", {
        title,
        description,
        status,
        Deadline: deadline ? new Date(deadline).toISOString() : null
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

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="To Do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
            <option value="Blocked">Blocked</option>
          </select>

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
