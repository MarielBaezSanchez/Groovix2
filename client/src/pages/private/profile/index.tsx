import PageTitle from "../../../components/page-title";
import { getDateTimeFormat } from "../../../helpers/date-time-formats";
import usersGlobalStore, { UsersStoreType } from "../../../store/users-store";
import { useEffect, useState } from "react";

function ProfilePage() {
  const { currentUser }: UsersStoreType = usersGlobalStore() as UsersStoreType;
  const [cachedUser, setCachedUser] = useState<any>(null);

  // Guardar en cache cada vez que haya usuario cargado desde el backend
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("cachedUser", JSON.stringify(currentUser));
      setCachedUser(currentUser);
    } else {
      const stored = localStorage.getItem("cachedUser");
      if (stored) setCachedUser(JSON.parse(stored));
    }
  }, [currentUser]);

  // Si no hay ninguno, no mostrar nada
  if (!cachedUser) return null;

  const renderUserProperty = (label: string, value: any) => {
    return (
      <div className="flex flex-col text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-800 font-semibold">{value}</span>
      </div>
    );
  };

  return (
    <div>
      <PageTitle title="Perfil" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">
        {renderUserProperty("Id de Usuario", cachedUser._id)}
        {renderUserProperty("Nombre", cachedUser.name)}
        {renderUserProperty("Email", cachedUser.email)}
        {renderUserProperty(
          "Se unió el",
          getDateTimeFormat(cachedUser.createdAt)
        )}
        {renderUserProperty(
          "Estado",
          cachedUser.isActive ? "Activo" : "Inactivo"
        )}
        {renderUserProperty("Rol", cachedUser.isAdmin ? "Admin" : "Usuario")}
      </div>
    </div>
  );
}

export default ProfilePage;
