/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import type { Parcel } from "@/utils/types";
import { server } from "@/utils/envUtility";

const MyBookings = () => {
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const [bookings, setBookings] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  //* Fetch customer bookings
  //TODO: need to do further improvements
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // const res = await fetch("https://courier-y93t.onrender.com/parcels/myBooking", {
        const res = await fetch(`${server}/parcels/myBooking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        //? Normalize: if it's not an array, fallback to []
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]); //? fallback
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  if (loading) return <LoadingPage />;
  const filteredBookings = bookings.filter(
    (parcel) => parcel.customerEmail === user?.email,
  );

  if (!filteredBookings.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="text-7xl mb-4">📦</div>

        <h2 className="text-2xl font-bold text-gray-700">No Bookings Yet</h2>

        <p className="text-gray-500 mt-2">You haven't booked any parcels.</p>

        <button
          onClick={() => navigate("/dashboard/customer/bookParcel")}
          className="mt-6 px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition"
        >
          Book Your First Parcel
        </button>
      </div>
    );
  }

  //* Filter bookings

  return (
    <div className="p-6">
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className="text-4xl">📦</span>
        <h2 className="text-4xl font-bold text-sky-700">My Bookings</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredBookings.map((parcel) => (
          <div
            key={parcel._id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">Parcel ID</p>

                  <h3 className="font-bold text-lg">
                    #{parcel._id?.slice(-8).toUpperCase()}
                  </h3>
                </div>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    parcel.status === "Delivered"
                      ? "bg-green-500"
                      : parcel.status === "In Transit"
                        ? "bg-blue-500"
                        : parcel.status === "Assigned"
                          ? "bg-purple-500"
                          : parcel.status === "Failed"
                            ? "bg-red-500"
                            : "bg-yellow-400 text-black"
                  }`}
                >
                  {parcel.status}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">📅 Booked On</span>
                <span className="font-medium">
                  {new Date(parcel.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">👤 Customer</span>
                <span className="font-medium">{parcel.customerEmail}</span>
              </div>

              {parcel.receiverName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">📦 Receiver</span>
                  <span>{parcel.receiverName}</span>
                </div>
              )}

              {parcel.deliveryAddress && (
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">📍 Delivery</span>

                  <span className="text-right">{parcel.deliveryAddress}</span>
                </div>
              )}

              {parcel.parcelType && (
                <div className="flex justify-between">
                  <span className="text-gray-500">📦 Type</span>
                  <span>{parcel.parcelType}</span>
                </div>
              )}

              {parcel.paymentType && (
                <div className="flex justify-between">
                  <span className="text-gray-500">💳 Payment</span>
                  <span>{parcel.paymentType}</span>
                </div>
              )}

              {parcel.price && (
                <div className="flex justify-between">
                  <span className="text-gray-500">💰 Price</span>
                  <span className="font-semibold">₹{parcel.price}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">🚚 Delivery Agent</span>

                {parcel.agentEmail ? (
                  <span className="text-green-600 font-medium">
                    {parcel.agentEmail}
                  </span>
                ) : (
                  <span className="text-orange-500 font-medium">
                    Not Assigned Yet
                  </span>
                )}
              </div>

              <button
                onClick={() =>
                  navigate(`/dashboard/customer/tracking/${parcel._id}`)
                }
                className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold transition"
              >
                🚚 Track Parcel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
