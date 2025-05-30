import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Auth from "./layouts/Auth";
import Register from "./auth/Register";
import Profile from "./pages/Profile";
import Pages from "./layouts/Pages";
import Home from "./pages/Home";
import AdminLogin from "./admin/Login";
import Dashboard from "./admin/pages/Dashboard";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Auth />}>
          <Route path="/login" element={<Login />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<Pages />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
