import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Ensure App is correctly imported
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import "./index.css"; // Your Tailwind or other styles
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
