import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/authContext";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch {
        logout();
        navigate("/login");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    logout();
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <div className="card">
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <div className="nav">
        {user.role === "admin" && (
          <button onClick={() => navigate("/admin/tasks")}>
            Admin Task Panel
          </button>
        )}

        <button onClick={() => navigate("/tasks")}>
          View Tasks
        </button>

        <button className="danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
