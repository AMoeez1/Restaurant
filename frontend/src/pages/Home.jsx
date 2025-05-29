import React from "react";

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-yellow-50 py-20 px-4 text-center">
        <h1 className="text-5xl font-extrabold text-yellow-600 mb-4">Welcome to Gourmet Delight</h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
          Experience a symphony of flavors, expertly crafted by our award-winning chefs.
        </p>
        <div className="space-x-4">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md text-lg">
            Explore Menu
          </button>
          <button className="bg-white border border-yellow-500 hover:bg-yellow-100 text-yellow-600 px-6 py-3 rounded-md text-lg">
            Book a Table
          </button>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Chef’s Specials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Grilled Salmon",
              description: "Fresh Atlantic salmon grilled to perfection with herbs and lemon.",
            },
            {
              title: "Truffle Pasta",
              description: "Creamy fettuccine tossed with shaved truffle and parmesan.",
            },
            {
              title: "Signature Burger",
              description: "Juicy beef patty topped with cheddar, pickles, and our secret sauce.",
            },
          ].map((dish, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-yellow-600 mb-2">{dish.title}</h3>
              <p className="text-gray-600">{dish.description}</p>
              <img src="https://source.unsplash.com/400x300/?food" alt="Dish" className="w-full h-48 object-cover rounded-md mb-4" />
            </div>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            At Gourmet Delight, we blend tradition with innovation. Our journey began with a simple
            passion — to deliver unforgettable dining experiences. From locally sourced ingredients to
            world-class culinary techniques, we serve food that celebrates taste, creativity, and
            connection.
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-yellow-500 text-white py-12 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience Gourmet?</h2>
        <p className="mb-6 text-lg">Reserve your table now and savor the extraordinary.</p>
        <button className="bg-white text-yellow-600 px-6 py-3 rounded-md font-semibold hover:bg-yellow-100">
          Book Now
        </button>
      </section>
    </div>
  );
};

export default Home;
