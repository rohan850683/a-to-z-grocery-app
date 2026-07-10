import api from "./api";

export const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const updateUserRole = async (userId, role) => {
  const res = await api.put(`/users/${userId}/role`, { role });
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
};