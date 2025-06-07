import React, { useEffect, useState } from "react";
import useCheckAuth from "../hooks/useCheckAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});

  const isAuthenticated = useCheckAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.warning("You cannot have access to this route until login");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated === true) {
      const getLoggedUserDetail = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/get-user-detail`,
            { withCredentials: true }
          );
          setUserId(res.data.user._id);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      };
      getLoggedUserDetail();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!userId) return;

    const getCartItem = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/get-cart-item/${userId}`,
          { withCredentials: true }
        );
        setCart(response.data.items);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };

    getCartItem();
  }, [userId]);

  useEffect(() => {
    if (cart) {
      const qtys = {};
      cart.forEach((item) => {
        qtys[item._id] = item.quantity;
      });
      setQuantities(qtys);
    }
  }, [cart]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

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

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return; // prevent zero or negative

    setQuantities((prev) => ({
      ...prev,
      [itemId]: newQty,
    }));

    const updatedItems = cart.items.map((item) =>
      item._id === itemId ? { ...item, quantity: newQty } : item
    );
    setCart({ ...cart, items: updatedItems });

    // Optionally send update to backend here
  };

  return (
    <main className="min-h-screen grid grid-cols-12 bg-yellow-50 py-10">
      <div className="col-span-3"></div>
      <div className="col-span-6 mx-auto w-full">
        <h1 className="text-2xl font-bold text-green-500 mb-6">Your Cart</h1>

        <ul className="space-y-4">
          {cart.map((item) => {
            const dish = item.dishId;
            const discountedPrice = dish.disc_per
              ? Math.round(dish.price - (dish.price * dish.disc_per) / 100)
              : dish.price;

            const imageUrl = dish.image_url
              ? `${import.meta.env.VITE_BACKEND_URL}/${dish.image_url.replace(
                  /\\/g,
                  "/"
                )}`
              : "https://via.placeholder.com/400x300?text=No+Image";

            return (
              <li
                key={item._id}
                className="flex items-center justify-between bg-white rounded-xl shadow p-4 w-full"
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
                            (quantities[item._id] || 1) - 1
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
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                        className="px-2 py-1 bg-gray-200 rounded text-sm font-bold hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button className="text-sm text-red-500 hover:text-red-600 font-medium">
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="col-span-3">
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
      </div>
    </main>
  );
};

export default Cart;
