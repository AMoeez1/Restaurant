import { useState, useEffect } from "react";
import axios from "axios";

export default function useGetSingleDish(dish_id) {
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dish_id) return;

    const fetchDish = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/dish/${dish_id}`,
          { withCredentials: true }
        );
        setDish(res.data);
      } catch (error) {
        setError(error);
        console.error("Error fetching dish:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [dish_id]);

  return { dish, loading, error };
}
