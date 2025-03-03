import React, { useEffect, useState } from "react";
import { getRiders, updateRider, deleteRider } from "@/api/apiService";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/constants/UserRole"; // ✅ Ensure correct import

interface Rider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  plateNumber: string;
  vehicleUnit: string;
}

const RiderListPage: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Rider | null>(null);
  const [editingRider, setEditingRider] = useState<Rider | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const { userRole, roleLoading } = useAuth();

  // ✅ Ensure valid role is always set
  const validRole: "admin" | "employee" =
    userRole === UserRole.Admin
      ? "admin"
      : userRole === UserRole.Employee
      ? "employee"
      : "employee"; // Default to employee for safety

  /**
   * ✅ Fetch Riders List
   */
  const fetchRiders = async (page: number = 1, limit: number = 5) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRiders(page, limit, "", validRole);
      console.log("✅ Full API Response:", response);

      if (!response || !Array.isArray(response.riders)) {
        throw new Error("Invalid API response structure or no riders found.");
      }

      setRiders(response.riders);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      console.error("❌ Error fetching riders:", err);
      setError("Failed to fetch riders. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!roleLoading) {
      fetchRiders(currentPage);
    }
  }, [currentPage, roleLoading]);

  /**
   * ✅ Handle Pagination (Ensuring this function is used)
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchRiders(page);
    }
  };

  /**
   * ✅ Edit Rider
   */
  const handleEdit = (rider: Rider) => {
    setEditingRider(rider);
    setFormData(rider);
  };

  /**
   * ✅ Update Rider
   */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await updateRider(formData.id, formData);
      setRiders((prev) =>
        prev.map((rider) =>
          rider.id === formData.id ? { ...formData } : rider
        )
      );
      setEditingRider(null);
      alert("Rider updated successfully.");
    } catch (err) {
      console.error("❌ Error updating rider:", err);
      alert("Failed to update rider. Please try again.");
    }
  };

  /**
   * ✅ Delete Rider
   */
  const handleDelete = async (id: string) => {
    if (!validRole) return;

    if (window.confirm("Are you sure you want to delete this rider?")) {
      try {
        await deleteRider(id, validRole);
        setRiders((prev) => prev.filter((rider) => rider.id !== id));
        alert("Rider deleted successfully.");
      } catch (err) {
        console.error("❌ Error deleting rider:", err);
        alert("Failed to delete rider. Please try again.");
      }
    }
  };

  if (roleLoading) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Rider List</h2>
      {loading ? (
        <p>Loading riders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {/* ✅ Riders Table */}
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Plate</th>
                <th className="border px-4 py-2">Vehicle</th>
                {validRole === "admin" && (
                  <th className="border px-4 py-2">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">
                    {rider.firstName} {rider.lastName}
                  </td>
                  <td className="border px-4 py-2">{rider.email}</td>
                  <td className="border px-4 py-2">{rider.phoneNumber}</td>
                  <td className="border px-4 py-2">{rider.address}</td>
                  <td className="border px-4 py-2">{rider.plateNumber}</td>
                  <td className="border px-4 py-2">{rider.vehicleUnit}</td>
                  {validRole === "admin" && (
                    <td className="border px-4 py-2">
                      <button
                        className="mr-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleEdit(rider)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDelete(rider.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Pagination - Ensuring `handlePageChange` is used */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded-md"
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ✅ Restore Edit Form */}
      {editingRider && (
        <form
          onSubmit={handleFormSubmit}
          className="mt-6 bg-gray-100 p-4 rounded"
        >
          <h3 className="text-xl font-bold mb-4">Edit Rider</h3>
          <input
            type="text"
            value={formData?.firstName || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev!, firstName: e.target.value }))
            }
            placeholder="First Name"
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
};

export default RiderListPage;
