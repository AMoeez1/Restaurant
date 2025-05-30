import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCheckAdmin from "../../hooks/useCheckAdmin";
import { toast } from "react-toastify";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const isAuthenticated = useCheckAdmin();

  const [allUsers, setAllUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/dashboard`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      setAllUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    if (isAuthenticated === false) {
      toast.warning("You must be an admin to access this page");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">Total Orders: 120</div>
        <div className="bg-white p-4 shadow rounded">Reservations: 45</div>
        <div className="bg-white p-4 shadow rounded">Menu Items: 32</div>
      </div>
      <div className="bg-white p-6 shadow rounded h-64">
        Recent Orders (Table Placeholder)
        {allUsers.length}
        {allUsers.map((user) => (
          <p key={user._id}>
            {user.name} - {user.email}
          </p>
        ))}
      </div>
    </div>
  );
}
