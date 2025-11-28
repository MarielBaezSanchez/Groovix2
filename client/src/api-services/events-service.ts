import axiosInstance from "../axiosConfig";

// CREATE EVENT
export const createEvent = async (data: any) => {
  const response: any = await axiosInstance.post("/events/create-event", data);
  return response.data;
};

// GET EVENTS
export const getEvents = async (filters: any) => {
  const response: any = await axiosInstance.get("/events/get-events", {
    params: {
      searchText: filters.searchText,
      date: filters.date,
    },
  });
  return response.data;
};

// GET EVENT BY ID
export const getEventById = async (id: string) => {
  const response: any = await axiosInstance.get(`/events/get-event/${id}`);
  return response.data;
};

// UPDATE EVENT
export const updateEvent = async (id: string, data: any) => {
  const response: any = await axiosInstance.put(`/events/edit-event/${id}`, data);
  return response.data;
};

// DELETE EVENT
export const deleteEvent = async (id: string) => {
  const response: any = await axiosInstance.delete(`/events/delete-event/${id}`);
  return response.data;
};
