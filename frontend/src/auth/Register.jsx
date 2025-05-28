import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Checkbox, Form, Input, message } from "antd";
import { toast } from "react-toastify";

const Register = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await axios.post(`${backendUrl}/register`,values);
      toast.success(res.data.message || "Registered successfully!");
      navigate('/login');
    } catch (error) {
      toast.error(error.response.data.message || "Registration failed.");
    }
  }; 

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Create an Account 🍽️
      </h2>

      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        scrollToFirstError
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your full name!",
            },
          ]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input placeholder="you@example.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters.",
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-yellow-500 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600"
          >
            Register
          </Button>
        </Form.Item>
      </Form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link to={"/login"} className="text-yellow-600 hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Register;
