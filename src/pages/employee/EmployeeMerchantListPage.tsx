import React, { useEffect, useState } from "react";
import { getMerchants, updateMerchant } from "@/api/apiService";
import { useAuth } from "@/contexts/AuthContext";

interface Merchant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  tinNumber: string;
  dtiSec: string;
}

const EmployeeMerchantListPage: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [formData, setFormData] = useState<Merchant | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const { userRole, roleLoading } = useAuth();
  const validRole = userRole ?? "employee"; // ✅ Ensures role is not null

  const fetchMerchants = async (page: number = 1, limit: number = 5) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMerchants(page, limit, "", validRole);
      console.log("✅ Full API Response:", response);

      if (!response || !response.merchants) {
        throw new Error("Invalid API response structure");
      }

      setMerchants(response.merchants);
      setTotalPages(response.pagination?.totalPages || 0);
    } catch (err) {
      console.error("❌ Error fetching merchants:", err);
      setError("Failed to fetch merchants. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (merchant: Merchant) => {
    setEditingMerchant(merchant);
    setFormData(merchant);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await updateMerchant(formData.id, formData);
      setMerchants((prev) =>
        prev.map((merchant) =>
          merchant.id === formData.id ? { ...formData } : merchant
        )
      );
      setEditingMerchant(null);
      alert("✅ Merchant updated successfully.");
    } catch (err) {
      console.error("❌ Error updating merchant:", err);
      alert("Failed to update merchant. Please try again.");
    }
  };

  if (roleLoading) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Merchant List</h2>
      {loading ? (
        <p>Loading merchants...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {/* Edit Form */}
          {editingMerchant && formData && (
            <div className="mb-4 p-4 border border-gray-300 rounded">
              <h3 className="text-xl font-semibold mb-2">Edit Merchant</h3>
              <form onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="First Name"
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Last Name"
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="Phone Number"
                  className="border p-2 w-full mb-2"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMerchant(null)}
                  className="ml-2 bg-gray-500 text-white px-4 py-1 rounded"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Merchants Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Phone</th>
                  <th className="border border-gray-300 px-4 py-2">TIN</th>
                  <th className="border border-gray-300 px-4 py-2">DTI/SEC</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {merchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">
                      {merchant.firstName} {merchant.lastName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {merchant.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {merchant.phoneNumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {merchant.tinNumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {merchant.dtiSec}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="mr-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleEdit(merchant)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              ⬅ Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              Next ➡
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeMerchantListPage;
