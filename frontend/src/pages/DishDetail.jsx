import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DishDetailPage = () => {
  const { dish_code, dish_id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDish = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/dish/${dish_id}`,
        { withCredentials: true }
      );
      console.log(res.data);
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
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!dish) {
    return <div className="p-6 text-center text-red-500">Dish not found.</div>;
  }

  const imageUrl = dish.image_url
    ? `${import.meta.env.VITE_BACKEND_URL}/${dish.image_url.replace(
        /\\/g,
        "/"
      )}`
    : "https://via.placeholder.com/600x400?text=No+Image";

  const finalPrice = dish.disc_per
    ? Math.round(dish.price - (dish.price * dish.disc_per) / 100)
    : dish.price;

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full flex flex-col lg:flex-row bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-md overflow-hidden">
        {/* Image Section */}
        <section className="relative flex-1 min-w-0">
          <img
            src={imageUrl}
            alt={dish.name}
            className="w-full h-48 sm:h-full object-cover object-center rounded-l-2xl"
          />
          {dish.disc_per && (
            <div className="absolute top-3 left-3 bg-red-600 text-white font-semibold px-3 py-0.5 rounded-full shadow-md text-xs uppercase tracking-wide select-none">
              {dish.disc_per}% OFF
            </div>
          )}
        </section>

        {/* Content Section */}
        <section className="flex-1 p-6 flex flex-col justify-center">
          <h1 className="text-2xl font-extrabold text-yellow-700 drop-shadow-md mb-4">
            {dish.name}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            {dish.disc_per ? (
              <>
                <span className="line-through text-gray-400 text-sm">
                  Rs {dish.price}
                </span>
                <span className="text-green-700 font-bold text-xl drop-shadow">
                  Rs {finalPrice}
                </span>
              </>
            ) : (
              <span className="text-green-700 font-bold text-xl drop-shadow">
                Rs {dish.price}
              </span>
            )}
          </div>

          {dish.day_special && (
            <p className="mb-4 inline-block bg-indigo-100 text-indigo-700 font-semibold text-xs px-3 py-0.5 rounded-full shadow-sm select-none">
              🌟 {dish.day_special} Special
            </p>
          )}

          <p className="mb-5">
            <strong className="text-gray-700 text-sm">Food Type: </strong>
            <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs font-semibold">
              {dish.food_type}
            </span>
          </p>

          <p className="text-gray-700 leading-relaxed text-sm mb-8">
            {dish.description}
          </p>

          <div className="flex gap-4">
            <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg text-sm">
              Add to Cart
            </button>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg text-sm">
              Buy Now
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DishDetailPage;
