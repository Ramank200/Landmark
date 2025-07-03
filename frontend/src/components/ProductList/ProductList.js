import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/slices/productsSlice";
// import { addToCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error, page, totalPages } = useSelector(
    (state) => state.products
  );
  // const cartStatus = useSelector((state) => state.cart.status);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(fetchProducts({ page: newPage, limit: 10 }));
  };

  if (status === "loading") return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // const handleAddToCart = (productId) => {
  // Removed: dispatch(addToCart({ type: "product", product: productId, quantity: 1 }));
  // };

  return (
    <div>
      <h2>Products</h2>
      <button
        style={{
          marginBottom: 16,
          padding: "8px 16px",
          borderRadius: 6,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          cursor: "pointer",
        }}
        onClick={() => navigate("/seller/products")}
      >
        Go to My Products
      </button>
      <ul>
        {items.map((product) => (
          <li key={product._id} style={{ marginBottom: 12 }}>
            {product.name} - ${product.price}
            {/* Removed Add to Cart button for products */}
          </li>
        ))}
      </ul>

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

export default ProductList;
