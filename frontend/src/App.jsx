import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Feed from "./pages/Feed";

function App() {
  const isAuth = !!localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={isAuth ? <Navigate to="/feed" /> : <Navigate to="/login" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/feed" element={isAuth ? <Feed /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
