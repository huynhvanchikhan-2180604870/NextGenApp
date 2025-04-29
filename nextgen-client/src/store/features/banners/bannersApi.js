import axiosClient from "../../services/axiosClient";

export const bannerApi = {
  // Get all banners
  getBanners: async () => {
    const response = await axiosClient.get("/banners");
    console.log("Banners fetched call api:", response.data);
    return response.data;
  },

  // Upload new banner
  uploadBanner: async (formData) => {
    const response = await axiosClient.post("/banners/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete banner
  deleteBanner: async (id) => {
    const response = await axiosClient.delete(`/banners/${id}`);
    return response.data;
  },
};
