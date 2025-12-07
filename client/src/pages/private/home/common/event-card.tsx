import { Button } from "antd";
import { EventType } from "../../../../interfaces";
import { MapPin, Timer } from "lucide-react";
import { getDateTimeFormat } from "../../../../helpers/date-time-formats";
import { useNavigate } from "react-router-dom";
import { useOnlineStatus } from "../../../../helpers/useOnlineStatus";

function EventCard({ event }: { event: EventType }) {
  const mainImage = event.media[0];
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 border border-solid border-gray-200 items-center gap-5">
      <div className="col-span-1">
        <img
          src={mainImage}
          alt={event.name}
          className="w-full h-56 object-cover rounded-l"
        />
      </div>

      <div className="col-span-2 flex flex-col gap-5 p-3">
        <h1 className="text-primary text-sm font-bold">{event.name}</h1>
        <p className="text-gray-600 text-sm line-clamp-3">
          {event.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="bg-gray-200 p-2 rounded flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <MapPin size={16} />
              <p className="text-xs">
                {event.address}, {event.city} {event.pincode}
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <Timer size={16} />
              <p className="text-xs">
                {getDateTimeFormat(`${event.date} ${event.time}`)}
              </p>
            </div>
          </div>

          {isOnline ? (
            <Button type="primary" onClick={() => navigate(`/event/${event._id}`)}>
              Ver detalles
            </Button>
          ) : (
            <div className="text-red-500 font-semibold text-sm">
              No disponible sin conexión
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
