import { useEffect, useState } from "react";
import { UserType } from "../../../../interfaces";
import { Table, message } from "antd";
import {
  getAllUsers,
  updateUserData,
} from "../../../../api-services/users-service";
import { getDateTimeFormat } from "../../../../helpers/date-time-formats";
import PageTitle from "../../../../components/page-title";
import { useNavigate } from "react-router-dom";

function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 Si entra sin internet → redirige de inmediato
  useEffect(() => {
    if (!navigator.onLine) {
      navigate("/offline");
    }
  }, [navigate]);

  const getData = async () => {
    try {
      setLoading(true);

      // Si pierde internet antes de la petición
      if (!navigator.onLine) {
        navigate("/offline");
        return;
      }

      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error: any) {
      message.error(error.response?.data?.message || error.message);

      // Si el error fue por falta de internet
      if (!navigator.onLine) navigate("/offline");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: any) => {
    try {
      setLoading(true);

      if (!navigator.onLine) {
        navigate("/offline");
        return;
      }

      await updateUserData(data);
      message.success("Usuario actualizado correctamente");
      getData();
    } catch (error: any) {
      message.error(error.response?.data?.message || error.message);

      if (!navigator.onLine) navigate("/offline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns: any = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "id",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Registrado el:",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => getDateTimeFormat(createdAt),
    },
    {
      title: "Rol",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin: boolean, row: UserType) => {
        return (
          <select
            value={isAdmin ? "admin" : "user"}
            className="border border-solid border-gray-600"
            onChange={(e) => {
              const isAdminUpdated = e.target.value === "admin";
              updateUser({ userId: row._id, isAdmin: isAdminUpdated });
            }}
          >
            <option value="user">Usuario</option>
            <option value="admin">Admin</option>
          </select>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, row: UserType) => {
        return (
          <select
            value={isActive ? "active" : "blocked"}
            className="border border-solid border-gray-600"
            onChange={(e) => {
              const isActiveUpdated = e.target.value === "active";
              updateUser({ userId: row._id, isActive: isActiveUpdated });
            }}
          >
            <option value="active">Activo</option>
            <option value="blocked">Bloqueado</option>
          </select>
        );
      },
    },
  ];

  return (
    <div>
      <PageTitle title="Usuarios" />
      <Table
        dataSource={users}
        columns={columns}
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
}

export default UsersPage;
