import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title";
import AdminReportsFilters from "./filters";
import { Table, message } from "antd";
import { getEvents } from "../../../../api-services/events-service";
import { getAdminReports } from "../../../../api-services/reports-service";
import ReportCard from "./report-card";

function AdminReports() {
  const [reports, setReports] = useState<any>({});
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    eventId: "",
  });

  const getReports = async (filtersArg?: any) => {
    try {
      const payload = filtersArg || filters;
      const response = await getAdminReports(payload);
      setReports(response.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getEventsData = async () => {
    try {
      const response = await getEvents({ searchText: "", date: "" });
      setEvents(response.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    getEventsData();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      getReports();
    }
  }, [events]);

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
