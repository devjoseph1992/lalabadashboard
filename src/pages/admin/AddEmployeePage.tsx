// src/pages/admin/AddEmployeePage.tsx

import React, { useState, FormEvent } from "react";
import axios from "axios";

const AddEmployeePage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    sssNumber: "",
    tinNumber: "",
    philhealthNumber: "",
  });

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
    if (!formData.sssNumber) newErrors.sssNumber = "SSS number is required.";
    if (!formData.tinNumber) newErrors.tinNumber = "TIN number is required.";
    if (!formData.philhealthNumber)
      newErrors.philhealthNumber = "PhilHealth number is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/lalaba-dev-2fbd7/us-central1/api/admin/addEmployee",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("idToken")}`,
          },
        }
      );
      console.log("Employee added successfully:", response.data);
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
      });
    } catch (error: any) {
      console.error("Error adding employee:", error.response?.data || error);
      setErrors({
        general: error.response?.data?.message || "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
