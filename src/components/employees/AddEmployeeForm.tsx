import React, { useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import InputField from "@/components/common/InputField";

const AddEmployeeForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>(""); // ✅ New password input field
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [tinNumber, setTinNumber] = useState<string>("");
  const [sssNumber, setSssNumber] = useState<string>("");
  const [philhealthNumber, setPhilhealthNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const idToken = await user.getIdToken();
      console.log("📌 Firebase Token:", idToken);

      // ✅ Ensure all required fields are present
      const newEmployee = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password.trim(), // ✅ Ensure password is included
        phoneNumber: phoneNumber.trim(),
        tinNumber: tinNumber.trim(),
        sssNumber: sssNumber.trim(),
        philhealthNumber: philhealthNumber.trim(),
        address: address.trim(),
        role: "employee", // ✅ Ensure role is explicitly set
      };

      console.log("📌 Sending API Request:", JSON.stringify(newEmployee)); // ✅ Debugging API request payload

      // ✅ Validate before sending
      if (
        Object.values(newEmployee).some(
          (field) => field === "" || field === undefined
        )
      ) {
        throw new Error("All fields are required.");
      }

      const response = await fetch(
        "https://us-central1-lalaba-dev-2fbd7.cloudfunctions.net/api/admin/add",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`, // ✅ Ensure token is included
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEmployee),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ API Response Error:", data);
        throw new Error(data.error || "Failed to add employee.");
      }

      setSuccess("Employee added successfully!");
    } catch (error: any) {
      console.error("❌ Error adding employee:", error);
      setError(error.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-lg font-medium mb-6">Add Employee</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        <InputField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <InputField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <InputField
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <InputField
          label="TIN Number"
          value={tinNumber}
          onChange={(e) => setTinNumber(e.target.value)}
          required
        />
        <InputField
          label="SSS Number"
          value={sssNumber}
          onChange={(e) => setSssNumber(e.target.value)}
          required
        />
        <InputField
          label="PhilHealth Number"
          value={philhealthNumber}
          onChange={(e) => setPhilhealthNumber(e.target.value)}
          required
        />
        <InputField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 mt-4 rounded ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white`}
        >
          {loading ? "Adding Employee..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployeeForm;
