import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Switch, Button, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const { TextArea } = Input;

export default function EditDish({ initialValues, onSubmit }) {
  const [form] = Form.useForm();
  const { dish_id, dish_code } = useParams();
  
  const navigate = useNavigate();

  const fetchDishDetails = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/update-dish/${dish_id}`,
      {
        withCredentials: true,
      }
    );
    form.setFieldsValue(res.data);
  };

  useEffect(() => {
    fetchDishDetails();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleFinish = async (values) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/update-dish/${dish_id}`,
        values,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      toast.success(res.data.message)
      navigate(`/admin/dish/${dish_code}/${dish_id}`)
    } catch (err) {}
  };

  const onFinish = () => {
    console.log("vals");
  };

  const daysOfWeek = [
    "Not Special",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const foodTypes = [
    "Salad",
    "Dinner",
    "Breakfast",
    "Brunch",
    "Lunch",
    "Starter",
    "Dessert",
    "Desi",
    "Chinese",
    "Italian",
    "French",
    "Spanish",
    "Thai",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 shadow rounded">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Dish</h2>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFinish}
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

          <div className="flex justify-between">
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
            <Form.Item name="disc_per" label="Discounted Price in %  ">
              <InputNumber
                min={0}
                max={99}
                style={{ width: "100%" }}
                placeholder="Add the discount in percentage"
              />
            </Form.Item>
          </div>

          <Form.Item name="day_special" label="Day Special">
            <Select placeholder="Please Select the speciality of the specific day">
              {daysOfWeek.map((day) => (
                <Select.Option key={day} value={day}>
                  {day}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="food_type" label="Category Food">
            <Select placeholder="Select a category food">
              {foodTypes.map((type) => (
                <Select.Option
                  key={type}
                  value={type}
                  rules={[
                    {
                      required: true,
                      message: "Please select category of the food",
                    },
                  ]}
                >
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="image_url" label="Image URL">
            <Input placeholder="https://example.com/dish.jpg" />
          </Form.Item>

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
