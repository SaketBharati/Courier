import { parcelsCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";

// =====================================
// Get Assigned Parcels
// =====================================
export async function getAssignedParcels(agentEmail) {
  return parcelsCollection.find({
    agentEmail,
  }).toArray();
}

// =====================================
// Update Parcel Status
// =====================================
export async function updateParcelStatus(
  parcelId,
  agentEmail,
  status
) {
  return parcelsCollection.updateOne(
    {
      _id: new ObjectId(parcelId),
      agentEmail,
    },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    }
  );
}

// =====================================
// Update Parcel Location
// =====================================
export async function updateParcelLocation(
  parcelId,
  agentEmail,
  lat,
  lng
) {
  const locationUpdate = {
    lat,
    lng,
    timestamp: new Date(),
  };

  return parcelsCollection.updateOne(
    {
      _id: new ObjectId(parcelId),
      agentEmail,
    },
    {
      $set: {
        currentLocation: {
          lat,
          lng,
        },
        updatedAt: new Date(),
      },
      $push: {
        trackingHistory: locationUpdate,
      },
    }
  );
}

// =====================================
// Get Parcels For Export
// =====================================
export async function getParcelsForExport(agentEmail) {
  return parcelsCollection.find({
    agentEmail,
  }).toArray();
}