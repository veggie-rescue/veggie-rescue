import DeliveryQueueTable from "@/components/DeliveryQueueTable/DeliveryQueueTable";

const dummyData = [
  {
    recipient: "Community Center A",
    needScore: 92,
    location: "San Luis Obispo, CA",
    daysSinceLastDelivery: 5,
  },
  {
    recipient: "Food Bank B",
    needScore: 87,
    location: "Paso Robles, CA",
    daysSinceLastDelivery: 3,
  },
  {
    recipient: "Shelter C",
    needScore: 95,
    location: "Atascadero, CA",
    daysSinceLastDelivery: 7,
  },
  {
    recipient: "Church D",
    needScore: 80,
    location: "Grover Beach, CA",
    daysSinceLastDelivery: 2,
  },
  {
    recipient: "Nonprofit E",
    needScore: 89,
    location: "Arroyo Grande, CA",
    daysSinceLastDelivery: 4,
  },
];

export default function Deliveries() {
    return (
        <>
            <h1>Deliveries</h1> 
            <DeliveryQueueTable
                data={dummyData}
            />
        </>
    );
}