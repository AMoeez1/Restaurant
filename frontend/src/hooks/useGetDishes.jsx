import { useState, useEffect } from "react";
import axios from "axios";

export default function useGetDishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dish`, {
          withCredentials: true,
        });
        setDishes(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  return { dishes, loading, error };
}
