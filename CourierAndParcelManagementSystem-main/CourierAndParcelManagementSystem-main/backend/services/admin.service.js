import { usersCollection, parcelsCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";

// =====================================
// Get All Users
// =====================================
export async function getAllUsers() {
  return usersCollection
    .find(
      {},
      {
        projection: {
          password: 0,
        },
      }
    )
    .toArray();
}

// =====================================
// Get All Parcels
// =====================================
export async function getAllParcels() {
  return parcelsCollection.find({}).toArray();
}

// =====================================
// Update User By Admin
// =====================================
export async function updateUserByAdmin(
  userId,
  role,
  status,
  statusChangeReason,
  statusChangedBy
) {
  return usersCollection.updateOne(
    {
      _id: new ObjectId(userId),
    },
    {
      $set: {
        role,
        status,
        statusChangeReason,
        statusChangedBy,
        statusUpdatedByAdmin: new Date(),
        updatedAt: new Date(),
      },
    }
  );
}

// =====================================
// Assign Agent To Parcel
// =====================================
export async function assignAgentToParcel(parcelId, agentEmail) {
  return parcelsCollection.updateOne(
    {
      _id: new ObjectId(parcelId),
    },
    {
      $set: {
        agentEmail,
        status: "Assigned",
        updatedAt: new Date(),
      },
    }
  );
}

// =====================================
// Dashboard Metrics
// =====================================
export async function getDashboardMetrics() {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const [
    totalUsers,
    totalCustomers,
    totalAgents,
    totalAdmins,
    totalParcels,
    dailyBookings,
    failedDeliveries,
    codParcels,
  ] = await Promise.all([
    usersCollection.countDocuments(),

    usersCollection.countDocuments({
      role: "Customer",
    }),

    usersCollection.countDocuments({
      role: "Delivery Agent",
    }),

    usersCollection.countDocuments({
      role: "Admin",
    }),

    parcelsCollection.countDocuments(),

    parcelsCollection.countDocuments({
      createdAt: {
        $gte: startOfDay,
      },
    }),

    parcelsCollection.countDocuments({
      status: "Failed",
    }),

    parcelsCollection
      .find({
        paymentType: "COD",
      })
      .toArray(),
  ]);

  const codAmount = codParcels.reduce(
    (sum, parcel) => sum + (parcel.price || 0),
    0
  );

  return {
    totalUsers,
    totalCustomers,
    totalAgents,
    totalAdmins,
    totalParcels,
    dailyBookings,
    failedDeliveries,
    codNumber: codParcels.length,
    codAmount,
  };
}