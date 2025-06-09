import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Select, Tag } from "antd";
import { toast } from "react-toastify";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

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

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;

    setStatusLoading(true);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${
          selectedOrder._id
        }/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      toast.success("Order status updated");
      setCurrentStatus(newStatus);

      const updatedOrder = res.data.order;
      setSelectedOrder(updatedOrder);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      message.error("Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-4">
        <div className="p-4 bg-blue-100 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold text-blue-600">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
        </div>

        <div className="p-4 bg-orange-100 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold text-orange-600">Pending Orders</h3>
          <p className="text-2xl font-bold text-orange-900">
            {
              orders.filter((order) => order.status.toLowerCase() === "pending")
                .length
            }
          </p>
        </div>

        <div className="p-4 bg-purple-100 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold text-purple-600">Processing Orders</h3>
          <p className="text-2xl font-bold text-purple-900">
            {
              orders.filter(
                (order) => order.status.toLowerCase() === "processing"
              ).length
            }
          </p>
        </div>

        <div className="p-4 bg-green-100 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold text-green-600">Delivered Orders</h3>
          <p className="text-2xl font-bold text-green-900">
            {
              orders.filter(
                (order) => order.status.toLowerCase() === "delivered"
              ).length
            }
          </p>
        </div>

        <div className="p-4 bg-red-100 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold text-red-600">Cancelled Orders</h3>
          <p className="text-2xl font-bold text-red-900">
            {
              orders.filter(
                (order) => order.status.toLowerCase() === "cancelled"
              ).length
            }
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b cursor-pointer">
                    Order Code
                  </th>
                  <th className="py-3 px-4 border-b cursor-pointer">
                    Customer
                  </th>
                  <th className="py-3 px-4 border-b cursor-pointer">Phone</th>
                  <th className="py-3 px-4 border-b cursor-pointer">Date</th>
                  <th className="py-3 px-4 border-b cursor-pointer">Items</th>
                  <th className="py-3 px-4 border-b cursor-pointer">Total</th>
                  <th className="py-3 px-4 border-b cursor-pointer">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openModal(order)}
                  >
                    <td className="py-2 px-4 border-b">#{order.order_code}</td>
                    <td className="py-2 px-4 border-b">{order.user.name}</td>
                    <td className="py-2 px-4 border-b">
                      {order.deliveryDetails.phone}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">{order.items.length}</td>
                    <td className="py-2 px-4 border-b">
                      Rs {order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`capitalize font-semibold ${
                          order.status === "delivered"
                            ? "text-green-600"
                            : order.status === "cancelled"
                            ? "text-red-500"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => openModal(order)}
                className="bg-white rounded border border-gray-200 shadow p-4 cursor-pointer"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">#{order.order_code}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">
                  <strong>Customer:</strong> {order.user.name}
                </p>
                <p className="text-sm">
                  <strong>Phone:</strong> {order.deliveryDetails.phone}
                </p>
                <p className="text-sm">
                  <strong>Items:</strong> {order.items.length}
                </p>
                <p className="text-sm font-semibold text-green-700">
                  Rs {order.totalAmount.toFixed(2)}
                </p>
                <p className="text-sm capitalize text-yellow-600">
                  {order.status}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        title={
          selectedOrder ? `Order #${selectedOrder.order_code}` : "Order Details"
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={700}
        styles={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {selectedOrder ? (
          <>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Customer:</strong> {selectedOrder.user.name}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.deliveryDetails.phone}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {selectedOrder.deliveryDetails.address.replace(/\n/g, ", ")},{" "}
              {selectedOrder.deliveryDetails.city}
            </p>

            <div className="mt-4">
              <strong>Items:</strong>
              <ul className="list-disc ml-5 max-h-60 overflow-auto mt-1">
                {selectedOrder.items.map((item) => (
                  <li
                    key={item._id}
                    className="mb-2 flex items-center space-x-3"
                  >
                    <img
                      src={`${
                        import.meta.env.VITE_BACKEND_URL
                      }/${item.dishId?.image_url?.replace(/\\/g, "/")}`}
                      alt={item.dishId.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      {item.dishId.name} × {item.quantity} (Rs{" "}
                      {item.priceAtPurchase.toFixed(2)})
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 font-semibold">
              Total: Rs {selectedOrder.totalAmount.toFixed(2)}
            </p>

            <div className="mt-4">
              <strong>Status: </strong>
              <Select
                value={currentStatus}
                onChange={handleStatusChange}
                loading={statusLoading}
                style={{ width: 160 }}
              >
                <Option value="pending">Pending</Option>
                <Option value="processing">Processing</Option>
                <Option value="delivered">Delivered</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </div>
          </>
        ) : (
          <p>Loading order details...</p>
        )}
      </Modal>
    </div>
  );
}
