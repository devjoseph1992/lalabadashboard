import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/card";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl font-bold mt-2">1,234</p>
        </Card>

        {/* Card 2 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Monthly Revenue</h2>
          <p className="text-2xl font-bold mt-2">$5,678</p>
        </Card>

        {/* Card 3 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Pending Tasks</h2>
          <p className="text-2xl font-bold mt-2">12</p>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
