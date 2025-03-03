// src/components/shopOwners/AddShopOwnerForm.tsx
import React, { useState } from "react";
import InputField from "@/components/common/InputField";
import { Button } from "@/components/ui/button";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const AddMerchantForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const db = getFirestore();
      await addDoc(collection(db, "merhcant"), {
        name,
        email,
        phone,
        createdAt: Timestamp.now(),
      });
      alert("Shop owner added successfully!");
      setName("");
      setEmail("");
      setPhone("");
    } catch (error) {
      console.error("Error adding shop owner:", error);
      alert("Failed to add shop owner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold">Register Shop Owner</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <InputField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Button onClick={handleSubmit} disabled={loading} loading={loading}>
          Add Shop Owner
        </Button>
      </form>
    </div>
  );
};

export default AddMerchantForm;
