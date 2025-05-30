import React, { useState } from "react";
import { Form, Input, InputNumber, Switch, Button, message } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddDish() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/add-dish`,
        values,
        {
          withCredentials: true,
        }
      );
      toast.success("Dish added successfully!");
      navigate("/admin/dashboard");
      form.resetFields();
    } catch (err) {
      message.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 shadow rounded">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Add New Dish
        </h2>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ is_available: true }}
        >
          <Form.Item
            name="name"
            label="Dish Name"
            rules={[{ required: true, message: "Please enter the dish name" }]}
          >
            <Input placeholder="e.g. Margherita Pizza" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Optional description" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (Rs)"
            rules={[{ required: true, message: "Enter a valid price" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="e.g. Rs 999"
            />
          </Form.Item>

          <Form.Item name="image_url" label="Image URL">
            <Input placeholder="https://example.com/dish.jpg" />
          </Form.Item>

          {/* <Form.Item
        name="is_available"
        label="Available?"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Add Dish
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
