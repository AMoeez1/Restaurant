import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Spin, Tag } from "antd";
import { toast } from "react-toastify";

export default function DishDetail() {
  const { dish_id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const fetchDish = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/dish/${dish_id}`,
        { withCredentials: true }
      );
      setDish(res.data);
      console.log(res.data)
    } catch (error) {
      console.error("Error fetching dish:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDish();
  }, [dish_id]);

  const handleDeleteDish = async () => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-dish/${dish._id}`,
        {withCredentials: true }
      );
      toast.success(res.data.message);
      navigate('/admin/dishes')
      console.log(res.data);
      
    } catch (err) {
      toast.error("Error Deleting Dish");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="text-center mt-20 text-red-600">
        <p>Dish not found.</p>
      </div>
    );
  }

  const discountedPrice =
    dish.price - (dish.price * (dish.disc_per || 0)) / 100;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md overflow-hidden">
        <img
          src={dish.image_url ? `${
                        import.meta.env.VITE_BACKEND_URL
                      }/${dish.image_url.replace(/\\/g, "/")}` : "https://source.unsplash.com/800x400/?food"}
          alt={dish.name}
          className="w-full h-64 object-contain bg-black"
        />
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{dish.name}</h2>

          <div className="mb-4">
            <Tag color={dish.is_available ? "green" : "red"}>
              {dish.is_available ? "Available" : "Unavailable"}
            </Tag>
            <Tag color="blue">{dish.food_type}</Tag>
            {dish.day_special && dish.day_special !== "Not Special" && (
              <Tag color="purple">{dish.day_special}'s Special Dish</Tag>
            )}
          </div>

          <p className="text-gray-600 text-lg mb-4">{dish.description}</p>

          <div className="text-xl font-semibold text-yellow-600">
            {dish.disc_per ? (
              <>
                <span className="line-through text-gray-500 mr-2">
                  Rs {dish.price}
                </span>
                <span className="text-green-600">
                  Rs {discountedPrice.toFixed(2)}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  ({dish.disc_per}% off)
                </span>
              </>
            ) : (
              <>Rs {dish.price}</>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              to={`/admin/edit-dish/${dish.dish_code}/${dish._id}`}
              className="text-white hover:underline mt-4 inline-block bg-gray-800 hover:bg-gray-900 px-8 py-2 rounded-lg shadow-lg"
            >
              Edit
            </Link>
            <button
              className="text-white hover:underline mt-4 inline-block bg-red-500 hover:bg-red-600 px-8 py-2 rounded-lg shadow-lg"
              onClick={handleDeleteDish}
            >
              Delete Dish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
