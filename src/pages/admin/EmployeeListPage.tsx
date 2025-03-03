import React, { useEffect, useState } from "react";
import { getEmployees, updateEmployee, deleteEmployee } from "@/api/apiService"; // Adjust the path to your API service

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

const EmployeeListPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchEmployees = async (page: number = 1, limit: number = 5) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getEmployees(page, limit);
      console.log("✅ Full API Response:", data);

      // ✅ Ensure the expected structure matches the API response
      if (!data || !Array.isArray(data.users)) {
        throw new Error("Invalid API response structure");
      }

      setEmployees(data.users); // ✅ "users" instead of "employees"
      setTotalPages(data.pagination?.totalPages || 0);
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
      setError("Failed to fetch employees. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        setEmployees((prev) => prev.filter((employee) => employee.id !== id));
        alert("Employee deleted successfully.");
      } catch (err) {
        console.error("Error deleting employee:", err);
        alert("Failed to delete employee. Please try again.");
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
      await updateEmployee(formData.id, formData);
      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === formData.id ? { ...formData } : employee
        )
      );
      setEditingEmployee(null);
      alert("Employee updated successfully.");
    } catch (err) {
      console.error("Error updating employee:", err);
      alert("Failed to update employee. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Employee List</h2>
      {loading ? (
        <p>Loading employees...</p>
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
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {employee.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {employee.phoneNumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {employee.address}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="mr-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDelete(employee.id)}
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

      {editingEmployee && (
        <form
          onSubmit={handleFormSubmit}
          className="mt-6 bg-gray-100 p-4 rounded"
        >
          <h3 className="text-xl font-bold mb-4">Edit Employee</h3>
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
              onClick={() => setEditingEmployee(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmployeeListPage;
