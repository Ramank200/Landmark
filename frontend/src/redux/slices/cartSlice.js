import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch } from "../../utils/authFetch";

const API_URL = process.env.REACT_APP_API_URL;

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, dispatch }) => {
    const token = getState().user.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await authFetch(`${API_URL}/cart`, { headers }, dispatch);
    return await res.json();
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item, { getState, dispatch }) => {
    const token = getState().user.token;
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await authFetch(
      `${API_URL}/cart/add`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(item),
      },
      dispatch
    );
    return await res.json();
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (item, { getState, dispatch }) => {
    const token = getState().user.token;
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await authFetch(
      `${API_URL}/cart/update`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(item),
      },
      dispatch
    );
    return await res.json();
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (item, { getState, dispatch }) => {
    const token = getState().user.token;
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await authFetch(
      `${API_URL}/cart/remove`,
      {
        method: "DELETE",
        headers,
        body: JSON.stringify(item),
      },
      dispatch
    );
    return await res.json();
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, dispatch }) => {
    const token = getState().user.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await authFetch(
      `${API_URL}/cart/clear`,
      {
        method: "POST",
        headers,
      },
      dispatch
    );
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
