import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../../components/page-title";
import { BookingType } from "../../../../interfaces";
import { Table, message } from "antd";
import { getAllBookings } from "../../../../api-services/booking-service";
import { getDateTimeFormat } from "../../../../helpers/date-time-formats";

function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ⛔ Detectar si NO hay internet y redirigir a /offline
  useEffect(() => {
    if (!navigator.onLine) {
      navigate("/offline");
    }
  }, [navigate]);

  const getData = async () => {
    try {
      setLoading(true);

      // Si se pierde conexión durante la petición → offline
      if (!navigator.onLine) {
        navigate("/offline");
        return;
      }

      const response = await getAllBookings();
      setBookings(response.data);
    } catch (error: any) {
      message.error(error.message);

      // Si el error es por falta de internet
      if (!navigator.onLine) {
        navigate("/offline");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
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
      render: (event: any) => event.name,
    },
    {
      title: "Usuario",
      dataIndex: "user",
      key: "user",
      render: (user: any) => user.name,
    },
    {
      title: "Evento Fecha & Hora",
      dataIndex: "event",
      key: "eventDate",
      render: (event: any) => getDateTimeFormat(`${event.date} ${event.time}`),
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
        const translated = statusMap[status.toLowerCase()] || status;
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
