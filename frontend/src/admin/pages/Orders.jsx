import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/orders`,
          {
            withCredentials: true,
          }
        );
        setOrders(res.data.orders);
        setCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Total Orders ({count})</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded shadow p-3 bg-white text-sm"
            >
              <div className="mb-1 flex justify-between items-center">
                <h3 className="font-medium">#{order.order_code}</h3>
                <span className="text-gray-500 text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mb-1 flex justify-between items-center">
                <p className="mb-1">
                  <strong>Customer:</strong> {order.user.name}
                </p>
                <p className="mb-1">
                  <strong>Phone:</strong> {order.deliveryDetails.phone}
                </p>
              </div>

              <div className="mb-1 flex justify-between items-center">
                <div className="mb-1">
                  <strong>Items:</strong>
                  <ul className="list-disc ml-4">
                    {order.items.map((item) => (
                      <li key={item._id}>
                        {item.dishId.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="font-semibold text-green-700">
                  Rs {order.totalAmount.toFixed(2)}
                </p>
              </div>

              <p className="mb-1">
                <strong>Address:</strong>{" "}
                {order.deliveryDetails.address.replace(/\n/g, ", ")},{" "}
                {order.deliveryDetails.city}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize text-yellow-600">
                  {order.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
