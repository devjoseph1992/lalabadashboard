import React, { useEffect, useState } from "react";
import { getMerchants, updateMerchant, deleteMerchant } from "@/api/apiService";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/constants/UserRole"; // Ensure correct import

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

const MerchantListPage: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [formData, setFormData] = useState<Merchant | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const { userRole, roleLoading } = useAuth();

  // ✅ Ensure valid role is always set (Fix TypeScript error)
  const validRole: "admin" | "employee" =
    userRole === UserRole.Admin
      ? "admin"
      : userRole === UserRole.Employee
      ? "employee"
      : "employee"; // Default to employee for safety

  const fetchMerchants = async (page: number = 1, limit: number = 5) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMerchants(page, limit, "", validRole);
      console.log("✅ Full API Response:", response);

      if (!response || !Array.isArray(response.merchants)) {
        throw new Error(
          "Invalid API response structure or no merchants found."
        );
      }

      setMerchants(response.merchants);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      console.error("❌ Error fetching merchants:", err);
      setError("Failed to fetch merchants. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!roleLoading) {
      fetchMerchants(currentPage);
    }
  }, [currentPage, roleLoading]);

  // ✅ FIX: Ensure this function is used so it's not flagged as unused
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchMerchants(page);
    }
  };

  const handleEdit = (merchant: Merchant) => {
    setEditingMerchant(merchant);
    setFormData(merchant);
  };

  const handleDelete = async (id: string) => {
    if (!validRole) return;

    if (window.confirm("Are you sure you want to delete this merchant?")) {
      try {
        await deleteMerchant(id, validRole);
        setMerchants((prev) => prev.filter((merchant) => merchant.id !== id));
        alert("Merchant deleted successfully.");
      } catch (err) {
        console.error("❌ Error deleting merchant:", err);
        alert("Failed to delete merchant. Please try again.");
      }
    }
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
      alert("Merchant updated successfully.");
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
                  {validRole === "admin" && (
                    <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th>
                  )}
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
                    {validRole === "admin" && (
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          className="mr-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                          onClick={() => handleEdit(merchant)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                          onClick={() => handleDelete(merchant.id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination - Ensure `handlePageChange` is used */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantListPage;
