import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { server } from "@/utils/envUtility";
import LoadingPage from "@/pages/shared/loading/LoadingPage";

const AdminHome = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.accessToken);

  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    totalParcels: 0,
    dailyBookings: 0,
    failedDeliveries: 0,
    codAmount: 0,
    codNumber: 0,
  });

  const [users, setUsers] = useState<any[]>([]);
  const [parcels, setParcels] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [metricsRes, usersRes, parcelsRes] = await Promise.all([
          fetch(`${server}/admin/dashboard-metrics`, { headers }),
          fetch(`${server}/admin/users`, { headers }),
          fetch(`${server}/admin/parcels`, { headers }),
        ]);

        const metricsData = await metricsRes.json();
        const usersData = await usersRes.json();
        const parcelsData = await parcelsRes.json();

        setMetrics(metricsData);
        setUsers(usersData);
        setParcels(parcelsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) return <LoadingPage />;

  const customers = users.filter((u) => u.role === "Customer").length;

  const agents = users.filter((u) => u.role === "Delivery Agent").length;

  const admins = users.filter((u) => u.role === "Admin").length;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">
          Welcome, {user?.name || "Admin"} 👋
        </h1>

        <p className="mt-3 text-lg text-blue-100">
          Monitor users, parcels and overall system performance.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/dashboard/admin/users")}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 hover:scale-105 transition"
          >
            👥 Users
          </button>

          <button
            onClick={() => navigate("/dashboard/admin/parcels")}
            className="rounded-xl border border-white px-6 py-3 hover:bg-white hover:text-blue-700 transition"
          >
            📦 Parcels
          </button>

          <button
            onClick={() => navigate("/dashboard/admin/metrics")}
            className="rounded-xl border border-white px-6 py-3 hover:bg-white hover:text-blue-700 transition"
          >
            📊 Analytics
          </button>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-4xl">📦</div>
          <h3 className="mt-3 text-gray-500">Total Parcels</h3>
          <p className="mt-2 text-3xl font-bold text-sky-700">
            {metrics.totalParcels}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-4xl">📅</div>
          <h3 className="mt-3 text-gray-500">Today's Bookings</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {metrics.dailyBookings}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-4xl">❌</div>
          <h3 className="mt-3 text-gray-500">Failed Deliveries</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {metrics.failedDeliveries}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-4xl">💰</div>
          <h3 className="mt-3 text-gray-500">COD Amount</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            ₹{metrics.codAmount}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-4xl">💵</div>
          <h3 className="mt-3 text-gray-500">COD Orders</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {metrics.codNumber}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-5 text-2xl font-semibold">Quick Actions</h2>

          <div className="grid gap-4">
            <button
              onClick={() => navigate("/dashboard/admin/users")}
              className="rounded-xl border p-5 text-left hover:bg-sky-50 hover:border-sky-500"
            >
              👥 Manage Users
            </button>

            <button
              onClick={() => navigate("/dashboard/admin/parcels")}
              className="rounded-xl border p-5 text-left hover:bg-sky-50 hover:border-sky-500"
            >
              📦 Manage Parcels
            </button>

            <button
              onClick={() => navigate("/dashboard/admin/metrics")}
              className="rounded-xl border p-5 text-left hover:bg-sky-50 hover:border-sky-500"
            >
              📊 Analytics
            </button>

            <button
              onClick={() => navigate("/dashboard/admin/user")}
              className="rounded-xl border p-5 text-left hover:bg-sky-50 hover:border-sky-500"
            >
              👤 My Profile
            </button>
          </div>
        </div>

        {/* System Overview */}

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-5 text-2xl font-semibold">System Overview</h2>

          <div className="space-y-4 text-lg">
            <div className="flex justify-between">
              <span>Total Users</span>
              <strong>{users.length}</strong>
            </div>

            <div className="flex justify-between">
              <span>Customers</span>
              <strong>{customers}</strong>
            </div>

            <div className="flex justify-between">
              <span>Delivery Agents</span>
              <strong>{agents}</strong>
            </div>

            <div className="flex justify-between">
              <span>Admins</span>
              <strong>{admins}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Parcels */}

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-5 text-2xl font-semibold">Recent Parcels</h2>

        <div className="space-y-3">
          {parcels
            .slice(-5)
            .reverse()
            .map((parcel) => (
              <div
                key={parcel._id}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-semibold">#{parcel._id.slice(-6)}</p>

                  <p className="text-sm text-gray-500">
                    {parcel.customerEmail}
                  </p>
                </div>

                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                  {parcel.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
