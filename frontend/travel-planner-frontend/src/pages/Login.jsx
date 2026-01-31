// src/pages/Login.jsx
import { useState } from "react";
import { loginUser } from "../api/authApi";
import { Link } from "react-router-dom";
import '../style/Login.css'

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await loginUser(formData);

    // Save token
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userEmail", res.data.email);

    // Redirect (temporary)
    window.location.href = "/dashboard";

  } catch (err) {
    console.error("Login failed", err.response?.data);
  }
};

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p className="auth-link">
        Don’t have an account?{" "}
        <Link to="/register">Register</Link>
      </p>
      
    </div>
  );
}

export default Login;