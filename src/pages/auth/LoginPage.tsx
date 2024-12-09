import React, { useState, FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/firebaseConfig";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Map Firebase error codes to user-friendly messages
  const handleFirebaseError = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "User not found. Please check your email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      default:
        console.error("Unexpected Firebase error:", errorCode);
        return "An unexpected error occurred. Please try again later.";
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch and store ID token
      const idToken = await user.getIdToken(true);

      if (typeof idToken !== "string") {
        throw new Error("Failed to retrieve a valid ID token.");
      }

      localStorage.setItem("idToken", idToken);

      // Fetch custom claims for user role
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role;

      if (!role || typeof role !== "string") {
        throw new Error(
          "User role not found or invalid. Please contact the administrator."
        );
      }

      console.log("Logged in user role:", role);

      // Store the role for session management
      localStorage.setItem("userRole", role);

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "employee") {
        navigate("/admin"); // Redirect employees to their dashboard
      } else {
        setError("Unauthorized role. Access denied.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(handleFirebaseError(err.code || "unknown-error"));
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
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md"
              aria-label="Email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-md"
              aria-label="Password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
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
