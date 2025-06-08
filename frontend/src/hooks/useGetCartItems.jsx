import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function useGetCartItems(userId) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        setCart([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/get-cart-item/${userId}`,
          { withCredentials: true }
        );
        setCart(res.data.items);
        setError(null);
      } catch (err) {
        toast.error("Failed to fetch cart items.");
        setError(err.message || "Failed to fetch cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  return { cart, loading, error, setCart };
}
