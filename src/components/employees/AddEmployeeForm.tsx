import React, { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth } from "@/firebase/firebaseConfig";
import InputField from "@/components/common/InputField";

// Define the expected structure of the response
type AddEmployeeResponse = {
  message: string;
  uid: string;
};

const AddEmployeeForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
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
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        throw new Error("User not authenticated");
      }

      const functions = getFunctions();
      const addEmployee = httpsCallable<
        {
          firstName: string;
          lastName: string;
          email: string;
          phoneNumber: string;
          tinNumber: string;
          sssNumber: string;
          philhealthNumber: string;
          address: string;
        },
        AddEmployeeResponse
      >(functions, "addEmployee");

      const result = await addEmployee({
        firstName,
        lastName,
        email,
        phoneNumber,
        tinNumber,
        sssNumber,
        philhealthNumber,
        address,
      });

      setSuccess(result.data.message);
    } catch (error: any) {
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
