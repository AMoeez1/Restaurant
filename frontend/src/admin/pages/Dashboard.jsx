import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCheckAdmin from "../../hooks/useCheckAdmin";
import { toast } from "react-toastify";
import axios from "axios";
import { Spin } from "antd";

export default function Dashboard() {
  const navigate = useNavigate();
  const isAuthenticated = useCheckAdmin();

  const [allUsers, setAllUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/orders`,
          {
            withCredentials: true,
          }
        );
        setCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.warning("You must be an admin to access this page");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">Total Orders: {count}</div>
        <div className="bg-white p-4 shadow rounded">
          Total Users: {allUsers.length}
        </div>
        <div className="bg-white p-4 shadow rounded">Reservations: 45</div>
        <div className="bg-white p-4 shadow rounded">Menu Items: 32</div>
      </div>
      <div className="bg-white p-6 shadow rounded h-64">
        Recent Orders (Table Placeholder)
      </div>
    </div>
  );
}
