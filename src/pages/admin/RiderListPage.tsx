import React, { useEffect, useState } from "react";
import { getRiders, updateRider, deleteRider } from "@/api/apiService"; // Ensure this path is correct

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
  const [editingRider, setEditingRider] = useState<Rider | null>(null);
  const [formData, setFormData] = useState<Rider | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchRiders = async (page: number = 1, limit: number = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRiders(page, limit);
      setRiders(response.data.riders || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching riders:", err);
      setError("Failed to fetch riders. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (rider: Rider) => {
    setEditingRider(rider);
    setFormData(rider);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this rider?")) {
      try {
        await deleteRider(id);
        setRiders((prev) => prev.filter((rider) => rider.id !== id));
        alert("Rider deleted successfully.");
      } catch (err) {
        console.error("Error deleting rider:", err);
        alert("Failed to delete rider. Please try again.");
      }
    }
  };

  const validateFormData = () => {
    if (!formData?.firstName || !formData?.lastName || !formData?.email) {
      alert("Please fill out all required fields.");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !validateFormData()) return;

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
      console.error("Error updating rider:", err);
      alert("Failed to update rider. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Rider List</h2>
      {loading ? (
        <p>Loading riders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Phone</th>
                  <th className="border border-gray-300 px-4 py-2">Address</th>
                  <th className="border border-gray-300 px-4 py-2">Plate</th>
                  <th className="border border-gray-300 px-4 py-2">Vehicle</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {riders.map((rider) => (
                  <tr key={rider.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">
                      {rider.firstName} {rider.lastName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {rider.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {rider.phoneNumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {rider.address}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {rider.plateNumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {rider.vehicleUnit}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => handlePageChange(1)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === 1
                  ? "bg-gray-400"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === 1
                  ? "bg-gray-400"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-400"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-400"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      )}

      {editingRider && (
        <form
          onSubmit={handleFormSubmit}
          className="mt-6 bg-gray-100 p-4 rounded"
        >
          <h3 className="text-xl font-bold mb-4">Edit Rider</h3>
          <div className="space-y-2">
            <input
              type="text"
              name="firstName"
              value={formData?.firstName || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev!, firstName: e.target.value }))
              }
              placeholder="First Name"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              name="lastName"
              value={formData?.lastName || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev!, lastName: e.target.value }))
              }
              placeholder="Last Name"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="email"
              name="email"
              value={formData?.email || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev!, email: e.target.value }))
              }
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              name="phoneNumber"
              value={formData?.phoneNumber || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev!,
                  phoneNumber: e.target.value,
                }))
              }
              placeholder="Phone Number"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              name="address"
              value={formData?.address || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev!, address: e.target.value }))
              }
              placeholder="Address"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              name="plateNumber"
              value={formData?.plateNumber || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev!,
                  plateNumber: e.target.value,
                }))
              }
              placeholder="Plate Number"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              name="vehicleUnit"
              value={formData?.vehicleUnit || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev!,
                  vehicleUnit: e.target.value,
                }))
              }
              placeholder="Vehicle Unit"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={() => setEditingRider(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RiderListPage;
