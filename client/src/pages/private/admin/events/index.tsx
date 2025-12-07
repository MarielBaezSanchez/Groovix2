import { Button, Table, message, Tooltip } from "antd";
import PageTitle from "../../../../components/page-title";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deleteEvent,
  getEvents,
} from "../../../../api-services/events-service";
import { getDateTimeFormat } from "../../../../helpers/date-time-formats";
import { Pen, Trash2 } from "lucide-react";
import { useOnlineStatus } from "../../../../helpers/useOnlineStatus"; 

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isOnline = useOnlineStatus(); 

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getEvents({
        searchText: "",
        date: "",
      });
      setEvents(response.data);
    } catch (error) {
      message.error("Error al cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  const deleteEventHandler = async (id: string) => {
    try {
      setLoading(true);
      await deleteEvent(id);
      getData();
      message.success("Evento eliminado exitosamente");
    } catch (error) {
      message.error("Error al eliminar evento");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Nombre Evento",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Fecha y Hora",
      dataIndex: "date",
      render: (date: any, row: any) => {
        return getDateTimeFormat(`${date} ${row.time}`);
      },
      key: "date",
    },
    {
      title: "Organizador",
      dataIndex: "organizer",
      key: "organizer",
    },
    {
      title: "Creado",
      dataIndex: "createdAt",
      render: (date: any) => getDateTimeFormat(date),
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      render: (_text: any, record: any) => (
        <div className="flex gap-5">
          {isOnline ? (
            <>
              {/* ELIMINAR */}
              <Trash2
                className="cursor-pointer text-red-700"
                size={16}
                onClick={() => deleteEventHandler(record._id)}
              />

              {/* EDITAR */}
              <Pen
                className="cursor-pointer text-yellow-700"
                size={16}
                onClick={() => navigate(`/admin/events/edit/${record._id}`)}
              />
            </>
          ) : (
            <>
              {/* Íconos deshabilitados cuando no hay conexión */}
              <Tooltip title="No disponible sin conexión">
                <Trash2
                  size={16}
                  className="text-gray-400 cursor-not-allowed opacity-60"
                />
              </Tooltip>

              <Tooltip title="No disponible sin conexión">
                <Pen
                  size={16}
                  className="text-gray-400 cursor-not-allowed opacity-60"
                />
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Eventos" />
        <Button
          type="primary"
          onClick={() => navigate("/admin/events/create")}
          disabled={!isOnline} 
        >
          Crear Evento
        </Button>
      </div>

      <Table dataSource={events} columns={columns} loading={loading} />
    </div>
  );
}

export default EventsPage;
