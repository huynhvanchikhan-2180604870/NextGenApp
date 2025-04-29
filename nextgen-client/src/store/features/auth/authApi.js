import axiosClient from "../../services/axiosClient";

export const authApi = {
  // Sign up new user
  signup: async (userData) => {
    const response = await axiosClient.post("/auth/signup", userData);
    return response.data;
  },

  // Sign in user
  signin: async (credentials) => {
    const response = await axiosClient.post("/auth/signin", credentials);
    return response.data;
  },

  // Sign out user
  signout: async () => {
    const response = await axiosClient.post("/auth/signout");
    return response.data;
  },

  // Send verification code
  sendVerificationCode: async (email) => {
    const response = await axiosClient.patch("/auth/send-verification-code", {
      email,
    });
    return response.data;
  },

  // Verify code
  verifyCode: async (verificationData) => {
    const response = await axiosClient.patch(
      "/auth/verify-verification-code",
      verificationData
    );
    return response.data;
  },

  //get user profile
  getProfile: async () => {
    const response = await axiosClient.get("/users/profile");
    return response.data;
  },
};
