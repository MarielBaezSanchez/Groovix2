import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title";
import { message } from "antd";
import { getUserReports } from "../../../../api-services/reports-service";
import ReportCard from "../../admin/reports/report-card";
import { useOfflineRedirect } from "../../../../helpers/useOfflineRedirect";

function UserReports() {
  useOfflineRedirect(); 

  const [reports, setReports] = useState<any>({});

  const getData = async () => {
    try {
      const response = await getUserReports();
      setReports(response.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <PageTitle title="Reportes" />

      <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ReportCard
          title="Total de reservas"
          description="Total de reservas hechas por el usuario actual"
          value={reports.totalBookings}
          isAmountProperty={false}
        />

        <ReportCard
          title="Reservas canceladas"
          description="Total de reservas canceladas por el usuario actual"
          value={reports.cancelledBookings}
          isAmountProperty={false}
        />

        <ReportCard
          title="Cantidad de dinero gastada"
          description="Total de dinero gastado por el usuario actual"
          value={reports.totalAmountSpent}
          isAmountProperty={true}
        />

        <ReportCard
          title="Monto total recibido como reembolso"
          description="Importe total recibido en reembolsos por reservas canceladas"
          value={reports.totalAmountReceivedAsRefund}
          isAmountProperty={true}
        />

        <ReportCard
          title="Entradas compradas"
          description="Número total de boletos comprados para todos los eventos por el usuario actual"
          value={reports.totalTickets}
          isAmountProperty={false}
        />

        <ReportCard
          title="Boletos cancelados"
          description="Número total de boletos cancelados para todos los eventos por el usuario actual"
          value={reports.cancelledTickets}
          isAmountProperty={false}
        />
      </div>
    </div>
  );
}

export default UserReports;
