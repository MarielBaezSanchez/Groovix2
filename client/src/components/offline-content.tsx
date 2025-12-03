import { AlertCircle } from "lucide-react";

interface OfflineContentProps {
  title?: string;
  message?: string;
}

function OfflineContent({
  title = "Sin conexión a internet",
  message = "Por seguridad, no puedes acceder a este contenido sin conexión. Por favor, conéctate a una red.",
}: OfflineContentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] px-4">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            ⚠️ Por seguridad, Groovix requiere conexión a internet para acceder a esta sección.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OfflineContent;
