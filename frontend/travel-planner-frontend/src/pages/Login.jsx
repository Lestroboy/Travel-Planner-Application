import { useState } from "react";
import { loginUser } from "../api/authApi";
import {  Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

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

// ✅ Google Login
const handleGoogleLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-2xl mb-8">
            <span className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              ✈
            </span>
            TravelPlan
          </Link>

          <h1 className="text-3xl font-heading font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to continue planning your adventures
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input-field px-5 py-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="input-field px-5 py-4"
        />

        <button
  type="submit"
  className="w-full mt-4 btn-primary text-center"
>
  Login
</button>

      </form>


          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-muted text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-border bg-card hover:bg-muted transition-colors" type="button" onClick={handleGoogleLogin}>
            <FcGoogle className="w-5 h-5" />
            <span className="font-medium">Continue with Google</span>
          </button>

          <p className="text-center mt-8 text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Explore the World
            </h2>
            <p className="text-lg text-white/80 max-w-md">
              Plan your perfect trip with our comprehensive travel planning tools.
              Book flights, hotels, and experiences all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;