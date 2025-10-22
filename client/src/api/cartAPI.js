import axiosInstance from "./axiosInstance";

export const addToCart = async (productId, quantity = 1) => {
  try {
    const { data } = await axiosInstance.post("/cart/add-to-cart", {
      productId,
      quantity,
    });

    console.log("Cart Updated:", data);
    return data;
  } catch (error) {
    console.error("Add to Cart failed:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const getCart = async () => {
  try {
    const { data } = await axiosInstance.get("/cart/get-cart");
    return data;
  } catch (error) {
    console.error("Fetch Cart failed:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const removeFromCart = async (productId) => {
  try {
    const { data } = await axiosInstance.delete(`/cart/remove-from-cart/${productId}`);
    return data;
  } catch (error) {
    console.error("Remove from Cart failed:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const updateCartQuantity = async (productId, quantity) => {
  try {
    const { data } = await axiosInstance.put(`/cart/update-cart/${productId}`, {
      quantity,
    });
    return data;
  } catch (error) {
    console.error("Update Cart Quantity failed:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

