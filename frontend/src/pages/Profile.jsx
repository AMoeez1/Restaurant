import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useCheckAuth from "../hooks/useCheckAuth";
import { Button, Skeleton } from "antd";
import EditProfileModal from "../components/auth/EditProfileModal";

function Profile() {
  const [data, setData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/profile`,
          {
            withCredentials: true,
          }
        );
        // console.log(res.data.user)
        setData(res.data.user);
      } catch (err) {
        // toast.error(err.response?.data?.message || "Something went wrong");
      }
    };

    fetchProfile();
  }, []);

  const isAuthenticated = useCheckAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.warning("You cannot have access to this route until login");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <Skeleton.Avatar
          active
          size={120}
          style={{ margin: "0 auto", marginBottom: 16 }}
        />
        <Skeleton active title={false} paragraph={{ rows: 1, width: "60%" }} />
        <Skeleton.Input active style={{ width: 200, marginBottom: 20 }} />

        <div className="mt-8 flex justify-center gap-4">
          <Skeleton.Button active style={{ width: 120 }} />
          <Skeleton.Button active style={{ width: 120 }} />
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    console.log("button clicked");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      navigate("/login");
      toast.success(res.data);
    } catch (err) {
      toast.error(err.res?.data || "Logout failed");
    }
  };

  const user = {
    name: data.name,
    email: data.email,
    avatar: data.avatar
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
      {data?.avatar ? (
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/${data.avatar.replace(
            /\\/g,
            "/"
          )}`}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
          alt="User Avatar"
          className="w-32 h-32 rounded-full mx-auto"
        />
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-1">{data.name}</h2>
      <p className="text-gray-600 mb-6">{data.email}</p>

      <div className="mt-8 flex justify-center gap-4">
        <EditProfileModal user={user} />
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
