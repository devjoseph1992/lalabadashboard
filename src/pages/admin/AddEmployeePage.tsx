// src/pages/admin/AddEmployeePage.tsx

import React, { useState, FormEvent } from "react";
import { addEmployee } from "@/api/apiService"; // Adjust path as needed

const AddEmployeePage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    barangayClearance: "",
    phoneNumber: "",
    sssNumber: "",
    tinNumber: "",
    philhealthNumber: "",
    jobTitle: "",
    department: "",
    employeeId: "",
    employmentStatus: "full-time",
    role: "employee", // ✅ Ensure role is explicitly set
  });

  const employmentStatusOptions = ["full-time", "part-time", "contract"];

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!/^\d{10,11}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be 10-11 digits.";
    if (!formData.barangayClearance)
      newErrors.barangayClearance = "Barangay clearance is required.";
    if (!formData.sssNumber) newErrors.sssNumber = "SSS number is required.";
    if (!formData.tinNumber) newErrors.tinNumber = "TIN number is required.";
    if (!formData.philhealthNumber)
      newErrors.philhealthNumber = "PhilHealth number is required.";
    if (!formData.jobTitle) newErrors.jobTitle = "Job title is required.";
    if (!formData.department) newErrors.department = "Department is required.";
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!validateForm()) {
      console.error("❌ Validation failed:", errors);
      return;
    }

    setLoading(true);

    try {
      console.log("📌 Preparing to send API request...");

      const response = await addEmployee(formData);
      console.log("📌 API Response:", response);

      setSuccess(true);
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        phoneNumber: "",
        sssNumber: "",
        tinNumber: "",
        philhealthNumber: "",
        barangayClearance: "", // ✅ Reset barangay clearance
        jobTitle: "",
        department: "",
        employeeId: "",
        employmentStatus: "full-time",
        role: "employee",
      });
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error);
      setErrors({
        general: error.response?.data?.message || "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Employee</h2>
      {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
      {success && (
        <p className="text-green-500 mb-4">Employee added successfully!</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}

        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}

        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.address && <p className="text-red-500">{errors.address}</p>}

        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.phoneNumber && (
          <p className="text-red-500">{errors.phoneNumber}</p>
        )}

        <input
          type="text"
          name="sssNumber"
          value={formData.sssNumber}
          onChange={handleChange}
          placeholder="SSS Number"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.sssNumber && <p className="text-red-500">{errors.sssNumber}</p>}

        <input
          type="text"
          name="tinNumber"
          value={formData.tinNumber}
          onChange={handleChange}
          placeholder="TIN Number"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.tinNumber && <p className="text-red-500">{errors.tinNumber}</p>}

        <input
          type="text"
          name="philhealthNumber"
          value={formData.philhealthNumber}
          onChange={handleChange}
          placeholder="PhilHealth Number"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.philhealthNumber && (
          <p className="text-red-500">{errors.philhealthNumber}</p>
        )}
        <input
          type="text"
          name="barangayClearance"
          value={formData.barangayClearance}
          onChange={handleChange}
          placeholder="Barangay Clearance"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.barangayClearance && (
          <p className="text-red-500">{errors.barangayClearance}</p>
        )}

        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.jobTitle && <p className="text-red-500">{errors.jobTitle}</p>}

        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Department"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.department && (
          <p className="text-red-500">{errors.department}</p>
        )}

        <input
          type="text"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          placeholder="Employee ID"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.employeeId && (
          <p className="text-red-500">{errors.employeeId}</p>
        )}

        <select
          name="employmentStatus"
          value={formData.employmentStatus}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          {employmentStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Adding Employee..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployeePage;
