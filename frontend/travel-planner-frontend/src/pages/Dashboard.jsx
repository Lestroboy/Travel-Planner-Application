import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>You are logged in</p>

      <button className="auth-link">
        <Link to="/register">Logout</Link>
      </button>

    </div>
  );
}

export default Dashboard;