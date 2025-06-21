import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "antd";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/reservations`,
          {
            withCredentials: true,
          }
        );
        setReservations(res.data);
      } catch (err) {
        console.error("Failed to fetch reservations", err);
      }
    };

    fetchReservations();
  }, []);

  // Define columns for the table
  const columns = [
    {
      title: "Reserved By",
      dataIndex: ["user", "name"],
      key: "userName",
    },
    {
      title: "Email Reserved On",
      dataIndex: ["user", "email"],
      key: "userEmail",
    },
    {
      title: "Table Number",
      dataIndex: ["table", "tableNumber"],
      key: "tableNumber",
    },
    {
      title: "Total Seats",
      key: "tableNumber",
      render: (_, record) => record.table?.seats?.length ?? 0,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      render: (text) => new Date(text).toLocaleTimeString(),
    },
    {
      title: "Till",
      dataIndex: "till",
      key: "till",
      render: (text) => new Date(text).toLocaleTimeString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reservations</h2>
      <Table
        columns={columns}
        dataSource={reservations}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
