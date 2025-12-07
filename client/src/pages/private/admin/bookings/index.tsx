import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title";
import { BookingType } from "../../../../interfaces";
import { Table, message, Alert } from "antd";
import { getAllBookings } from "../../../../api-services/booking-service";
import { getDateTimeFormat } from "../../../../helpers/date-time-formats";

function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const getData = async () => {
    if (!navigator.onLine) {
      setIsOffline(true);
      message.error("Sin conexión a internet. No se pueden cargar las reservas.");
      return;
    }

    try {
      setLoading(true);
      const response = await getAllBookings();
      setBookings(response.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();

    const handleOnline = () => {
      setIsOffline(false);
      message.success("Conexión restaurada");
      getData();
    };

    const handleOffline = () => {
      setIsOffline(true);
      message.error("Sin conexión a internet");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const statusMap: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    completed: "Completado",
    booked: "Reservado",
  };

  const columns = [
    {
      title: "Evento",
      dataIndex: "event",
      key: "event",
      render: (event: any) => event?.name || "—",
    },
    {
      title: "Usuario",
      dataIndex: "user",
      key: "user",
      render: (user: any) => user?.name || "—",
    },
    {
      title: "Evento Fecha & Hora",
      dataIndex: "event",
      key: "eventDate",
      render: (event: any) =>
        event ? getDateTimeFormat(`${event.date} ${event.time}`) : "—",
    },
    {
      title: "Tipo de boleto",
      dataIndex: "ticketType",
      key: "ticketType",
    },
    {
      title: "Cantidad de boletos",
      dataIndex: "ticketsCount",
      key: "ticketsCount",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Reservado",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => getDateTimeFormat(createdAt),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const translated =
          statusMap[status?.toLowerCase()] || status || "Desconocido";
        return (
          translated.charAt(0).toUpperCase() +
          translated.slice(1).toLowerCase()
        );
      },
    },
  ];

  return (
    <div>
      <PageTitle title="Reservas" />

      {isOffline && (
        <Alert
          message="Estás sin conexión"
          description="Los datos no se pueden actualizar mientras estés offline."
          type="warning"
          showIcon
          style={{ marginBottom: 15 }}
        />
      )}

      <Table
        dataSource={bookings}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={false}
      />
    </div>
  );
}

export default AdminBookingsPage;
