import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {

  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        values, {
          withCredentials: true
        }
      );
      toast.success(res.data.message || "Login successful");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Welcome Back 🍽️
      </h2>

      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
            {
              type: "email",
              message: "Please enter a valid email!",
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
            Log In
          </Button>
        </Form.Item>
      </Form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don&apos;t have an account?{" "}
        <Link to={"/register"} className="text-yellow-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
