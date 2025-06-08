import React, { useEffect, useState } from "react";
import useCheckAuth from "../hooks/useCheckAuth";
import useGetUserDetail from "../hooks/useGetUserDetail";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const isAuthenticated = useCheckAuth();
  const { user, loading: userLoading, error: userError } = useGetUserDetail();

  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.warning("You cannot access this route without logging in.");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/get-cart-item/${user._id}`,
          { withCredentials: true }
        );
        setCart(res.data.items);

        const initialQuantities = {};
        res.data.items.forEach((item) => {
          initialQuantities[item._id] = item.quantity;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };

    if (user && isAuthenticated) {
      fetchCartItems();
    }
  }, [user, isAuthenticated]);

  const handleQuantityChange = async (itemId, newQty, dishId) => {
    if (newQty < 1) return;

    setQuantities((prev) => ({
      ...prev,
      [itemId]: newQty,
    }));

    const updatedCart = cart.map((item) =>
      item._id === itemId ? { ...item, quantity: newQty } : item
    );
    setCart(updatedCart);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/update-cart/${user._id}/${dishId}`,
        { quantity: newQty },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to update cart:", err);
      toast.error("Failed to update cart.");
    }
  };

  const handleRemoveCartItem = async (itemId, dishId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/delete-cart/${user._id}/${dishId}`,
        { withCredentials: true }
      );
      setCart((prev) => prev.filter((item) => item._id !== itemId));
      toast.success("Item Removed From Cart");
    } catch (err) {
      toast.error("Error removing Item from the cart");
      console.error("Error deleting item:", err);
    }
  };

  if (isAuthenticated === null || userLoading) return <div>Loading...</div>;
  if (userError) return <div>Error loading user details: {userError}</div>;

  const { totalBeforeDiscount, totalAfterDiscount, totalSaved } = cart.reduce(
    (totals, item) => {
      const dish = item.dishId;
      const quantity = item.quantity;
      const basePrice = dish.price;
      const discount = dish.disc_per || 0;

      const totalPrice = basePrice * quantity;
      const discountedPrice =
        (basePrice - (basePrice * discount) / 100) * quantity;

      totals.totalBeforeDiscount += totalPrice;
      totals.totalAfterDiscount += discountedPrice;
      totals.totalSaved += totalPrice - discountedPrice;

      return totals;
    },
    { totalBeforeDiscount: 0, totalAfterDiscount: 0, totalSaved: 0 }
  );

  return (
    <main className="min-h-screen grid grid-cols-12 bg-yellow-50 py-10">
      <div className="col-span-3" />
      <div className="col-span-6 mx-auto w-full">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty cart"
              className="w-28 h-28 mx-auto mb-4 opacity-80"
            />
            <h2 className="text-xl font-semibold text-gray-700">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mt-2 mb-4">
              Start adding your favorite dishes!
            </p>
            <Link
              to={"/"}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-md"
            >
              Browse
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-green-500 mb-6">
              Your Cart
            </h1>
            <ul className="space-y-4">
              {cart.map((item) => {
                const dish = item.dishId;
                const discountedPrice = dish.disc_per
                  ? Math.round(dish.price - (dish.price * dish.disc_per) / 100)
                  : dish.price;

                const imageUrl = dish.image_url
                  ? `${
                      import.meta.env.VITE_BACKEND_URL
                    }/${dish.image_url.replace(/\\/g, "/")}`
                  : "https://via.placeholder.com/400x300?text=No+Image";

                return (
                  <li
                    key={item._id}
                    className="flex items-center justify-between bg-white rounded-xl shadow p-4"
                  >
                    <div className="flex items-center gap-5 w-full">
                      <img
                        src={imageUrl}
                        alt={dish.name}
                        className="w-20 h-20 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h2 className="text-base font-semibold text-yellow-700">
                          {dish.name}
                        </h2>
                        <p className="text-xs text-gray-500 mb-1">
                          {dish.food_type} • {dish.day_special || "Regular"}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          {dish.disc_per ? (
                            <>
                              <span className="line-through text-gray-400">
                                Rs {dish.price}
                              </span>
                              <span className="text-green-600 font-bold">
                                Rs {discountedPrice}
                              </span>
                            </>
                          ) : (
                            <span className="text-green-600 font-bold">
                              Rs {dish.price}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item._id,
                                (quantities[item._id] || 1) - 1,
                                dish._id
                              )
                            }
                            className="px-2 py-1 bg-gray-200 rounded text-sm font-bold hover:bg-gray-300"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>

                          <input
                            type="number"
                            value={quantities[item._id] || 1}
                            readOnly
                            className="w-10 text-center border border-gray-300 rounded text-sm"
                          />

                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item._id,
                                (quantities[item._id] || 1) + 1,
                                dish._id
                              )
                            }
                            className="px-2 py-1 bg-gray-200 rounded text-sm font-bold hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveCartItem(item._id, dish._id)}
                      className="text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      <div className="col-span-3">
        {cart.length === 0 ? null : (
          <div className="mt-8 text-right space-y-1">
            <p className="text-sm text-gray-600">
              Total (before discount):{" "}
              <span className="font-medium text-gray-800">
                Rs {totalBeforeDiscount.toFixed(0)}
              </span>
            </p>
            <p className="text-sm text-green-600">
              You Saved:{" "}
              <span className="font-semibold">Rs {totalSaved.toFixed(0)}</span>
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Total Payable:{" "}
              <span className="text-green-600 font-bold">
                Rs {totalAfterDiscount.toFixed(0)}
              </span>
            </p>
            <button className="mt-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md shadow">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
