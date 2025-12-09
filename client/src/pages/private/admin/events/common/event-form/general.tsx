import { Button, Form, Input, Tag } from "antd";
import { EventFormStepProps } from ".";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function General({
  currentStep,
  setCurrentStep,
  eventData,
  setEventData,
}: EventFormStepProps) {
  const [guestInputValue, setGuestInputValue] = useState("");
  const navigate = useNavigate();
  const onGuestAdd = () => {
    const existingGuests = eventData.guests || [];
    const newGuests = guestInputValue.split(",");
    setEventData({ ...eventData, guests: [...existingGuests, ...newGuests] });
    setGuestInputValue("");
  };

  const onGuestRemove = (index: number) => {
    const existingGuests = eventData.guests || [];
    const newGuests = existingGuests.filter(
      (_guest: string, i: number) => i !== index
    );
    setEventData({ ...eventData, guests: newGuests });
  };

  return (
    <div className="flex flex-col gap-5">
      <Form.Item label="Nombre de evento" required>
        <Input
          placeholder="Nombre de evento"
          value={eventData.name}
          onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
        />
      </Form.Item>

      <Form.Item label="Descripción" required>
        <Input.TextArea
          placeholder="Descripción"
          value={eventData.description}
          onChange={(e) =>
            setEventData({ ...eventData, description: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item label="Organizador" required>
        <Input
          placeholder="Organizador"
          value={eventData.organizer}
          onChange={(e) =>
            setEventData({ ...eventData, organizer: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item label="Lista de invitados (separar por medio de comas)" required>
        <div className="flex gap-5">
          <Input
            placeholder="Lista de invitados (separar por medio de comas"
            value={guestInputValue}
            onChange={(e) => setGuestInputValue(e.target.value)}
          />
          <Button onClick={onGuestAdd} disabled={!guestInputValue}>
            Agregar
          </Button>
        </div>
      </Form.Item>

      <div className="flex flex-wrap gap-5">
        {eventData.guests?.map((guest: string, index: number) => (
          <Tag key={guest} closable onClose={() => onGuestRemove(index)}>
            {guest}
          </Tag>
        ))}
      </div>

      <div className="flex gap-10 justify-between">
        <Button
          onClick={() => {
            navigate("/admin/events");
          }}
        >
          Regresar
        </Button>
        <Button
          type="primary"
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={
            !eventData.name || !eventData.description || !eventData.organizer
          }
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

export default General;
