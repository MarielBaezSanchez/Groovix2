import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title";
import OfflineContent from "../../../../components/offline-content";
import { getEventsCacheFromLocalStorage } from "../../../../hooks/useOnlineStatus";

interface OfflineEvent {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  image?: string;
  location: string;
}
//holis
function HomeOfflineView() {
  const [events, setEvents] = useState<OfflineEvent[]>([]);

  useEffect(() => {
    // Recuperar eventos guardados en localStorage
    const events = getEventsCacheFromLocalStorage();
    setEvents(events);
  }, []);

  return (
    <div>
      <PageTitle title="Eventos (Offline)" />

      {events.length === 0 ? (
        <OfflineContent
          title="No hay eventos guardados"
          message="No hay eventos disponibles en tu dispositivo. Conéctate a internet para cargar eventos."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {event.description?.substring(0, 100)}...
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>📅 {event.date} {event.time}</p>
                  <p>📍 {event.location}</p>
                  <p className="text-orange-600 font-semibold mt-2">
                    [Offline - Datos guardados]
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomeOfflineView;
