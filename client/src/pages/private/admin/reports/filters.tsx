import { Button, Form, Select } from "antd";

function AdminReportsFilters({
  filters,
  setFilters,
  events = [],
  onFilter,
}: {
  filters: any;
  setFilters: any;
  events?: any[];
  onFilter?: any;
}) {
  let disableFilterBtn = false;

  if (filters.startDate && !filters.endDate) {
    disableFilterBtn = true;
  }

  if (!filters.startDate && filters.endDate) {
    disableFilterBtn = true;
  }

  return (
    <Form
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end"
      layout="vertical"
    >
      <Form.Item label="Evento">
        <Select
          value={filters.eventId}
          onChange={(value) => setFilters({ ...filters, eventId: value })}
        >
          <Select.Option value="">Todos</Select.Option>
          {events.map((event: any) => (
            <Select.Option key={event._id} value={event._id}>
              {event.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>


      <div className="flex gap-5">
        <Button
          onClick={() => {
            const cleared = { startDate: "", endDate: "", eventId: "" };
            setFilters(cleared);
            if (onFilter) onFilter(cleared);
          }}
        >
          Limpiar filtros
        </Button>
        <Button
          type="primary"
          disabled={disableFilterBtn}
          onClick={() => {
            if (onFilter) onFilter(filters);
          }}
        >
          Buscar eventos
        </Button>
      </div>
    </Form>
  );
}

export default AdminReportsFilters;
