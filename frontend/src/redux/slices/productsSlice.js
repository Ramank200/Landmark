import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all products (public)
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState }) => {
    const state = getState();
    const token = state.user.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch("http://localhost:5000/products", { headers });
    const data = await response.json();
    console.log({ data });
    return data.products;
  }
);

// Fetch products for the logged-in seller
export const fetchSellerProducts = createAsyncThunk(
  "products/fetchSellerProducts",
  async (_, { getState }) => {
    const state = getState();
    const token = state.user.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch("http://localhost:5000/products?seller=me", {
      headers,
    });
    const data = await response.json();
    return data.products;
  }
);

// Create a new product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.user.token;
    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(product),
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

// Update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, updates }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.user.token;
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
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

// Delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.user.token;
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
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

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload.id);
      });
  },
});

export default productsSlice.reducer;
