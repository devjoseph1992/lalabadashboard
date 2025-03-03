import React, { useEffect, useState } from "react";
import { getRiderCount, getMerchantCount } from "@/api/apiService";

const EmployeeDashboard: React.FC = () => {
  const [riderCount, setRiderCount] = useState<number>(0);
  const [shopOwnerCount, setShopOwnerCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = async () => {
    setLoading(true);
    setError(null);

    try {
      const [riderResponse, shopOwnerResponse] = await Promise.all([
        getRiderCount(),
        getMerchantCount(),
      ]);

      setRiderCount(riderResponse.data.count || 0);
      setShopOwnerCount(shopOwnerResponse.data.count || 0);
    } catch (err) {
      console.error("Error fetching counts:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Riders</h2>
            <p className="text-2xl font-bold">{riderCount}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Merchants</h2>
            <p className="text-2xl font-bold">{shopOwnerCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
