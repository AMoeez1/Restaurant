import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Skeleton } from "antd";
import useCheckAuth from "../hooks/useCheckAuth";
import useGetUserDetail from "../hooks/useGetUserDetail";
import EditProfileModal from "../components/auth/EditProfileModal";

function Profile() {
  const navigate = useNavigate();
  const isAuthenticated = useCheckAuth();
  const { user, loading, error } = useGetUserDetail();

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.warning("You cannot have access to this route until login");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
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

  if (error) return <p>Error: {error}</p>;

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        withCredentials: true,
      });
      toast.success(res.data);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data || "Logout failed");
    }
  };

  if (!user) return null; 

  const profileUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
      {user.avatar ? (
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/${user.avatar.replace(/\\/g, "/")}`}
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

      <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
      <p className="text-gray-600 mb-6">{user.email}</p>

      <div className="mt-8 flex justify-center gap-4">
        <EditProfileModal user={profileUser} />
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
