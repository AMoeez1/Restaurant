import React from 'react';
import Sidebar from '../admin/components/Sidebar';
import Navbar from '../admin/components/navbar';;
import { Outlet } from 'react-router-dom';

function Admin() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100 min-h-screen">
        <Navbar />
        <Outlet/>
      </div>
    </div>
  );
}

export default Admin;
