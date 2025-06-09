import React from "react";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  FileAddOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  SettingOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

export default function Sidebar() {
  const items = [
    {
      key: "dashboard",
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: "menu",
      icon: <CoffeeOutlined />,
      label: "Dishes",
      children: [
        {
          key: "add-dish",
          icon: <FileAddOutlined />,
          label: <Link to="/admin/add-dish">Add Dish</Link>,
        },
        {
          key: "view-dishes",
          icon: <UnorderedListOutlined />,
          label: <Link to="/admin/dishes">View Dishes</Link>,
        },
      ],
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: "Orders",
      children: [
        {
          key: "view-orders",
          icon: <UnorderedListOutlined />,
          label: <Link to="/admin/orders">View Orders</Link>,
        },
      ],
    },
    {
      key: "reservations",
      icon: <CalendarOutlined />,
      label: <Link to="/admin/reservations">Reservations</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Settings</Link>,
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-950 text-white p-4 z-50">
      <h2 className="text-xl font-bold mb-6 text-white text-center">
        Restaurant Admin
      </h2>
      <Menu mode="inline" theme="dark" items={items} style={{ border: "none" }} />
    </div>
  );
}
