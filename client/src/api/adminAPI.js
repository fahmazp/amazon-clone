import axiosInstance from "./axiosInstance";

// Product CRUD
export const getAdminProducts = async (keyword = "", page = 1, limit = 50) => {
  const params = new URLSearchParams();
  if (keyword) params.append("keyword", keyword);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const { data } = await axiosInstance.get(`/products?${params.toString()}`);
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await axiosInstance.post("/products", productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await axiosInstance.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await axiosInstance.delete(`/products/${id}`);
  return data;
};

export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await axiosInstance.post("/products/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Category CRUD
export const getCategories = async () => {
  const { data } = await axiosInstance.get("/categories");
  return data;
};

export const createCategory = async (categoryData) => {
  const { data } = await axiosInstance.post("/categories", categoryData);
  return data;
};

export const updateCategory = async (id, categoryData) => {
  const { data } = await axiosInstance.put(`/categories/${id}`, categoryData);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await axiosInstance.delete(`/categories/${id}`);
  return data;
};
