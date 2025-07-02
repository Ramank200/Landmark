import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch bundles for the logged-in seller
export const fetchSellerBundles = createAsyncThunk(
  "bundles/fetchSellerBundles",
  async (_, { getState }) => {
    const state = getState();
    const token = state.user.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch("http://localhost:5000/bundles?seller=me", {
      headers,
    });
    const data = await response.json();
    return data.bundles;
  }
);

// Create a new bundle
export const createBundle = createAsyncThunk(
  "bundles/createBundle",
  async (bundle, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.user.token;
    try {
      const response = await fetch("http://localhost:5000/bundles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(bundle),
      });
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
  async ({ id, updates }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.user.token;
    try {
      const response = await fetch(`http://localhost:5000/bundles/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updates),
      });
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
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.user.token;
    try {
      const response = await fetch(`http://localhost:5000/bundles/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
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
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerBundles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSellerBundles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
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
