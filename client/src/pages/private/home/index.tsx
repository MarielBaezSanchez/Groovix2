import { useEffect, useState } from "react";
import usersGlobalStore, { UsersStoreType } from "../../../store/users-store";
import { message } from "antd";
import { getEvents } from "../../../api-services/events-service";
import EventCard from "./common/event-card";
import { EventType } from "../../../interfaces";
import Filters from "./common/filters";
import Spinner from "../../../components/spinner";
import { saveEventsCacheToLocalStorage } from "../../../hooks/useOnlineStatus";

function Homepage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [filters, setFilters] = useState({
    searchText: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = usersGlobalStore() as UsersStoreType;

  const getData = async (filtersObj: any) => {
    try {
      setLoading(true);
      const response = await getEvents(filtersObj);
      setEvents(response.data);
      // Cachear eventos para uso offline
      saveEventsCacheToLocalStorage(response.data);
    } catch (error) {
      message.error("Error al obtener datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData({ searchText: "", date: "" });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Spinner />
      </div>
    );
  }
//hola
  return (
    <div>
      <p className="text-gray-600 text-xl font-bold">
        ¡Bienvenido/a, {currentUser?.name}!!
      </p>

      <Filters filters={filters} setFilters={setFilters} onFilter={getData} />

      <div className="flex flex-col gap-7 mt-7">
        {events.map((event: any) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default Homepage;
