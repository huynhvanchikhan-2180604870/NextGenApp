import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bannerApi } from "./bannersApi";

export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bannerApi.getBanners();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch banners"
      );
    }
  }
);

export const uploadBanner = createAsyncThunk(
  "banners/uploadBanner",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await bannerApi.uploadBanner(formData);
      // Refresh banners list after successful upload
      dispatch(fetchBanners());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload banner"
      );
    }
  }
);

const initialState = {
  banners: [],
  loading: false,
  error: null,
};

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch banners cases
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload banner cases
      .addCase(uploadBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadBanner.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;
