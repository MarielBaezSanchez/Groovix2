import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title";
import { BookingType } from "../../../../interfaces";
import { Table, message } from "antd";
import { getAllBookings } from "../../../../api-services/booking-service";
import { getDateTimeFormat } from "../../../../helpers/date-time-formats";

function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
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
  }, []);

  // Mapa de traducción de estados
  const statusMap: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    completed: "Completado",
    booked: "Reservado",
    // agrega otros estados si los tienes
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
        return translated.charAt(0).toUpperCase() + translated.slice(1).toLowerCase();
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
