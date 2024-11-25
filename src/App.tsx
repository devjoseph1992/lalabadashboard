import React from "react";
import { Routes, Route } from "react-router-dom"; // Remove BrowserRouter import
import LoginPage from "./pages/auth/LoginPage";
import AdminDashboard from "./pages/admin/Admindashboard";

const App: React.FC = () => {
  return (
    <Routes>
      {/* Define the routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
