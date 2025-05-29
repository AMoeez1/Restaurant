import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Profile() {
    const navigate = useNavigate();
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/profile`,
          {
            withCredentials: true,
          }
        );
        setData(res.data.user);
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    console.log('button clicked')
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {
          withCredentials: true,
        }
    );
    console.log(res.data)
    navigate('/login');
      toast.success(res.data);
    } catch (err) {
        toast.error(err.res?.data || "Logout failed");
    }
  };
  //   const user = {
  //   name: "Abdul Moeez",
  //   email: "moeez@example.com",
  //   phone: "+92 300 1234567",
  //   joined: "March 2024",
  // };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
      <img
        src="https://i.pravatar.cc/150?img=3"
        alt="User Avatar"
        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-yellow-500"
      />
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{data.name}</h2>
      <p className="text-gray-600 mb-6">{data.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* <div>
          <h3 className="font-semibold text-gray-700">Phone:</h3>
          <p className="text-gray-600">{user.phone}</p>
        </div> */}
        {/* <div>
          <h3 className="font-semibold text-gray-700">Joined:</h3>
          <p className="text-gray-600">{user.joined}</p>
        </div> */}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded">
          Edit Profile
        </button>
        <button onClick={handleLogout} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
