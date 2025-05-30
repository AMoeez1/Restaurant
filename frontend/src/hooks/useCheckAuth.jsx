import { useState, useEffect } from "react";
import axios from "axios";

const useCheckAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/check-auth`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.isAuthenticated);

        if (response.data.isAuthenticated === true) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  return isAuthenticated;
};

export default useCheckAuth;
