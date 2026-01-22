import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchAllTasks = async () => {
    try {
      const res = await api.get("/tasks/admin/all");
      setTasks(res.data);
    } catch {
      navigate("/");
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/admin/${id}`);
    fetchAllTasks();
  };

  return (
    <div className="container">
      <h2>Admin – All Tasks</h2>

      <div className="nav">
        <button onClick={() => navigate("/")}>Dashboard</button>
      </div>

      {tasks.map(task => (
        <div key={task._id} className="card">
          <h4>{task.title}</h4>
          <p>Status: {task.status}</p>

          <button
            className="danger"
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminTasks;
