import axios from "axios";
import { useState, useEffect } from "react";

export default function useGetTables() {
  const [available, setAvailable] = useState(0);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/tables`,
        {
          withCredentials: true,
        }
      );
      setTables(res.data);
      const tablesAvailable = res.data.filter((table) => table.isAvailable).length;
      setAvailable(tablesAvailable);
    } catch (err) {
      console.error("Failed to fetch tables:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return { fetchTables, tables, available, loading, error };
}
