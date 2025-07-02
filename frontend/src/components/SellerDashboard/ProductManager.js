import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../redux/slices/productsSlice";

const initialForm = {
  name: "",
  description: "",
  price: "",
  onSale: false,
  salePrice: "",
};

const ProductManager = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateProduct({ id: editingId, updates: form }));
    } else {
      dispatch(createProduct(form));
    }
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      onSale: product.onSale,
      salePrice: product.salePrice || "",
    });
    setEditingId(product._id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Product Manager</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "2rem",
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          style={{ width: "100%", marginBottom: 8 }}
        />
        <label style={{ display: "block", marginBottom: 8 }}>
          <input
            name="onSale"
            type="checkbox"
            checked={form.onSale}
            onChange={handleChange}
          />{" "}
          On Sale
        </label>
        {form.onSale && (
          <input
            name="salePrice"
            type="number"
            value={form.salePrice}
            onChange={handleChange}
            placeholder="Sale Price"
            style={{ width: "100%", marginBottom: 8 }}
          />
        )}
        <button type="submit" style={{ width: "100%" }}>
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>
      {status === "loading" && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((product) => (
          <li
            key={product._id}
            style={{
              border: "1px solid #eee",
              marginBottom: 8,
              padding: 8,
              borderRadius: 4,
            }}
          >
            <strong>{product.name}</strong> - ${product.price}
            {product.onSale && product.salePrice && (
              <span style={{ color: "green", marginLeft: 8 }}>
                On Sale: ${product.salePrice}
              </span>
            )}
            <div style={{ marginTop: 4 }}>
              <button
                onClick={() => handleEdit(product)}
                style={{ marginRight: 8 }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                style={{ color: "red" }}
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

export default ProductManager;
