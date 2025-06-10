import React from 'react';
import useGetTables from '../../hooks/useGetTables';

export default function Tables() {
  const { tables, available, loading, error } = useGetTables();

  if (loading) return <p>Loading tables...</p>;
  if (error) return <p>Error fetching tables: {error.message}</p>;

  return (
    <div className="bg-white p-6 shadow rounded overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">All Tables</h2>

      {tables.length === 0 ? (
        <p>No tables found.</p>
      ) : (
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">Table Number</th>
              <th className="text-left px-4 py-2 border-b">Available</th>
              <th className="text-left px-4 py-2 border-b">Total Seats</th>
              <th className="text-left px-4 py-2 border-b">Reserved By</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{table.tableNumber}</td>
                <td className="px-4 py-2 border-b">{table.isAvailable ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border-b">{table.seats.length}</td>
                
                <td className="px-4 py-2 border-b">
                  {table.reservedBy?.name || table.reservedBy?.email || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
