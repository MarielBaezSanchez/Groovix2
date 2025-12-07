import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title";
import { BookingType } from "../../../../interfaces";
import { Popconfirm, Table, message } from "antd";
import {
  cancelBooking,
  getUserBookings,
} from "../../../../api-services/booking-service";
import { getDateTimeFormat } from "../../../../helpers/date-time-formats";

import { useOnlineStatus } from "../../../../helpers/useOnlineStatus";
import { useNavigate } from "react-router-dom";

function UserBookingsPage() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);

  const isOnline = useOnlineStatus(); // ⬅️ detectar conexión
  const navigate = useNavigate();

  // ⬅️ REDIRECCIÓN AUTOMÁTICA CUANDO NO HAY INTERNET
  useEffect(() => {
    if (!isOnline) {
      navigate("/offline");
    }
  }, [isOnline, navigate]);

  const getData = async () => {
    try {
      if (!isOnline) return; // ⬅️ evitar llamadas a la API sin conexión

      setLoading(true);
      const response = await getUserBookings();
      setBookings(response.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOnline) {
      getData();
    }
  }, [isOnline]);

  // Mapa de traducción de estados
  const statusMap: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    completed: "Completado",
    booked: "Reservado",
  };

  const onCanceBooking = async (booking: BookingType) => {
    try {
      if (!isOnline) {
        navigate("/offline");
        return;
      }

      setLoading(true);
      const payload = {
        eventId: booking.event._id,
        ticketTypeName: booking.ticketType,
        ticketsCount: booking.ticketsCount,
        bookingId: booking._id,
        paymentId: booking.paymentId,
      };

      await cancelBooking(payload);
      message.success("Reserva cancelada exitosamente");
      getData();
    } catch (error: any) {
      message.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Nombre de Evento",
      dataIndex: "event",
      key: "event",
      render: (event: any) => event.name,
    },
    {
      title: "Fecha y Hora de Evento",
      dataIndex: "event",
      key: "event",
      render: (event: any) => getDateTimeFormat(`${event.date} ${event.time}`),
    },
    {
      title: "Tipo de Boleto",
      dataIndex: "ticketType",
      key: "ticketType",
    },
    {
      title: "Cantidad de Boletos",
      dataIndex: "ticketsCount",
      key: "ticketsCount",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
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
    {
      title: "Reservado el",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => getDateTimeFormat(createdAt),
    },
    {
      title: "Acción",
      key: "action",
      render: (record: BookingType) => {
        if (record.status === "booked") {
          return (
            <Popconfirm
              title="¿Estás seguro de que deseas cancelar esta reserva?"
              onConfirm={() => onCanceBooking(record)}
              okText="Sí"
              cancelText="No"
              placement="leftBottom"
            >
              <span className="text-gray-600 cursor-pointer text-sm underline">
                Cancelar
              </span>
            </Popconfirm>
          );
        }
        return "";
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

export default UserBookingsPage;
