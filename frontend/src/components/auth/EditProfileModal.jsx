import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

function EditProfileModal({ user }) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [iniVals, setIniVals] = useState({ name: "", email: "" });

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

  const handleFinish = async (values) => {
     const { name, email } = values;

    if (name === iniVals.name && email === iniVals.email) {
      toast.info("No changes detected to update.");
      return;
    }
    setConfirmLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/profile`,
        values,
        { withCredentials: true }
      );
      toast.success(res.data.message || "Profile Updated Successfully");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
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
