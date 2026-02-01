import { useNavigate } from "react-router-dom";
import "../style/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h2>Dashboard</h2>
        <p>You are logged in</p>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
