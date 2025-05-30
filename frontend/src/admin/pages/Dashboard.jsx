import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCheckAdmin from "../../hooks/useCheckAdmin";
import { toast } from "react-toastify";

export default function Dashboard() {
  const navigate = useNavigate();
  const isAuthenticated = useCheckAdmin();

useEffect(() => {
  if (isAuthenticated === false) {
    toast.warning("You must be an admin to access this page");
    navigate("/");
  }
}, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  return <div>Dashboard</div>;
}
