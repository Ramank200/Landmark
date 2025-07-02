import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch } from "../../utils/authFetch";

const API_URL = process.env.REACT_APP_API_URL;

// Fetch bundles for the logged-in seller
export const fetchSellerBundles = createAsyncThunk(
  "bundles/fetchSellerBundles",
  async ({ page = 1, limit = 10 } = {}, { getState, dispatch }) => {
    const state = getState();
    const token = state.user.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await authFetch(
      `${API_URL}/bundles?seller=me&page=${page}&limit=${limit}`,
      { headers },
      dispatch
    );
    const data = await response.json();
    return data;
  }
);

// Create a new bundle
export const createBundle = createAsyncThunk(
  "bundles/createBundle",
  async (bundle, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const token = state.user.token;
    try {
      const response = await authFetch(
        `${API_URL}/bundles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(bundle),
        },
        dispatch
      );
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Create failed");
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update a bundle
export const updateBundle = createAsyncThunk(
  "bundles/updateBundle",
  async ({ id, updates }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const token = state.user.token;
    try {
      const response = await authFetch(
        `${API_URL}/bundles/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(updates),
        },
        dispatch
      );
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Update failed");
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete a bundle
export const deleteBundle = createAsyncThunk(
  "bundles/deleteBundle",
  async (id, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const token = state.user.token;
    try {
      const response = await authFetch(
        `${API_URL}/bundles/${id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
        dispatch
      );
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Delete failed");
      }
      return { id };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const bundlesSlice = createSlice({
  name: "bundles",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    page: 1,
    totalPages: 1,
    totalBundles: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerBundles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSellerBundles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.bundles;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalBundles = action.payload.totalBundles;
      })
      .addCase(fetchSellerBundles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createBundle.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBundle.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteBundle.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b._id !== action.payload.id);
      });
  },
});

export default bundlesSlice.reducer;
