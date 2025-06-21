import axios from "axios";
import React, { useState } from "react";
import {
  Popover,
  Modal,
  DatePicker,
  TimePicker,
  InputNumber,
  Form,
  Button,
  Select,
} from "antd";
import { toast } from "react-toastify";

export default function ReserveTableModal({ user, tables }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const selectedDate = Form.useWatch("date", form);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);

      const userId = user?._id;
      if (!userId) {
        console.error("User is not authenticated.");
        return;
      }

      const payload = {
        userId,
        tableId: values.tableId,
        date: values.date.format("YYYY-MM-DD"),
        from: values.time.format("HH:mm"),
        till: values.time.clone().add(1, "hour").format("HH:mm"),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/get-reservation`,
        payload,
        { withCredentials: true }
      );
      toast.success("Table Reserved Successfully");
      setIsModalOpen(false);
      form.resetFields();
    } catch (errorInfo) {
      console.error(
        "Reservation error:",
        errorInfo?.response?.data || errorInfo
      );
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  return (
    <>
      <button
        className="bg-white border border-yellow-500 hover:bg-yellow-100 text-yellow-600 px-6 py-3 rounded-md text-lg"
        onClick={showModal}
      >
        Book a Table
      </button>

      <Modal
        title="Reserve a Table"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Reserve"
        cancelText="Cancel"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="date"
            label="Reservation Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: "Please choose a time" }]}
          >
            <TimePicker className="w-full" format="HH:mm" />
          </Form.Item>

          <Form.Item
            name="tableId"
            label="Select Table"
            rules={[{ required: true, message: "Please select a table" }]}
          >
            <Select
              placeholder="Select a table"
              options={tables.map((table) => ({
                label: `Table ${table.tableNumber} - Seats: ${table.seats.length}`,
                value: table._id,
              }))}
              showSearch
              optionFilterProp="label"
              className="w-full"
              disabled={!selectedDate}
            />
          </Form.Item>

          <Form.Item
            name="guests"
            label="Number of Guests"
            rules={[
              { required: true, message: "Please enter number of guests" },
            ]}
          >
            <InputNumber className="w-full" min={1} max={20} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
