import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellerBundles,
  createBundle,
  updateBundle,
  deleteBundle,
} from "../../redux/slices/bundlesSlice";
import { fetchSellerProducts } from "../../redux/slices/productsSlice";

const initialForm = { name: "", products: [] };

const BundleManager = () => {
  const dispatch = useDispatch();
  const {
    items: bundles,
    status,
    error,
  } = useSelector((state) => state.bundles);
  const { items: products } = useSelector((state) => state.products);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchSellerBundles());
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProductToggle = (productId) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter((id) => id !== productId)
        : [...prev.products, productId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.products.length < 2) {
      setFormError("A bundle must contain at least 2 products.");
      return;
    }
    setFormError("");
    if (editingId) {
      dispatch(updateBundle({ id: editingId, updates: form }));
    } else {
      dispatch(createBundle(form));
    }
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (bundle) => {
    setForm({
      name: bundle.name,
      products: bundle.products.map((p) => (typeof p === "string" ? p : p._id)),
    });
    setEditingId(bundle._id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this bundle?")) {
      dispatch(deleteBundle(id));
    }
  };

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
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Bundle Manager</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "2rem",
          border: "1px solid #e0e0e0",
          padding: "1.5rem",
          borderRadius: 10,
          background: "#fafbfc",
        }}
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Bundle Name"
          required
          style={{
            width: "100%",
            marginBottom: 12,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <div style={{ marginBottom: 12 }}>
          <strong>Select Products:</strong>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 10,
            }}
          >
            {products.map((product) => (
              <label
                key={product._id}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 6,
                  padding: "6px 10px",
                  background: "#f5f5f5",
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.products.includes(product._id)}
                  onChange={() => handleProductToggle(product._id)}
                  style={{ marginRight: 6 }}
                />
                {product.name}
              </label>
            ))}
          </div>
        </div>
        {formError && (
          <div style={{ color: "red", marginBottom: 10 }}>{formError}</div>
        )}
        <button
          type="submit"
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
          {editingId ? "Update Bundle" : "Add Bundle"}
        </button>
      </form>
      {status === "loading" && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {bundles.map((bundle) => (
          <li
            key={bundle._id}
            style={{
              border: "1px solid #e0e0e0",
              marginBottom: 12,
              padding: 16,
              borderRadius: 8,
              background: "#f9f9f9",
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            }}
          >
            <strong style={{ fontSize: 18 }}>{bundle.name}</strong>
            <div style={{ margin: "8px 0" }}>
              Products:{" "}
              {bundle.products
                .map((p) => (typeof p === "string" ? p : p.name))
                .join(", ")}
            </div>
            <div style={{ marginTop: 4 }}>
              <button
                onClick={() => handleEdit(bundle)}
                style={{
                  marginRight: 10,
                  padding: "6px 14px",
                  borderRadius: 5,
                  border: "none",
                  background: "#1976d2",
                  color: "#fff",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(bundle._id)}
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
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BundleManager;
