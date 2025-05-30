import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-5">
      <h2 className="text-xl font-bold mb-8">Restaurant Admin</h2>
      <ul className="space-y-4">
        <li className="hover:text-yellow-400 cursor-pointer">Dashboard</li>
        <li className="hover:text-yellow-400 cursor-pointer">
            <Link to="/admin/add-dish">Add Dish</Link>
        </li>
        <li className="hover:text-yellow-400 cursor-pointer">Orders</li>
        <li className="hover:text-yellow-400 cursor-pointer">Menu</li>
        <li className="hover:text-yellow-400 cursor-pointer">Reservations</li>
        <li className="hover:text-yellow-400 cursor-pointer">Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
