import React, { useEffect, useState } from "react";
import { getRiders } from "@/api/apiService";
import { useAuth } from "@/contexts/AuthContext";

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

const EmployeeRiderListPage: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { userRole, roleLoading } = useAuth();

  const fetchRiders = async (page: number = 1, limit: number = 5) => {
    setLoading(true);
    setError(null);

    try {
      const role = userRole ?? "employee"; // Ensure a valid role is passed
      const data = await getRiders(page, limit, "", role);

      console.log("✅ Full API Response:", data);

      // 🔥 Fix API response structure: Use `riders` instead of `users`
      if (!data || (!data.riders && !data.pagination)) {
        throw new Error(
          "Invalid API response structure: Missing `riders` or `pagination`"
        );
      }

      setRiders(data.riders ?? []);
      setTotalPages(data.pagination?.totalPages || 1);
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
                </tr>
              </thead>
              <tbody>
                {riders.length > 0 ? (
                  riders.map((rider) => (
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                    >
                      No riders found.
                    </td>
                  </tr>
                )}
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

export default EmployeeRiderListPage;
