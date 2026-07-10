import api from "./api";

export const getAllProducts = async (params = {}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const getSimilarProducts = async (id) => {
  const res = await api.get(`/products/${id}/similar`);
  return res.data;
};

export const createProduct = async (formData) => {
  const res = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProduct = async (id, formData) => {
  const res = await api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};