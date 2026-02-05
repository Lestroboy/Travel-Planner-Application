import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import '../style/Register.css';

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  // ✅ Google Login
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Left - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 to-primary/80" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Start Your Journey
            </h2>
            <p className="text-lg text-white/80 max-w-md">
              Join thousands of travelers who plan their dream vacations with us.
              Create itineraries, track budgets, and collaborate with friends.
            </p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
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

          <h1 className="text-3xl font-heading font-bold mb-2">Create account</h1>
          <p className="text-muted-foreground mb-8">
            Start planning your dream adventures today
          </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="name"
          value={form.name}
          onChange={handleChange}
          required
          className="input-field px-5 py-4"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="input-field px-5 py-4"
        />

        <input  
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="input-field px-5 py-4"
        />

        <button
  type="submit"
  className="w-full mt-4 btn-primary text-center"
>
  Register
</button>

      </form>

      {message && <p>{message}</p>}

      <div className="relative my-6">
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
            Already have an account?{" "}
            <Link to="/" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};