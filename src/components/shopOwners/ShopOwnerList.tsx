import React from "react";
import { Card } from "@/components/ui/card"; // Assuming you have a card component from ShadCN
import { Button } from "@/components/ui/button"; // Button component from ShadCN

interface ShopOwner {
  id: string;
  name: string;
  businessName: string;
  contact: string;
}

interface ShopOwnerListProps {
  shopOwners: ShopOwner[];
}

const ShopOwnerList: React.FC<ShopOwnerListProps> = ({ shopOwners }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shopOwners.map((owner) => (
        <Card key={owner.id} className="p-4 shadow-lg">
          <h2 className="text-xl font-bold">{owner.businessName}</h2>
          <p className="mt-2 text-gray-700">Owner: {owner.name}</p>
          <p className="mt-2 text-gray-600">Contact: {owner.contact}</p>
          <div className="mt-4 flex justify-end">
            <Button variant="outline">View Details</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ShopOwnerList;
