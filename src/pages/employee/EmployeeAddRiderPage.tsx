import React, { useState, FormEvent } from "react";
import { addRider } from "@/api/apiService"; // Import the API call

const EmployeeAddRiderPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    plateNumber: "",
    vehicleUnit: "",
    driverLicenseNumber: "",
    barangayClearance: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const vehicleUnits = ["motor", "l3", "car", "ebike"];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!/^\d{10,11}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be 10-11 digits.";
    if (!formData.plateNumber)
      newErrors.plateNumber = "Plate number is required.";
    if (!formData.vehicleUnit)
      newErrors.vehicleUnit = "Vehicle unit is required.";
    if (!formData.driverLicenseNumber && !formData.barangayClearance)
      newErrors.driverLicenseNumber =
        "Either Driver's License or Barangay Clearance is required.";

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
      await addRider(formData);
      setSuccess(true);
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        plateNumber: "",
        vehicleUnit: "",
        driverLicenseNumber: "",
        barangayClearance: "",
      });
    } catch (error: any) {
      console.error("Error adding rider:", error.response?.data || error);
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
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Rider</h2>
      {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
      {success && (
        <p className="text-green-500 mb-4">Rider added successfully!</p>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <div>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
        </div>
        <div>
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
        </div>
        <div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <input
            type="text"
            name="plateNumber"
            value={formData.plateNumber}
            onChange={handleChange}
            placeholder="Plate Number"
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.plateNumber && (
            <p className="text-red-500">{errors.plateNumber}</p>
          )}
        </div>
        <div>
          <select
            name="vehicleUnit"
            value={formData.vehicleUnit}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="" disabled>
              Select Vehicle Unit
            </option>
            {vehicleUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors.vehicleUnit && (
            <p className="text-red-500">{errors.vehicleUnit}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            name="driverLicenseNumber"
            value={formData.driverLicenseNumber}
            onChange={handleChange}
            placeholder="Driver's License Number (Optional)"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <input
            type="text"
            name="barangayClearance"
            value={formData.barangayClearance}
            onChange={handleChange}
            placeholder="Barangay Clearance (Optional)"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="col-span-2">
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Adding Rider..." : "Add Rider"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeAddRiderPage;
