import axios from "axios";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [dishes, setDishes] = useState([]);
  const fetchDishes = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dish`, {
      withCredentials: true,
    });
    console.log(res.data);
    setDishes(res.data);
  };

  useEffect(() => {
    fetchDishes();
  }, []);
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-yellow-50 py-20 px-4 text-center">
        <h1 className="text-5xl font-extrabold text-yellow-600 mb-4">
          Welcome to Gourmet Delight
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
          Experience a symphony of flavors, expertly crafted by our
          award-winning chefs.
        </p>
        <div className="space-x-4">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md text-lg">
            Explore Menu
          </button>
          <button className="bg-white border border-yellow-500 hover:bg-yellow-100 text-yellow-600 px-6 py-3 rounded-md text-lg">
            Book a Table
          </button>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Chef’s Specials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {dishes.map((dish) => (
            <div
              key={dish._id}
              className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-yellow-600 mb-2">
                  {dish.name}
                </h3>
                <h3 className="font-semibold text-yellow-600 mb-2">
                  {dish.disc_per ? (
                    <>
                      <span className="text-gray-500 line-through mr-2">
                        Rs {dish.price}
                      </span>
                      <span>
                        Rs{" "}
                        {Math.round(
                          dish.price - (dish.price * dish.disc_per) / 100
                        )}
                      </span>
                    </>
                  ) : (
                    <>Rs {dish.price}</>
                  )}
                </h3>
              </div>

              <div className="flex justify-between">
                {dish.day_special && (
                  <p className="text-sm font-medium text-indigo-600 mb-1">
                    🌟 {dish.day_special} Special
                  </p>
                )}
                {dish.disc_per && (
                  <span className="text-sm font-semibold text-red-500 ml-2">
                    (-{dish.disc_per}% off)
                  </span>
                )}
              </div>

              <p className="text-gray-600">Food Type: {dish.food_type}</p>
              <p className="text-gray-600">{dish.description}</p>

              <img
                src={
                  dish.image_url || "https://source.unsplash.com/400x300/?food"
                }
                alt={dish.name}
                className="w-full h-48 object-cover rounded-md mb-4 mt-4"
              />
            </div>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            At Gourmet Delight, we blend tradition with innovation. Our journey
            began with a simple passion — to deliver unforgettable dining
            experiences. From locally sourced ingredients to world-class
            culinary techniques, we serve food that celebrates taste,
            creativity, and connection.
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-yellow-500 text-white py-12 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Experience Gourmet?
        </h2>
        <p className="mb-6 text-lg">
          Reserve your table now and savor the extraordinary.
        </p>
        <button className="bg-white text-yellow-600 px-6 py-3 rounded-md font-semibold hover:bg-yellow-100">
          Book Now
        </button>
      </section>
    </div>
  );
};

export default Home;
