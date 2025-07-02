import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState }) => {
    const token = getState().user.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch("http://localhost:5000/cart", { headers });
    return await res.json();
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item, { getState }) => {
    const token = getState().user.token;
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch("http://localhost:5000/cart/add", {
      method: "POST",
      headers,
      body: JSON.stringify(item),
    });
    return await res.json();
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (item, { getState }) => {
    const token = getState().user.token;
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch("http://localhost:5000/cart/update", {
      method: "PATCH",
      headers,
      body: JSON.stringify(item),
    });
    return await res.json();
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (item, { getState }) => {
    const token = getState().user.token;
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch("http://localhost:5000/cart/remove", {
      method: "DELETE",
      headers,
      body: JSON.stringify(item),
    });
    return await res.json();
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState }) => {
    const token = getState().user.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch("http://localhost:5000/cart/clear", {
      method: "POST",
      headers,
    });
    return await res.json();
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export default cartSlice.reducer;
