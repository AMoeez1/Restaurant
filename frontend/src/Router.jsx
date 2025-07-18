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
import Admin from "./layouts/Admin";
import AddDish from "./admin/pages/AddDish";
import Dishes from "./admin/pages/Dishes";
import EditDish from "./admin/pages/EditDish";
import DishDetail from "./admin/pages/DishDetail";
import DishDetailPage from "./pages/DishDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./admin/pages/Orders";
import Tables from "./admin/pages/Tables";
import Reservations from "./admin/pages/Reservations";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Auth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<Pages />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dish/:dish_code/:dish_id" element={<DishDetailPage />} />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dishes" element={<Dishes />} />
          <Route path="orders" element={<Orders />} />
          <Route path="tables" element={<Tables />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="dish/:dish_code/:dish_id" element={<DishDetail />} />
          <Route path="add-dish" element={<AddDish />} />
          <Route path="edit-dish/:dish_code/:dish_id" element={<EditDish />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
