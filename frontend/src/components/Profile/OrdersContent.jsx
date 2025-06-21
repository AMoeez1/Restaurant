import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Pagination } from "antd";

export default function OrdersContent({
  user,
  orders,
  ordersLoading,
  setOrders,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = orders.slice(startIndex, startIndex + pageSize);

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Orders</h3>

      {ordersLoading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {paginatedOrders.map((order) => (
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

          <div className="flex justify-center pt-6">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={orders.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
