'use client'

import Table, { type Column } from '../Table/Table';

type DeliveryQueueItem = {
    recipient: string,
    needScore: number,
    location: string,
    daysSinceLastDelivery: number
}

interface DeliveryQueueTableProps {
    data: DeliveryQueueItem[]
}

// Convert the shape of the items need to match the DataRow type's shape
    // DataRow: [key: string]: string
function convertDQItemToRecord(item: DeliveryQueueItem) {
    return {
        "recipient": item.recipient,
        "needScore": item.needScore.toString(),
        "location": item.location,
        "daysSinceLastDelivery": item.daysSinceLastDelivery.toString()
    }
}

export default function DeliveryQueueTable({data} : DeliveryQueueTableProps)  {
    const HEADERS: Column[] = [
        {key: "recipient", label: "Recipient"},
        {key: "needScore", label: "Need Score"},
        {key: "location", label: "Location"},
        {key: "daysSinceLastDelivery", label: "Days Since Last Delivery"}
    ]
    
    const parsedData = data.map((item) => {
        return convertDQItemToRecord(item);
    })

    return (
        <Table 
            columns = {HEADERS}
            data = {parsedData}
        />
    )
}