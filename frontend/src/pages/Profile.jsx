import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Skeleton } from "antd";
import useCheckAuth from "../hooks/useCheckAuth";
import useGetUserDetail from "../hooks/useGetUserDetail";
import EditProfileModal from "../components/auth/EditProfileModal";

function Profile() {
  const navigate = useNavigate();
  const isAuthenticated = useCheckAuth();
  const { user, loading, error } = useGetUserDetail();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.warning("You cannot have access to this route until login");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user && user._id) {
      const getOrders = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/orders/${user._id}`,
            { withCredentials: true }
          );
          setOrders(res.data);
        } catch (err) {
          toast.error("Failed to load orders");
        } finally {
          setOrdersLoading(false);
        }
      };

      getOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <Skeleton.Avatar
          active
          size={120}
          style={{ margin: "0 auto", marginBottom: 16 }}
        />
        <Skeleton active title={false} paragraph={{ rows: 1, width: "60%" }} />
        <Skeleton.Input active style={{ width: 200, marginBottom: 20 }} />

        <div className="mt-8 flex justify-center gap-4">
          <Skeleton.Button active style={{ width: 120 }} />
          <Skeleton.Button active style={{ width: 120 }} />
        </div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data || "Logout failed");
    }
  };

  if (!user) return null;

  const profileUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg shadow-xl mt-6">
      {/* Profile Section */}
      <div className="text-center border-b pb-6">
        {user.avatar ? (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/${user.avatar.replace(
              /\\/g,
              "/"
            )}`}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto border-4 border-indigo-500"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
            alt="User Avatar"
            className="w-32 h-32 rounded-full mx-auto border-4 border-indigo-500"
          />
        )}

        <h2 className="text-3xl font-bold text-gray-900 mt-4">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>

        <div className="mt-6 flex justify-center gap-4">
          <EditProfileModal user={profileUser} />
          <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Your Orders
        </h3>

        {ordersLoading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {/* {orders.map((order) => (
              <div
                key={order._id}
                className="border-l-4 border-indigo-500 bg-gray-50 p-5 rounded-md shadow-sm hover:shadow transition"
              >
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <p className="text-lg font-semibold text-indigo-700 mb-1">
                      Order Code:{" "}
                      <span className="text-gray-900">{order.order_code}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-3">
                      <p className="font-medium text-gray-700 mb-1">Items:</p>
                      <ul className="text-sm text-gray-600 space-y-3 mt-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/${item.dishId?.image_url?.replace(/\\/g, "/")}`}
                              alt={item.dishId?.name || "Dish"}
                              className="w-12 h-12 rounded object-cover border"
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.dishId?.name || "Unknown Dish"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity} &nbsp; | &nbsp; Price:
                                Rs {item.priceAtPurchase.toFixed()}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-right mt-4 sm:mt-0 sm:ml-6">
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-semibold capitalize ${
                          order.status === "delivered"
                            ? "text-green-600"
                            : order.status === "cancelled"
                            ? "text-red-500"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-sm mt-1">
                      Total:{" "}
                      <span className="font-semibold">
                        {order.totalAmount.toFixed()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))} */}

            {orders.map((order) => (
              <div
                key={order._id}
                className="border-l-4 border-indigo-500 bg-gray-50 p-5 rounded-md shadow-sm hover:shadow transition"
              >
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <p className="text-lg font-semibold text-indigo-700 mb-1">
                      Order Code:{" "}
                      <span className="text-gray-900">{order.order_code}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-3">
                      <p className="font-medium text-gray-700 mb-1">Items:</p>
                      <ul className="text-sm text-gray-600 space-y-3 mt-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/${item.dishId?.image_url?.replace(/\\/g, "/")}`}
                              alt={item.dishId?.name || "Dish"}
                              className="w-12 h-12 rounded object-cover border"
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.dishId?.name || "Unknown Dish"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity} &nbsp; | &nbsp; Price:
                                Rs {item.priceAtPurchase.toFixed()}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-right mt-4 sm:mt-0 sm:ml-6">
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-semibold capitalize ${
                          order.status === "delivered"
                            ? "text-green-600"
                            : order.status === "cancelled"
                            ? "text-red-500"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-sm mt-1">
                      Total:{" "}
                      <span className="font-semibold">
                        {order.totalAmount.toFixed()}
                      </span>
                    </p>

                    {order.status !== "cancelled" &&
                      order.status !== "delivered" && (
                        <button
                          onClick={async () => {
                            try {
                              await axios.patch(
                                `${import.meta.env.VITE_BACKEND_URL}/orders/${
                                  order._id
                                }/status`,
                                { status: "cancelled" },
                                { withCredentials: true }
                              );
                              toast.success("Order cancelled successfully");
                              setOrders((prevOrders) =>
                                prevOrders.map((o) =>
                                  o._id === order._id
                                    ? { ...o, status: "cancelled" }
                                    : o
                                )
                              );
                            } catch {
                              toast.error("Failed to cancel order");
                            }
                          }}
                          className="mt-4 inline-block bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Cancel Order
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
