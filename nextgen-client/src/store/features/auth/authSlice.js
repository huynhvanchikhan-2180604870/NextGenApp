import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

// Async thunks
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.signin(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signin failed");
    }
  }
);

export const signout = createAsyncThunk(
  "auth/signout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.signout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signout failed");
    }
  }
);

export const sendVerificationCode = createAsyncThunk(
  "auth/sendVerificationCode",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authApi.sendVerificationCode(email);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send verification code"
      );
    }
  }
);

export const verifyCode = createAsyncThunk(
  "auth/verifyCode",
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyCode(verificationData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Code verification failed"
      );
    }
  }
);

// Create async thunk for getting profile
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isVerified: false,
  loading: false,
  error: null,
  verificationStatus: "idle", // 'idle' | 'pending' | 'success' | 'failed'
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetVerificationStatus: (state) => {
      state.verificationStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isVerified = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signin
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signout
      .addCase(signout.fulfilled, (state) => {
        return initialState;
      })
      // Verification code
      .addCase(sendVerificationCode.pending, (state) => {
        state.verificationStatus = "pending";
      })
      .addCase(sendVerificationCode.fulfilled, (state) => {
        state.verificationStatus = "success";
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.verificationStatus = "failed";
        state.error = action.payload;
      })
      // Verify code
      .addCase(verifyCode.fulfilled, (state) => {
        state.isVerified = true;
        state.verificationStatus = "success";
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.error = action.payload;
        state.verificationStatus = "failed";
      })
       // Handle profile fetching
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError, resetVerificationStatus } = authSlice.actions;
export default authSlice.reducer;
