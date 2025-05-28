import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { toast } from 'react-toastify';

function Profile() {
    const [data, setData] = useState({})
    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
          withCredentials: true,
        });
        setData(res.data.user)
        console.log(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    };

    fetchProfile();
  }, []);
  return (
    <div>Profile {data.email}</div>
  )
}

export default Profile