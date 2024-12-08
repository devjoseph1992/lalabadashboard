import React, { useState, FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/firebaseConfig"; // Your Firebase auth configuration

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Utility function for handling Firebase errors
  const handleFirebaseError = (err: any): string => {
    switch (err.code) {
      case "auth/user-not-found":
        return "User not found. Please check your email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      default:
        console.error("Unexpected error:", err);
        return "An unexpected error occurred.";
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Authenticate user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch and store ID token
      const idToken = await user.getIdToken(true); // Force token refresh
      localStorage.setItem("idToken", idToken);

      console.log("ID Token stored:", idToken); // Debugging log

      // Get custom claims
      const idTokenResult = await user.getIdTokenResult();
      console.log("Custom claims:", idTokenResult.claims); // Debugging log

      // Navigate based on role
      if (idTokenResult.claims.role === "admin") {
        navigate("/admin");
      } else {
        setError("Unauthorized role. You don't have admin access.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-3 py-2 border rounded-md"
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-3 py-2 border rounded-md"
            disabled={loading}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
