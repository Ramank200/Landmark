import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productsSlice";
import {
  fetchBundles,
  fetchSellerBundles,
} from "../../redux/slices/bundlesSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const BundleDisplay = () => {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const {
    items: bundles,
    status,
    error,
    page,
    totalPages,
  } = useSelector((state) => state.bundles);
  const cartStatus = useSelector((state) => state.cart.status);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProducts());
    // If user is a seller, fetch only their bundles, otherwise fetch all bundles
    if (user && user.isSeller) {
      dispatch(fetchSellerBundles({ page: 1, limit: 6 }));
    } else {
      dispatch(fetchBundles({ page: 1, limit: 6 }));
    }
  }, [dispatch, user]);

  const handlePageChange = (newPage) => {
    // If user is a seller, fetch only their bundles, otherwise fetch all bundles
    if (user && user.isSeller) {
      dispatch(fetchSellerBundles({ page: newPage, limit: 6 }));
    } else {
      dispatch(fetchBundles({ page: newPage, limit: 6 }));
    }
  };

  if (status === "loading") return <div>Loading bundles...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const handleAddToCart = (bundleId) => {
    dispatch(addToCart({ type: "bundle", bundle: bundleId, quantity: 1 }));
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        {user && user.isSeller ? "My Bundles" : "Available Bundles"}
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
        }}
      >
        {bundles.map((bundle) => (
          <div
            key={bundle._id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 10,
              padding: 20,
              background: "#fff",
              minWidth: 260,
              maxWidth: 320,
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            }}
          >
            <h3 style={{ marginBottom: 10 }}>{bundle.name}</h3>
            <div style={{ marginBottom: 8 }}>
              <strong>Products:</strong>{" "}
              {bundle.products
                .map((p) => (typeof p === "string" ? p : p.name))
                .join(", ")}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Discounted Price:</strong> ${bundle.discountedPrice}
            </div>
            <button
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                background: "#1976d2",
                color: "#fff",
                fontWeight: 600,
                border: "none",
                fontSize: 15,
                cursor: "pointer",
              }}
              onClick={() => handleAddToCart(bundle._id)}
              disabled={cartStatus === "loading"}
            >
              {cartStatus === "loading" ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 30,
            alignItems: "center",
          }}
        >
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              background: page <= 1 ? "#ccc" : "#1976d2",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: page <= 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>

          <span style={{ fontWeight: 600 }}>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              background: page >= totalPages ? "#ccc" : "#1976d2",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: page >= totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BundleDisplay;
