// src/components/riders/RiderList.tsx
import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

interface Rider {
  id: string;
  name: string;
  email: string;
  createdAt: Timestamp;
}

const RiderList: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRiders = async () => {
      const db = getFirestore();
      const ridersCollection = collection(db, "riders");

      try {
        const snapshot = await getDocs(ridersCollection);
        const ridersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Rider, "id">),
        }));
        setRiders(ridersList);
      } catch (error) {
        console.error("Error fetching riders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiders();
  }, []);

  if (loading) {
    return <div>Loading riders...</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold">Rider List</h2>
      {riders.length === 0 ? (
        <p>No riders found.</p>
      ) : (
        <ul>
          {riders.map((rider) => (
            <li key={rider.id} className="border-b py-2">
              <strong>{rider.name}</strong> ({rider.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RiderList;
