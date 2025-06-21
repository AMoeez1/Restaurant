import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function ReservationsContent({ user, reservations, loading }) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Table Reservations</h3>

      {loading ? (
        <p className="text-gray-500">Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p className="text-gray-500">No reservations found.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((r) => (
            <li key={r._id} className="p-4 border rounded-md bg-gray-50 shadow-sm">
              <p className="text-sm text-gray-700">
                <strong>Table:</strong> {r.table?.tableNumber || 'N/A'} &nbsp; | &nbsp;
                <strong>Status:</strong> {r.status}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Date:</strong> {new Date(r.date).toLocaleDateString()} &nbsp; | &nbsp;
                <strong>From:</strong> {new Date(r.from).toLocaleTimeString()} &nbsp; | &nbsp;
                <strong>Till:</strong> {new Date(r.till).toLocaleTimeString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
