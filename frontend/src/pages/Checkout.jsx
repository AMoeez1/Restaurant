import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Form, Input, Button, Spin } from "antd";
import useGetUserDetail from "../hooks/useGetUserDetail";
import StylishLoader from "../hooks/useLoader";

const Checkout = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedItems } = location.state || {};

  const { user, loading: userLoading, error: userError } = useGetUserDetail();

  const handleSubmit = async (values) => {
    if (!user?._id) {
      toast.error("User not authenticated!");
      return;
    }

    if (!selectedItems || selectedItems.length === 0) {
      toast.error("No selected items to place order.");
      return;
    }

    try {
      // Update user profile
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/profile`,
        {
          userId: user._id,
          name: values.name,
          email: user.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
        },
        { withCredentials: true }
      );

      // Place order
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/place-order`,
        {
          userId: user._id,
          deliveryDetails: {
            name: values.name,
            phone: values.phone,
            address: values.address,
            city: values.city,
            postalCode: values.postalCode,
          },
          items: selectedItems.map((item) => ({
            dishId: item.dishId._id,
            quantity: item.quantity,
          })),
        },
        { withCredentials: true }
      );

      toast.success("Order placed successfully!");
      navigate("/cart");
    } catch (err) {
      toast.error("Failed to update profile or place order");
      console.error(err);
    }
  };

  // if (userLoading)
  //   return (
  //     <div style={{ display: "flex", justifyContent: "center", marginTop: 50, height: '80vh', alignItems: 'center' }}>
  //       <Spin size="large" tip="Loading dishes..." />
  //     </div>
  //   );

    if (userLoading) return <StylishLoader />;

  if (userError) return <div className="p-6 text-red-500">{userError}</div>;

  if (!selectedItems || selectedItems.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        No selected items for checkout.
      </div>
    );
  }

  const totalPrice = selectedItems.reduce((acc, item) => {
    const dish = item.dishId;
    const discount = dish.disc_per || 0;
    const discounted = dish.price - (dish.price * discount) / 100;
    return acc + discounted * item.quantity;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-yellow-600">Checkout</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: user?.name || "",
          phone: user?.phone || "",
          address: user?.address || "",
          city: user?.city || "",
          postalCode: user?.postalCode || "",
        }}
        className="mb-10"
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input placeholder="Full Name" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please enter your phone number" },
          ]}
        >
          <Input type="tel" placeholder="Phone Number" />
        </Form.Item>

        <Form.Item
          label="Delivery Address"
          name="address"
          rules={[{ required: true, message: "Please enter your address" }]}
        >
          <Input.TextArea placeholder="Delivery Address" rows={3} />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: "Please enter your city" }]}
        >
          <Input placeholder="City" />
        </Form.Item>

        <Form.Item
          label="Postal Code"
          name="postalCode"
          rules={[{ required: true, message: "Please enter your postal code" }]}
        >
          <Input placeholder="Postal Code" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Place Order
          </Button>
        </Form.Item>
      </Form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <ul className="divide-y">
          {selectedItems.map((item) => {
            const dish = item.dishId;
            const discount = dish.disc_per || 0;
            const finalPrice = Math.round(
              dish.price - (dish.price * discount) / 100
            );

            return (
              <li key={item._id} className="py-3 flex justify-between">
                <span>
                  {dish.name} × {item.quantity}
                </span>
                <span>₹{finalPrice * item.quantity}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-lg font-bold text-green-600">
          Total: ₹{totalPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default Checkout;
