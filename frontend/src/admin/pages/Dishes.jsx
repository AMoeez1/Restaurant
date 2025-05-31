import React, { useEffect, useState } from "react";
import axios from "axios";

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
      console.log("Data is:" ,res)
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
          <div key={item._id} className="bg-white p-4 shadow rounded">
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
            <p className="mt-2 font-semibold text-green-700">Rs {item.price}</p>
            <p className="text-sm text-gray-500">
              {item.is_available ? "Available" : "Unavailable"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
