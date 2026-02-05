import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // ✅ Save JWT
      localStorage.setItem("token", token);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } else {
      // ❌ If no token, go back to login
      navigate("/");
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
}

export default OAuthSuccess;