import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title";
import AdminReportsFilters from "./filters";
import { Table, message } from "antd";
import { getEvents } from "../../../../api-services/events-service";
import { getAdminReports } from "../../../../api-services/reports-service";
import ReportCard from "./report-card";
import { 
  saveReportsCacheToLocalStorage,
  getReportsCacheFromLocalStorage,
} from "../../../../hooks/useOnlineStatus";

function AdminReports() {
  const [reports, setReports] = useState<any>({});
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    eventId: "",
  });

  // ======================================================
  // 1. Obtener reportes (online + offline)
  // ======================================================
  const getReports = async (filtersArg?: any) => {
    const payload = filtersArg || filters;

    // 🟦 OFFLINE → cargar desde cache
    if (!navigator.onLine) {
      const cached = getReportsCacheFromLocalStorage();
      setReports(cached);
      return;
    }

    // 🟩 ONLINE → API real
    try {
      const response = await getAdminReports(payload);
      setReports(response.data);

      // Guardar en cache para offline
      saveReportsCacheToLocalStorage(response.data);
      
    } catch (error: any) {
      message.error(error.message);
    }
  };

  // ======================================================
  // 2. Obtener eventos (online + offline parcial)
  // ======================================================
  const getEventsData = async () => {
    // Si estás offline, simplemente no listamos eventos
    if (!navigator.onLine) return;

    try {
      const response = await getEvents({ searchText: "", date: "" });
      setEvents(response.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  // ======================================================
  // Ejecutar al cargar
  // ======================================================
  useEffect(() => {
    getEventsData();
  }, []);

  useEffect(() => {
    // Cargar reportes solo cuando tengamos los eventos (online)
    if (navigator.onLine) {
      if (events.length > 0) {
        getReports();
      }
    } else {
      // Si estamos offline, cargar reportes desde cache de inmediato
      const cached = getReportsCacheFromLocalStorage();
      setReports(cached);
    }
  }, [events]);

  // ======================================================
  // Columnas de tabla
  // ======================================================
  const ticketTypesColumns = [
    {
      title: "Tipo de boleto",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Boletos agotados",
      dataIndex: "ticketsSold",
      key: "ticketsSold",
    },
    {
      title: "Ganancia",
      dataIndex: "revenue",
      key: "revenue",
    },
  ];

  return (
    <div>
      <PageTitle title="Reportes" />

      <AdminReportsFilters
        events={events}
        filters={filters}
        setFilters={setFilters}
        onFilter={getReports}
      />

      <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ReportCard
          title="Total Reservas"
          description="Numero total de reservas por usuario"
          value={reports.totalBookings}
          isAmountProperty={false}
        />

        <ReportCard
          title="Cancelar reservas"
          description="Numero total de cancelaciones por usuario"
          value={reports.cancelledBookings}
          isAmountProperty={false}
        />

        <ReportCard
          title="Total ganancias"
          description="Numero total de ganacias por todos las reservas"
          value={reports.totalRevenueCollected}
          isAmountProperty={true}
        />

        <ReportCard
          title="Total de reembolso"
          description="Total de reembolso por reservas canceladas"
          value={reports.totalRevenueRefunded}
          isAmountProperty={true}
        />

        <ReportCard
          title="Boletos agotados"
          description="Total de boletos vendidos por evento"
          value={reports.totalTickets}
          isAmountProperty={false}
        />

        <ReportCard
          title="Boletos cancelados"
          description="Total de boletos cancelados por todos los eventos"
          value={reports.cancelledTickets}
          isAmountProperty={false}
        />
      </div>

      {reports.ticketTypesAndThierSales && (
        <div className="mt-7 flex flex-col gap-5">
          <h1 className="text-info text-sm font-bold col-span-4">
            Venta de boletos por evento
          </h1>

          <Table
            columns={ticketTypesColumns}
            dataSource={reports.ticketTypesAndThierSales}
          />
        </div>
      )}
    </div>
  );
}

export default AdminReports;
