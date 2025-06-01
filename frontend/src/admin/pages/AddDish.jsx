// import React, { useState } from "react";
// import {
//   Form,
//   Input,
//   InputNumber,
//   Switch,
//   Button,
//   message,
//   Select,
// } from "antd";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export default function AddDish() {
//   const [form] = Form.useForm();

//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       const response = axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/admin/add-dish`,
//         values,
//         {
//           withCredentials: true,
//         }
//       );
//       toast.success("Dish added successfully!");
//       navigate("/admin/dashboard");
//       form.resetFields();
//     } catch (err) {
//       message.error(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const daysOfWeek = [
//     "Not Special",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];

//   const foodTypes = [
//     "Salad",
//     "Dinner",
//     "Breakfast",
//     "Brunch",
//     "Lunch",
//     "Starter",
//     "Dessert",
//     "Desi",
//     "Chinese",
//     "Italian",
//     "French",
//     "Spanish",
//     "Thai",
//   ];

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white p-8 shadow rounded">
//         <h2 className="text-2xl font-semibold mb-6 text-center">
//           Add New Dish
//         </h2>
//         <Form
//           layout="vertical"
//           form={form}
//           onFinish={onFinish}
//           initialValues={{ is_available: true }}
//         >
//           <Form.Item
//             name="name"
//             label="Dish Name"
//             rules={[{ required: true, message: "Please enter the dish name" }]}
//           >
//             <Input placeholder="e.g. Margherita Pizza" />
//           </Form.Item>

//           <Form.Item name="description" label="Description">
//             <Input.TextArea rows={3} placeholder="Optional description" />
//           </Form.Item>

//           <div className="flex justify-between">
//             <Form.Item
//               name="price"
//               label="Price (Rs)"
//               rules={[{ required: true, message: "Enter a valid price" }]}
//             >
//               <InputNumber
//                 min={0}
//                 style={{ width: "100%" }}
//                 placeholder="e.g. Rs 999"
//               />
//             </Form.Item>
//             <Form.Item
//               name="disc_per"
//               label="Discounted Price in %  "
//             >
//               <InputNumber
//                 min={0}
//                 max={99}
//                 style={{ width: "100%" }}
//                 placeholder="Add the discount in percentage"
//               />
//             </Form.Item>
//           </div>

//           <Form.Item name="day_special" label="Day Special">
//             <Select placeholder="Please Select the speciality of the specific day">
//               {daysOfWeek.map((day) => (
//                 <Select.Option key={day} value={day}>
//                   {day}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item name="food_type" label="Category Food">
//             <Select placeholder="Select a category food">
//               {foodTypes.map((type) => (
//                 <Select.Option
//                   key={type}
//                   value={type}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please select category of the food",
//                     },
//                   ]}
//                 >
//                   {type}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item name="image_url" label="Image URL">
//             <Input placeholder="https://example.com/dish.jpg" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" className="w-full">
//               Add Dish
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// }
import React, { useRef, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Select,
} from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddDish() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Prepare FormData
      const formData = new FormData();

      // Append all form fields
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append image file if selected
      if (selectedFile) {
        formData.append("image", selectedFile);
      } else {
        message.error("Please upload an image.");
        setLoading(false);
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/add-dish`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Dish added successfully!");
      form.resetFields();
      setSelectedFile(null);
      navigate("/admin/dashboard");
    } catch (err) {
      message.error(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 shadow rounded">
        <h2 className="text-2xl font-semibold mb-6 text-center">Add New Dish</h2>
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

          <div className="flex justify-between">
            <Form.Item
              name="price"
              label="Price (Rs)"
              rules={[{ required: true, message: "Enter a valid price" }]}
              style={{ width: "48%" }}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. Rs 999" />
            </Form.Item>

            <Form.Item
              name="disc_per"
              label="Discounted Price in %"
              style={{ width: "48%" }}
            >
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

          <Form.Item
            name="food_type"
            label="Category Food"
            rules={[{ required: true, message: "Please select category of the food" }]}
          >
            <Select placeholder="Select a category food">
              {foodTypes.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Image upload */}
          <Form.Item label="Dish Image" required>
            <div
              className="w-40 h-40 mx-auto mb-4 border border-gray-300 rounded cursor-pointer overflow-hidden flex items-center justify-center"
              onClick={handleImageClick}
              title="Click to select image"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Dish preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400">Click to upload image</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Add Dish
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
