import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGetDishes from "../hooks/useGetDishes";
import useCheckAuth from "../hooks/useCheckAuth";
import { Popover, Button } from "antd";
import useGetTables from "../hooks/useGetTables";
import useGetUserDetail from "../hooks/useGetUserDetail";
import { toast } from "react-toastify";
import ReserveTableModal from "../components/ReserveTableModal";
import { Spin } from "antd";
import StylishLoader from "../hooks/useLoader";

const Home = () => {
  const { dishes, loading, error } = useGetDishes();
  const isAuthenticated = useCheckAuth();
  const { tables, available } = useGetTables();
  const [activePopover, setActivePopover] = useState({
    dishId: null,
    type: null,
  });
  const { user } = useGetUserDetail();
  const navigate = useNavigate();

// if (loading)
//   return (
//     <div style={{ display: "flex", justifyContent: "center", marginTop: 50, height: '80vh', alignItems: 'center' }}>
//       <Spin size="large" tip="Loading dishes..." />
//     </div>
//   );

  if (loading) return <StylishLoader />;


  if (error) return <p>Error loading dishes: {error.message}</p>;

  const handleBuyNow = (dish) => {
    const singleItem = {
      _id: `buyNow-${dish._id}`,
      dishId: dish,
      quantity: 1,
    };

    navigate("/checkout", { state: { selectedItems: [singleItem] } });
  };

  const handleAction = async (dish_code, dishId, type) => {
    if (isAuthenticated === false) {
      setActivePopover({ dishId, type });
    } else if (isAuthenticated === true) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/add-cart/`,
          { userId: user._id, dishId, dish_code, quantity: 1 },
          { withCredentials: true }
        );
        toast.success("Added to card successfully");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const popoverContent = (
    <div>
      <p>You need to be logged in to proceed.</p>
      <Button type="primary" onClick={() => navigate("/login")}>
        Login
      </Button>
    </div>
  );

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
          <ReserveTableModal user={user} tables={tables} />
        </div>
      </section>

      <section className="py-16 px-6 bg-yellow-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Chef’s Specials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {dishes.map((dish) => (
            <div
              key={dish._id}
              className="bg-gray-50 px-2 py-6 rounded-lg shadow hover:shadow-md transition flex flex-col"
            >
              <Link
                to={`/dish/${dish.dish_code}/${dish._id}`}
                className="flex flex-col flex-grow"
              >
                <img
                  src={
                    dish.image_url
                      ? `${
                          import.meta.env.VITE_BACKEND_URL
                        }/${dish.image_url.replace(/\\/g, "/")}`
                      : "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={dish.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />

                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-yellow-600">
                    {dish.name}
                  </h3>
                  <h3 className="font-semibold text-yellow-600">
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

                <p className="text-gray-600 text-sm mb-2">
                  Food Type: {dish.food_type}
                </p>
                <p className="text-gray-600 text-sm flex-grow">
                  {dish.description}
                </p>
              </Link>

              <div className="flex gap-4 mt-2">
                <Popover
                  content={popoverContent}
                  title="Login Required"
                  trigger="click"
                  open={
                    activePopover.dishId === dish._id &&
                    activePopover.type === "cart"
                  }
                  onOpenChange={(visible) => {
                    if (!visible)
                      setActivePopover({ dishId: null, type: null });
                  }}
                >
                  <button
                    onClick={() =>
                      handleAction(dish.dish_code, dish._id, "cart")
                    }
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg text-sm"
                  >
                    Add to Cart
                  </button>
                </Popover>

                <Popover
                  content={popoverContent}
                  title="Login Required"
                  trigger="click"
                  open={
                    activePopover.dishId === dish._id &&
                    activePopover.type === "buyNow"
                  }
                  onOpenChange={(visible) => {
                    if (!visible)
                      setActivePopover({ dishId: null, type: null });
                  }}
                >
                  <button
                    onClick={() => handleBuyNow(dish)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg text-sm"
                  >
                    Buy Now
                  </button>
                </Popover>
              </div>
            </div>
          ))}
        </div>
      </section>
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
