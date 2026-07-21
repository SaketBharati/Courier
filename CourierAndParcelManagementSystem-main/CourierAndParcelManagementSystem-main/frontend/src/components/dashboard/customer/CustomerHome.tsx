import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { server } from "@/utils/envUtility";
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import type { Parcel } from "@/utils/types";

const CustomerHome = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.accessToken);

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Parcel[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${server}/parcels/myBooking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) return <LoadingPage />;

  const totalBookings = bookings.length;

  const pending = bookings.filter(
    (p) => p.status === "Pending"
  ).length;

  const assigned = bookings.filter(
    (p) => p.status === "Assigned"
  ).length;

  const inTransit = bookings.filter(
    (p) => p.status === "In Transit"
  ).length;

  const delivered = bookings.filter(
    (p) => p.status === "Delivered"
  ).length;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">
          Welcome Back, {user?.name || "Customer"} 👋
        </h1>

        <p className="mt-3 text-lg text-sky-100">
          Manage your shipments, track deliveries and book parcels easily.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/dashboard/customer/book")}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-sky-700 transition hover:scale-105"
          >
            📦 Book Parcel
          </button>

          <button
            onClick={() => navigate("/dashboard/customer/history")}
            className="rounded-xl border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-sky-700"
          >
            🚚 My Bookings
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="text-4xl">📦</div>
          <h3 className="mt-3 text-gray-500">Total Bookings</h3>
          <p className="mt-2 text-3xl font-bold text-sky-700">
            {totalBookings}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="text-4xl">⏳</div>
          <h3 className="mt-3 text-gray-500">Pending</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {pending}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="text-4xl">👨‍✈️</div>
          <h3 className="mt-3 text-gray-500">Assigned</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {assigned}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="text-4xl">🚚</div>
          <h3 className="mt-3 text-gray-500">In Transit</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {inTransit}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="text-4xl">✅</div>
          <h3 className="mt-3 text-gray-500">Delivered</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {delivered}
          </p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-5 text-2xl font-semibold text-gray-800">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <button
            onClick={() => navigate("/dashboard/customer/book")}
            className="rounded-xl border p-5 text-left transition hover:border-sky-500 hover:bg-sky-50"
          >
            <div className="text-3xl">📦</div>
            <h3 className="mt-3 font-semibold">Book a Parcel</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create a new shipment quickly.
            </p>
          </button>

          <button
            onClick={() => navigate("/dashboard/customer/history")}
            className="rounded-xl border p-5 text-left transition hover:border-sky-500 hover:bg-sky-50"
          >
            <div className="text-3xl">📋</div>
            <h3 className="mt-3 font-semibold">My Bookings</h3>
            <p className="mt-1 text-sm text-gray-500">
              View all booked parcels.
            </p>
          </button>

          <button
            onClick={() => navigate("/dashboard/customer/user")}
            className="rounded-xl border p-5 text-left transition hover:border-sky-500 hover:bg-sky-50"
          >
            <div className="text-3xl">👤</div>
            <h3 className="mt-3 font-semibold">Profile</h3>
            <p className="mt-1 text-sm text-gray-500">
              Update your personal information.
            </p>
          </button>

        </div>
      </div>

      {/* Shipping Tips */}
      <div className="rounded-2xl border-l-4 border-sky-600 bg-sky-50 p-6">
        <h2 className="text-xl font-semibold text-sky-700">
          Shipping Tips
        </h2>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
          <li>Pack fragile items securely before booking.</li>
          <li>Keep your contact information updated.</li>
          <li>Track your parcel regularly for live updates.</li>
          <li>Ensure the delivery address is complete and accurate.</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerHome;