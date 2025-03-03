import React, { useState, FormEvent } from "react";
import { addMerchant } from "@/api/apiService";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Import useAuth to get user role

const AddMerchantPage: React.FC = () => {
  const { userRole } = useAuth(); // ✅ Fetch user role (admin or employee)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    tinNumber: "",
    dtiSec: "",
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
    if (!/^\d{10,11}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be 10-11 digits.";
    if (!formData.tinNumber) newErrors.tinNumber = "TIN number is required.";
    if (!formData.dtiSec) newErrors.dtiSec = "DTI/SEC is required.";

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
      console.log("📌 Adding Merchant as:", userRole);

      if (!userRole) {
        throw new Error("User role is missing. Cannot add merchant.");
      }

      await addMerchant(formData, userRole); // ✅ Fix: Pass `userRole` as second argument
      setSuccess(true);

      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        tinNumber: "",
        dtiSec: "",
      });
    } catch (error: any) {
      console.error("❌ Error adding merchant:", error.response?.data || error);
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
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Merchant</h2>
      {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
      {success && (
        <p className="text-green-500 mb-4">Merchant added successfully!</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}

        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}

        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}

        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        {errors.phoneNumber && (
          <p className="text-red-500">{errors.phoneNumber}</p>
        )}

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full px-3 py-2 border rounded-md"
          required
        />

        <input
          type="text"
          name="tinNumber"
          value={formData.tinNumber}
          onChange={handleChange}
          placeholder="TIN Number"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        {errors.tinNumber && <p className="text-red-500">{errors.tinNumber}</p>}

        <input
          type="text"
          name="dtiSec"
          value={formData.dtiSec}
          onChange={handleChange}
          placeholder="DTI/SEC"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        {errors.dtiSec && <p className="text-red-500">{errors.dtiSec}</p>}

        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Adding Merchant..." : "Add Merchant"}
        </button>
      </form>
    </div>
  );
};

export default AddMerchantPage;
