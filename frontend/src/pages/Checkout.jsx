import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Form, Input, Button, Spin, Radio } from "antd";
import useGetUserDetail from "../hooks/useGetUserDetail";
import StylishLoader from "../hooks/useLoader";
import { MdOutlineAttachMoney, MdPayments } from "react-icons/md";
import { AiOutlineCreditCard } from "react-icons/ai";
import { RiBankLine, RiWallet3Line } from "react-icons/ri";
import { FaGooglePay } from "react-icons/fa"; // Google Pay icon
import { PaymentMethodModal } from "../components/PaymentMethodModal";
import { useState } from "react";
import { useEffect } from "react";

const Checkout = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedItems } = location.state || {};

  const { user, loading: userLoading, error: userError } = useGetUserDetail();
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [modalVisible, setModalVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [modalForm] = Form.useForm();

  const handleModalOk = () => {
    modalForm.validateFields().then((values) => {
      if (!termsAccepted) {
        message.warning("Please accept terms & conditions.");
        return;
      }
      console.log("Payment info:", values);
      setModalVisible(false);
      modalForm.resetFields();
      setTermsAccepted(false);
    });
  };
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

  useEffect(() => {
  if (selectedPayment !== "cod") {
    setModalVisible(true);
    modalForm.resetFields();
    setTermsAccepted(false);
  }
}, [selectedPayment]);


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

<Form.Item
  label="Payment Method"
  name="paymentMethod"
  rules={[{ required: true, message: "Please select a payment method" }]}
>
  <Radio.Group
    className="flex flex-wrap gap-4"
    onChange={(e) => {
      const value = e.target.value;
      setSelectedPayment(value);
      if (value !== "cod") {
        setModalVisible(true);
      } else {
        setModalVisible(false);
      }
    }}
  >
    <Radio value="cod" className="!p-0">
      <div className="flex items-center gap-2 p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
        <MdOutlineAttachMoney className="text-xl text-green-600" />
        <span className="font-medium">Cash on Delivery</span>
      </div>
    </Radio>

    <Radio value="card" className="!p-0">
      <div className="flex items-center gap-2 p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
        <AiOutlineCreditCard className="text-xl text-blue-500" />
        <span className="font-medium">Credit / Debit Card</span>
      </div>
    </Radio>

    <Radio value="easypaisa" className="!p-0">
      <div className="flex items-center gap-2 p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
        <RiWallet3Line className="text-xl text-green-500" />
        <span className="font-medium">Wallets</span>
      </div>
    </Radio>

    <Radio value="gpay" className="!p-0">
      <div className="flex items-center gap-2 p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
        <FaGooglePay className="text-xl text-indigo-600" />
        <span className="font-medium">Google Pay</span>
      </div>
    </Radio>

    <Radio value="netbanking" className="!p-0">
      <div className="flex items-center gap-2 p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
        <RiBankLine className="text-xl text-yellow-600" />
        <span className="font-medium">Bank Transfer</span>
      </div>
    </Radio>
  </Radio.Group>
</Form.Item>

           <PaymentMethodModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedPayment={selectedPayment}
        handleModalOk={handleModalOk}
        modalForm={modalForm}
        termsAccepted={termsAccepted}
        setTermsAccepted={setTermsAccepted}
      />

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
