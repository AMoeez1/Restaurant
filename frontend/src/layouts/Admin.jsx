import React from 'react';
import Sidebar from '../admin/components/Sidebar';
import Navbar from '../admin/components/navbar';;
import { Outlet } from 'react-router-dom';

function Admin() {
  return (
   <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="fixed top-0 left-64 right-0 z-40 bg-white shadow-md">
          <Navbar />
        </div>
        <main className="pt-16 p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Admin;
