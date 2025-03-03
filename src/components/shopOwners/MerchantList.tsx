import React from "react";
import { Card } from "@/components/ui/card"; // Assuming you have a card component from ShadCN
import { Button } from "@/components/ui/button"; // Button component from ShadCN

// ✅ Updated interface from ShopOwner to Merchant
interface Merchant {
  id: string;
  name: string;
  businessName: string;
  contact: string;
}

interface MerchantListProps {
  merchants: Merchant[];
}

const MerchantList: React.FC<MerchantListProps> = ({ merchants }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {merchants.map((merchant) => (
        <Card key={merchant.id} className="p-4 shadow-lg">
          <h2 className="text-xl font-bold">{merchant.businessName}</h2>
          <p className="mt-2 text-gray-700">Owner: {merchant.name}</p>
          <p className="mt-2 text-gray-600">Contact: {merchant.contact}</p>
          <div className="mt-4 flex justify-end">
            <Button variant="outline">View Details</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MerchantList;
