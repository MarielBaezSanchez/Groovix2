import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title";
import OfflineContent from "../../../../components/offline-content";
import ReportCard from "./report-card";
import { getReportsCacheFromLocalStorage } from "../../../../hooks/useOnlineStatus";

interface OfflineReport {
  totalBookings?: number;
  cancelledBookings?: number;
  totalTickets?: number;
  cancelledTickets?: number;
  totalRevenueCollected?: number;
  totalRevenueRefunded?: number;
  ticketTypesAndThierSales?: any[];
}

function AdminReportsOfflinePage() {
  const [reports, setReports] = useState<OfflineReport>({});

  useEffect(() => {
    // Recuperar reportes guardados en localStorage
    const reports = getReportsCacheFromLocalStorage();
    setReports(reports);
  }, []);

  const hasData = Object.keys(reports).length > 0 && reports.totalBookings !== undefined;

  if (!hasData) {
    return (
      <div>
        <PageTitle title="Reportes (Offline)" />
        <OfflineContent
          title="No hay reportes guardados"
          message="No hay datos de reportes disponibles en tu dispositivo. Conéctate a internet para cargar reportes."
        />
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="Reportes (Offline)" />

      <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ReportCard
          title="Total Reservas"
          description="Número total de reservas por usuario"
          value={reports.totalBookings}
          isAmountProperty={false}
        />

        <ReportCard
          title="Cancelar reservas"
          description="Número total de cancelaciones por usuario"
          value={reports.cancelledBookings}
          isAmountProperty={false}
        />

        <ReportCard
          title="Total ganancias"
          description="Número total de ganancias por todos las reservas"
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

      <div className="mt-7 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p className="text-sm text-orange-800">
          ℹ️ Estos son datos guardados localmente. Para datos actualizados, conéctate a internet.
        </p>
      </div>
    </div>
  );
}

export default AdminReportsOfflinePage;
