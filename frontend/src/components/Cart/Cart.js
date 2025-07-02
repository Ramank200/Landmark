import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../../redux/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, status, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (item, quantity) => {
    if (quantity < 1) return;
    dispatch(
      updateCartItem({
        type: item.type,
        product: item.product?._id || item.product,
        bundle: item.bundle?._id || item.bundle,
        quantity,
      })
    );
  };

  const handleRemove = (item) => {
    dispatch(
      removeFromCart({
        type: item.type,
        product: item.product?._id || item.product,
        bundle: item.bundle?._id || item.bundle,
      })
    );
  };

  const handleClear = () => {
    if (window.confirm("Clear the cart?")) {
      dispatch(clearCart());
    }
  };

  const getItemName = (item) => {
    if (item.type === "product") return item.product?.name || "Product";
    if (item.type === "bundle") return item.bundle?.name || "Bundle";
    return "";
  };

  const getItemPrice = (item) => {
    if (item.type === "product") {
      if (item.product?.onSale && item.product?.salePrice)
        return item.product.salePrice;
      return item.product?.price || 0;
    }
    if (item.type === "bundle") return item.bundle?.discountedPrice || 0;
    return 0;
  };

  const total =
    cart?.items?.reduce(
      (sum, item) => sum + getItemPrice(item) * item.quantity,
      0
    ) || 0;

  if (status === "loading") return <div>Loading cart...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "2rem auto",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Your Cart</h2>
      {!cart || !cart.items || cart.items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.items.map((item, idx) => (
              <li
                key={idx}
                style={{
                  border: "1px solid #e0e0e0",
                  marginBottom: 12,
                  padding: 16,
                  borderRadius: 8,
                  background: "#f9f9f9",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                }}
              >
                <strong>{getItemName(item)}</strong> ({item.type})
                <div style={{ margin: "8px 0" }}>
                  Price: ${getItemPrice(item)} x
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      let value = Number(e.target.value);
                      if (!value || value < 1) value = 1;
                      handleQuantityChange(item, value);
                    }}
                    style={{ width: 50, marginLeft: 8, marginRight: 8 }}
                  />
                  = ${(getItemPrice(item) * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => handleRemove(item)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 5,
                    border: "none",
                    background: "#d32f2f",
                    color: "#fff",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div style={{ fontWeight: 600, fontSize: 18, margin: "16px 0" }}>
            Total: ${total.toFixed(2)}
          </div>
          <button
            onClick={handleClear}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              background: "#222",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
