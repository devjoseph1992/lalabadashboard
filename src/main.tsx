import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Ensure App is correctly imported
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import "./index.css"; // Your Tailwind or other styles

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> {/* App contains the rest of your application */}
    </BrowserRouter>
  </React.StrictMode>
);
