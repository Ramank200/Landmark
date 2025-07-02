import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const BundleDisplay = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const cartStatus = useSelector((state) => state.cart.status);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProducts());
    const fetchBundles = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:5000/bundles";
        // If you want sellers to see only their bundles in this view, uncomment below:
        // if (user && user.isSeller) url += "?seller=me";
        const res = await fetch(url);
        const data = await res.json();
        setBundles(data.bundles || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch bundles");
      }
      setLoading(false);
    };
    fetchBundles();
  }, [dispatch, user]);

  if (loading) return <div>Loading bundles...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const handleAddToCart = (bundleId) => {
    dispatch(addToCart({ type: "bundle", bundle: bundleId, quantity: 1 }));
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Available Bundles
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
    </div>
  );
};

export default BundleDisplay;
