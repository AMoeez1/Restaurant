import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";


export default function pages() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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
            console.log(res.data.message)
          }
        } catch (err) {
          setIsAuthenticated(false);
        }
      };
  
      checkAuthentication();
    },[]);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-yellow-500 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🍽️ Gourmet Delight</h1>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </>
            ) : (
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-sm text-center py-4 mt-4 border-t">
        <p>
          &copy; {new Date().getFullYear()} Gourmet Delight. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
