import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Auth from './layouts/Auth';
import Register from './auth/Register';
import Profile from './pages/Profile';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Auth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
          <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}
