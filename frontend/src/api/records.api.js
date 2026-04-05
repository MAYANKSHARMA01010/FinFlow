import api from "./axios";

export const getRecords = (params) => api.get("/records", { params });
export const getRecordById = (id) => api.get(`/records/${id}`);
export const createRecord = (data) => api.post("/records", data);
export const updateRecord = (id, data) => api.put(`/records/${id}`, data);
export const deleteRecord = (id) => api.delete(`/records/${id}`);
