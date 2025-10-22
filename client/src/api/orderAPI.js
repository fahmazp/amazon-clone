import axiosInstance from "./axiosInstance";

export const createOrder = async (orderData) => {
  const { data } = await axiosInstance.post("/orders/create-order", orderData);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await axiosInstance.get("/orders/myorders");
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await axiosInstance.get(`/orders/get-orders/${id}`);
  return data;
};
