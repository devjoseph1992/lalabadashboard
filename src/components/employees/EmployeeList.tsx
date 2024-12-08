import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";

// Define a type for Firestore user documents
type UserRole = "employee" | "rider" | "shop_owner" | "admin";

interface UserDocument {
  id: string; // Firestore document ID
  name: string;
  email: string;
  role: UserRole;
  createdAt: Timestamp; // Firestore Timestamp
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      const db = getFirestore();
      const usersCollection = collection(db, "users");

      try {
        const snapshot = await getDocs(usersCollection);

        const employeesList = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<UserDocument, "id">),
          }))
          .filter((user) => user.role === "employee");

        setEmployees(employeesList);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div>Loading employees...</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold">Employee List</h2>
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id} className="border-b py-2">
              <strong>{employee.name}</strong> ({employee.email}) - Role:{" "}
              {employee.role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeList;
