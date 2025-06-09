import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function useGetUserDetail() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);     

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/profile`,
          { withCredentials: true }
        );
        setUser(res.data.user);
      } catch (err) {
        const msg = err.response?.data?.message || "Something went wrong";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { user, loading, error };
}
