import React from "react";

const BundleForm = ({
  form,
  onChange,
  onProductToggle,
  onSubmit,
  products,
  formError,
  editingId,
}) => {
  return (
    <form
      onSubmit={onSubmit}
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
        onChange={onChange}
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
                onChange={() => onProductToggle(product._id)}
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
  );
};

export default BundleForm;
