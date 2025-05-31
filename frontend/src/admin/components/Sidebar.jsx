import React from "react";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  FileAddOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  SettingOutlined,
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
      icon: <AppstoreOutlined />,
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

  const onClick = (e) => {
    console.log("Menu item clicked:", e);
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white p-4">
      <h2 className="text-xl font-bold mb-6 text-white text-center">
        Restaurant Admin
      </h2>
      <Menu
        onClick={onClick}
        style={{ width: "100%" }}
        mode="inline"
        theme="dark"
        items={items}
      />
    </div>
  );
}
