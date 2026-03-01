import { createContext, useContext, useReducer, useEffect } from "react";
import { loginUser, registerUser } from "../api/authApi";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "LOGIN":
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case "UPDATE_USER":
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for saved token and user on mount
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: "LOGIN", payload: user });
      } catch (error) {
        // If parsing fails, clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Call backend API
      const response = await loginUser({ email, password });
      
      // Backend returns: { message, email, name, token }
      const { token, email: userEmail, name } = response.data;
      
      // Save token
      localStorage.setItem("token", token);
      
      // Save user data
      const user = { email: userEmail, name };
      localStorage.setItem("user", JSON.stringify(user));
      
      // Update state
      dispatch({ type: "LOGIN", payload: user });
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle different error types
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          "Login failed. Please try again.";
      
      throw new Error(errorMessage);
    }
  };

  const signup = async (name, email, password) => {
    try {
      // Call backend API
      const response = await registerUser({ name, email, password });
      
      // Backend returns: { message, email, name, token }
      const { token, email: userEmail, name: userName } = response.data;
      
      // Save token
      localStorage.setItem("token", token);
      
      // Save user data
      const user = { email: userEmail, name: userName };
      localStorage.setItem("user", JSON.stringify(user));
      
      // Update state
      dispatch({ type: "LOGIN", payload: user });
      
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      
      // Handle different error types
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          "Signup failed. Please try again.";
      
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Update state
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (updates) => {
    const updatedUser = { ...state.user, ...updates };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    dispatch({ type: "UPDATE_USER", payload: updates });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;