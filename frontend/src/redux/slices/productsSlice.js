import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch } from "../../utils/authFetch";

const API_URL = process.env.REACT_APP_API_URL;

// Fetch all products (public)
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, limit = 10 } = {}, { getState }) => {
    const state = getState();
    const token = state.user.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(
      `${API_URL}/products?page=${page}&limit=${limit}`,
      { headers }
    );
    const data = await response.json();
    return data;
  }
);

// Fetch products for the logged-in seller
export const fetchSellerProducts = createAsyncThunk(
  "products/fetchSellerProducts",
  async ({ page = 1, limit = 10 } = {}, { getState, dispatch }) => {
    const state = getState();
    const token = state.user.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await authFetch(
      `${API_URL}/products?seller=me&page=${page}&limit=${limit}`,
      { headers },
      dispatch
    );
    const data = await response.json();
    return data;
  }
);

// Create a new product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const token = state.user.token;
    try {
      const response = await authFetch(
        `${API_URL}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(product),
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

// Update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, updates }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const token = state.user.token;
    try {
      const response = await authFetch(
        `${API_URL}/products/${id}`,
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

// Delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const token = state.user.token;
    try {
      const response = await authFetch(
        `${API_URL}/products/${id}`,
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

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    page: 1,
    totalPages: 1,
    totalProducts: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.items = action.payload.products;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalProducts;
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
