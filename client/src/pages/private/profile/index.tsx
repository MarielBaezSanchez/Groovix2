import PageTitle from "../../../components/page-title";
import { getDateTimeFormat } from "../../../helpers/date-time-formats";
import usersGlobalStore, { UsersStoreType } from "../../../store/users-store";

function ProfilePage() {
  const { currentUser }: UsersStoreType = usersGlobalStore() as UsersStoreType;

  if (!currentUser) return null;

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
        {renderUserProperty("Id de Usuario", currentUser?._id)}
        {renderUserProperty("Nombre", currentUser?.name)}
        {renderUserProperty("Email", currentUser?.email)}
        {renderUserProperty(
          "Se  unió el",
          getDateTimeFormat(currentUser.createdAt!)
        )}
        {renderUserProperty(
          "Estado",
          currentUser?.isActive ? "Activo" : "Inactivo"
        )}
        {renderUserProperty("Rol", currentUser?.isAdmin ? "Admin" : "Usuario")}
      </div>
    </div>
  );
}

export default ProfilePage;
