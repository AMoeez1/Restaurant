import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Spin, Tag } from "antd";

export default function DishDetail() {
  const { dish_id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDish = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/update-dish/${dish_id}`,
        { withCredentials: true }
      );
      setDish(res.data);
    } catch (error) {
      console.error("Error fetching dish:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDish();
  }, [dish_id]);

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

  const discountedPrice = dish.price - (dish.price * (dish.disc_per || 0)) / 100;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md overflow-hidden">
        <img
          src={dish.image_url || "https://source.unsplash.com/800x400/?food"}
          alt={dish.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {dish.name}
          </h2>

          <div className="mb-4">
            <Tag color={dish.is_available ? "green" : "red"}>
              {dish.is_available ? "Available" : "Unavailable"}
            </Tag>
            <Tag color="blue">{dish.food_type}</Tag>
            {dish.day_special && dish.day_special !== "Not Special" && (
              <Tag color="purple">Special on {dish.day_special}</Tag>
            )}
          </div>

          <p className="text-gray-600 text-lg mb-4">{dish.description}</p>

          <div className="text-xl font-semibold text-yellow-600">
            {dish.disc_per ? (
              <>
                <span className="line-through text-gray-500 mr-2">
                  Rs {dish.price}
                </span>
                <span className="text-green-600">Rs {discountedPrice.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({dish.disc_per}% off)
                </span>
              </>
            ) : (
              <>Rs {dish.price}</>
            )}
          </div>
             <Link
              to={`/admin/edit-dish/${dish.dish_code}/${dish._id}`}
              className="text-white hover:underline mt-4 inline-block bg-gray-800 hover:bg-gray-900 px-8 py-2 rounded-sm shadow-lg"
            >
              Edit
            </Link>
        </div>
      </div>
    </div>
  );
}
