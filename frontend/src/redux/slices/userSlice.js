import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch } from "../../utils/authFetch";

const API_URL = process.env.REACT_APP_API_URL;

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await authFetch(
        `${API_URL}/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
        dispatch
      );
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Login failed");
      }
      const data = await response.json();
      // data should include { token, user }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  rehydrated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      state.rehydrated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    rehydrate(state) {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
      }
      state.rehydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, rehydrate } = userSlice.actions;
export default userSlice.reducer;
