import api from "./axios";

export const getUsers = () => api.get("/users");
export const createUser = (data) => api.post("/users", data);
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUserRole = (id, data) => api.patch(`/users/${id}/role`, data);
export const updateUserStatus = (id, data) => api.patch(`/users/${id}/status`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
