import React from "react";
import { Pagination, Tabs } from "antd";
import OrdersContent from "./OrdersContent";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import ReservationsContent from "./ReservationsContent";
export default function ProfileTabs({ user }) {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);

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

  useEffect(() => {
    const fetchUsersReservations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/get-table-reservations/${
            user._id
          }`,
          { withCredentials: true }
        );
        setReservations(res.data);
        console.log(res.data, user._id);
        
      } catch (err) {
        console.error("Failed to fetch user reservations", err);
      } finally {
        setLoading(false);
      }
    };

      fetchUsersReservations();
  }, [user]);

  const items = [
    {
      key: "1",
      label: "Orders",
      children: (
        <OrdersContent
          orders={orders}
          user={user}
          ordersLoading={ordersLoading}
          setOrders={setOrders}
        />
      ),
    },
    {
      key: "2",
      label: "Reservations",
      children: <ReservationsContent user={user} reservations={reservations} loading={loading} />,
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3",
    },
  ];
  return (
    <>
    <Tabs defaultActiveKey="1" items={items} />
    </>

  )
}
