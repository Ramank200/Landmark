import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector((state) => state.products);
  const cartStatus = useSelector((state) => state.cart.status);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === "loading") return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ type: "product", product: productId, quantity: 1 }));
  };

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
            <button
              style={{ marginLeft: 12 }}
              onClick={() => handleAddToCart(product._id)}
              disabled={cartStatus === "loading"}
            >
              {cartStatus === "loading" ? "Adding..." : "Add to Cart"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
