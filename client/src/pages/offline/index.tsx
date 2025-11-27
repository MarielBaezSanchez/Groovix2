function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icono de WiFi desconectado */}
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-white opacity-80 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Sin conexión
        </h1>

        {/* Mensaje principal */}
        <p className="text-lg text-blue-100 mb-2">
          Por seguridad no puedes acceder a Groovix.
        </p>

        {/* Submensaje */}
        <p className="text-base text-blue-200 mb-8">
          Por favor, conéctate a alguna red
        </p>

        {/* Descripción */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 mb-8 border border-white border-opacity-20">
          <p className="text-sm text-blue-100">
            Parece que tu conexión a internet se ha interrumpido. Una vez que te reconectes, podrás acceder a todas las funcionalidades de Groovix.
          </p>
        </div>

        {/* Botón de reintentar */}
        <button
          onClick={() => window.location.reload()}
          className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Reintentar
        </button>

        {/* Logo o branding */}
        <div className="mt-12">
          <p className="text-blue-200 text-sm">
            ✨ Groovix
          </p>
        </div>
      </div>
    </div>
  );
}

export default OfflinePage;
