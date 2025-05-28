import { Outlet } from 'react-router-dom';

const Auth = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side with background image (visible on md and up) */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1950&q=80')`,
        }}
      >
        {/* Optional: overlay or branding */}
        <div className="h-full w-full bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold px-6">
            Gourmet Delight 🍽️
          </h1>
        </div>
      </div>

      {/* Right side (form section) */}
      <div className="flex flex-col w-full md:w-1/2 items-center justify-center p-6 bg-yellow-300">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:hidden">
            {/* Show title on small screens */}
            <h2 className="text-3xl font-bold text-gray-800">Welcome to Gourmet Delight 🍽️</h2>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Auth;
