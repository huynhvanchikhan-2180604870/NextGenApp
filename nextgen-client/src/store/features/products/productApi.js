import axiosClient from "../../services/axiosClient";

export const productApi = {
  getAllProducts: async (params) => {
    const response = await axiosClient.get("/products", { params });
    return response.data;
  },

  getProduct: async (id) => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (formData) => {
    try {
      const response = await axiosClient.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Important for authentication
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProduct: async ({ id, formData }) => {
    try {
      const response = await axiosClient.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Important for authentication
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteProduct: async (id) => {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  },

  addReview: async (id, reviewData) => {
    const response = await axiosClient.post(
      `/products/${id}/reviews`,
      reviewData
    );
    return response.data;
  },

  incrementDownloads: async (id) => {
    const response = await axiosClient.post(`/products/${id}/downloads`);
    return response.data;
  },
};
