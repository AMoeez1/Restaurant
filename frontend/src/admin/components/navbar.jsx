import React from 'react';

const Navbar = () => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div>
        <span className="mr-4">Admin</span>
        <button className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
