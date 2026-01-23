import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import socket from "../socket";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
    socket.on("taskCreated", fetchTasks);
    socket.on("taskUpdated", fetchTasks);
    socket.on("taskDeleted", fetchTasks);

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/tasks/${id}`, { status });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    fetchTasks();
    await api.delete(`/tasks/${id}`);
  };

  return (
    <div className="container">
      <h2>My Tasks</h2>

      <div className="nav">
        <button onClick={() => navigate("/")}>Dashboard</button>
        <button onClick={() => navigate("/tasks/create")}>
          Create Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks assigned</p>
      ) : (
        tasks.map(task => (
          <div key={task._id} className="card">
            <h4>{task.title}</h4>

            <select
              value={task.status}
              onChange={(e) =>
                updateStatus(task._id, e.target.value)
              }
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <button
              className="danger"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;
