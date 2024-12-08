import React, { useEffect, useState } from "react";
import {
  getShopOwners,
  updateShopOwner,
  deleteShopOwner,
} from "@/api/apiService";

interface ShopOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  tinNumber: string;
  dtiSec: string;
}

const ShopOwnerListPage: React.FC = () => {
  const [shopOwners, setShopOwners] = useState<ShopOwner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingShopOwner, setEditingShopOwner] = useState<ShopOwner | null>(
    null
  );
  const [formData, setFormData] = useState<ShopOwner | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchShopOwners = async (page: number = 1, limit: number = 5) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getShopOwners(page, limit);
      setShopOwners(response.data.shopOwners);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching shop owners:", err);
      setError("Failed to fetch shop owners. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopOwners(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleEdit = (shopOwner: ShopOwner) => {
    setEditingShopOwner(shopOwner);
    setFormData(shopOwner);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this shop owner?")) {
      try {
        await deleteShopOwner(id);
        setShopOwners((prev) => prev.filter((owner) => owner.id !== id));
        alert("Shop owner deleted successfully.");
      } catch (err) {
        console.error("Error deleting shop owner:", err);
        alert("Failed to delete shop owner. Please try again.");
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await updateShopOwner(formData.id, formData);
      setShopOwners((prev) =>
        prev.map((owner) =>
          owner.id === formData.id ? { ...formData } : owner
        )
      );
      setEditingShopOwner(null);
      alert("Shop owner updated successfully.");
    } catch (err) {
      console.error("Error updating shop owner:", err);
      alert("Failed to update shop owner. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Shop Owner List</h2>
      {loading ? (
        <p>Loading shop owners...</p>
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
                  <th className="border border-gray-300 px-4 py-2">TIN</th>
                  <th className="border border-gray-300 px-4 py-2">DTI/SEC</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shopOwners.map((owner) => (
                  <tr key={owner.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">
                      {owner.firstName} {owner.lastName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {owner.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {owner.phoneNumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {owner.tinNumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {owner.dtiSec}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="mr-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleEdit(owner)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDelete(owner.id)}
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

      {editingShopOwner && (
        <form
          onSubmit={handleFormSubmit}
          className="mt-6 bg-gray-100 p-4 rounded"
        >
          <h3 className="text-xl font-bold mb-4">Edit Shop Owner</h3>
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
              name="tinNumber"
              value={formData?.tinNumber || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev!, tinNumber: e.target.value }))
              }
              placeholder="TIN Number"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              name="dtiSec"
              value={formData?.dtiSec || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev!, dtiSec: e.target.value }))
              }
              placeholder="DTI/SEC"
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
              onClick={() => setEditingShopOwner(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ShopOwnerListPage;
