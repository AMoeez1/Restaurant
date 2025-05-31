import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dishes() {
  const [dishes, setDishes] = useState([]);

  const getDishes = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/dishes`,
        {
          withCredentials: true,
        }
      );
      console.log("Data is:", res);
      setDishes(res.data);
    } catch (err) {
      console.error("Error fetching dishes:", err);
    }
  };

  useEffect(() => {
    getDishes();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dishes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dishes.map((item) => (
          <Link to={`/admin/dish/${item.dish_code}/${item._id}`} key={item._id} className="bg-white p-4 shadow rounded">
            <h3 className="text-xl font-bold">{item.name}</h3>

            {item.day_special && (
              <p className="text-sm text-indigo-600 font-medium mb-1">
                🌟 {item.day_special}
              </p>
            )}

            <p className="text-gray-600">{item.description}</p>
            <p className="text-sm text-gray-500">Type: {item.food_type}</p>

            {/* Price with optional discount */}
            <p className="mt-2 font-semibold text-green-700">
              {item.disc_per ? (
                <>
                  <span className="line-through text-gray-500 mr-2">
                    Rs {item.price}
                  </span>
                  Rs {Math.round(item.price - (item.price * item.disc_per) / 100)}
                  <span className="text-sm text-red-500 ml-1">
                    (-{item.disc_per}%)
                  </span>
                </>
              ) : (
                <>Rs {item.price}</>
              )}
            </p>

            <p className="text-sm text-gray-500">
              {item.is_available ? "Available" : "Unavailable"}
            </p>

          </Link>
        ))}
      </div>
    </div>
  );
}
