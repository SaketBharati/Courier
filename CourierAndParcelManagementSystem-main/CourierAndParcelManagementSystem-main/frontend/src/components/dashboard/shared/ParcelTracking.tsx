/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuthStore } from "@/store/useAuthStore";
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import { Button } from "@/components/ui/button";
import type { Parcel } from "@/utils/types";
import { server } from "@/utils/envUtility";

//* Fix Leaflet default icon issue
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export const ParcelTracking = () => {
  const { id } = useParams();
  const token = useAuthStore((state) => state.accessToken);

  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchParcel = async () => {
      if (!id || !token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${server}/parcels/${id}/tracking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const error = await res.json();
          console.error("Tracking fetch failed:", error);
          setParcel(null);
          return;
        }

        const data = await res.json();

        // Ensure trackingHistory always exists
        data.trackingHistory = data.trackingHistory ?? [];

        setParcel(data);
      } catch (err) {
        console.error("Error fetching parcel:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParcel();
  }, [id, token]);

  if (loading) return <LoadingPage />;

  if (!parcel) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-red-500">
        <h1 className="mb-4 text-5xl font-bold text-sky-800">
          Parcel not found!
        </h1>

        <Button size="lg" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const trackingHistory = parcel.trackingHistory ?? [];

  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row">
      {/* Timeline */}
      <div className="flex flex-col gap-4 md:w-1/3">
        <h2 className="mb-2 text-xl font-semibold text-sky-700">
          Tracking History
        </h2>

        <div className="flex flex-col gap-2">
          {trackingHistory
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            )
            .map((event, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="mt-1 h-3 w-3 rounded-full bg-sky-500"></div>

                  {idx < trackingHistory.length - 1 && (
                    <div className="flex-1 w-px bg-gray-300"></div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium">{event.status}</p>

                  <p className="text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Map */}
      <div className="h-80 overflow-hidden rounded-lg shadow-md md:h-[500px] md:w-2/3">
        <MapContainer
          center={
            parcel.currentLocation
              ? [parcel.currentLocation.lat, parcel.currentLocation.lng]
              : [23.8103, 90.4125]
          }
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {parcel.currentLocation && (
            <Marker
              position={[
                parcel.currentLocation.lat,
                parcel.currentLocation.lng,
              ]}
            >
              <Popup>
                Current Status: {parcel.status}
                <br />
                {parcel.agentEmail
                  ? `Agent: ${parcel.agentEmail}`
                  : "No Agent Assigned"}
              </Popup>
            </Marker>
          )}

          {trackingHistory
            .filter((event) => event.location)
            .map((event, idx) => (
              <Marker
                key={idx}
                position={[
                  event.location!.lat,
                  event.location!.lng,
                ]}
              >
                <Popup>
                  Status: {event.status}
                  <br />
                  {new Date(event.timestamp).toLocaleString()}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ParcelTracking;