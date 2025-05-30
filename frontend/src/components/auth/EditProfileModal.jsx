import React, { useRef, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { CameraOutlined } from "@ant-design/icons";

function EditProfileModal({ user }) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [iniVals, setIniVals] = useState({ name: "", email: "" });
  const [hovered, setHovered] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  const showModal = () => {
    setOpen(true);
    setIniVals({ name: user.name, email: user.email });
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFinish = async (values) => {
    const { name, email } = values;

    const hasChanged =
      name !== iniVals.name || email !== iniVals.email || selectedFile !== null;

    if (!hasChanged) {
      toast.info("No changes detected to be update.");
      return;
    }
    setConfirmLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/profile`,
        values,
        { withCredentials: true }
      );

      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/upload-avatar`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      setOpen(false);
      window.location.reload();
      toast.success(res.data.message || "Profile Updated Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setConfirmLoading(false);
    }
  };

  const previewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : user?.avatar
    ? `${import.meta.env.VITE_BACKEND_URL}/${user.avatar.replace(/\\/g, "/")}`
    : "https://cdn-icons-png.flaticon.com/512/1077/1077114.png";

  return (
    <>
      {/* <ProfileImage /> */}
      <button
        onClick={showModal}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded"
      >
        Edit Profile
      </button>
      <Modal
        title="Edit Profile"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <div
          className="relative w-32 h-32 mx-auto rounded-full cursor-pointer overflow-hidden"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleImageClick}
          title="Change profile picture"
        >
          <img
            src={previewUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />

          {hovered && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full">
              <CameraOutlined style={{ fontSize: 28, color: "white" }} />
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <Form
          form={form}
          layout="vertical"
          name="edit_profile_form"
          initialValues={{
            name: user.name,
            email: user.email,
          }}
          onFinish={handleFinish}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                validator: (_, value) => {
                  const email = form.getFieldValue("email");
                  if (value || email) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Please enter at least name or email")
                  );
                },
              },
            ]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                validator: (_, value) => {
                  const name = form.getFieldValue("name");
                  if (value || name) {
                    if (
                      value &&
                      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
                    ) {
                      return Promise.reject(
                        new Error("Please enter a valid email")
                      );
                    }
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Please enter at least name or email")
                  );
                },
              },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditProfileModal;
