import axios from "axios";
import React, { useEffect, useState } from "react";

const useCheckAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkIsAdmin = async() => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/admin/check-admin`,
            {
              withCredentials: true,
            }
          );
          if (res.data.isAdmin === true) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (err) {
          setIsAuthenticated(false);
        }
    }

    checkIsAdmin();
  }, []);
  return isAuthenticated;
};

export default useCheckAdmin;
