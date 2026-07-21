import { parcelsCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";

// =====================================
// Create Parcel
// =====================================
export async function createParcel(parcelData, customerEmail) {
  const newParcel = {
    ...parcelData,
    status: "Pending",
    customerEmail,
    createdAt: new Date(),
  };

  return parcelsCollection.insertOne(newParcel);
}

// =====================================
// Get Parcel By ID
// =====================================
export async function getParcelById(parcelId) {
  return parcelsCollection.findOne({
    _id: new ObjectId(parcelId),
  });
}

// =====================================
// Get Customer Bookings
// =====================================
export async function getCustomerBookings(email) {
  return parcelsCollection.find({
    customerEmail: email,
  }).toArray();
}