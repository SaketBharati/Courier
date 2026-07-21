import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import type { Parcel } from "@/utils/types";
import { server } from "@/utils/envUtility";

const AllParcels = () => {
  const token = useAuthStore((state) => state.accessToken);

  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const res = await fetch(`${server}/admin/parcels`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setParcels(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching parcels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, [token]);

  if (loading) return <LoadingPage />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          All Parcels
        </h1>

        <p className="mt-2 text-gray-600">
          Manage parcel bookings and monitor their delivery status.
        </p>
      </div>

      {parcels.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">
            No Parcels Found
          </h2>

          <p className="mt-2 text-gray-500">
            Customers haven't booked any parcels yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full">

              <thead className="bg-gray-100">
                <tr className="text-left text-sm font-semibold text-gray-700">
                  <th className="px-6 py-4">Parcel ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Agent</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Booked On</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {parcels.map((parcel) => (
                  <tr
                    key={parcel._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-700">
                      #{parcel._id.slice(-8)}
                    </td>

                    <td className="px-6 py-4">
                      {parcel.customerEmail}
                    </td>

                    <td className="px-6 py-4">
                      {parcel.agentEmail || (
                        <span className="text-gray-400 italic">
                          Not Assigned
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold
                        ${
                          parcel.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : parcel.status === "Assigned"
                            ? "bg-purple-100 text-purple-700"
                            : parcel.status === "In Transit"
                            ? "bg-blue-100 text-blue-700"
                            : parcel.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {parcel.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(parcel.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/admin/tracking/${parcel._id}`
                          )
                        }
                        className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllParcels;