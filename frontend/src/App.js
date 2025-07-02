import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Footer from "./components/Footer/Footer";
import BundleDisplay from "./components/BundleDisplay/BundleDisplay";
import ProductList from "./components/ProductList/ProductList";
import Cart from "./components/Cart/Cart";
import BundleManager from "./components/SellerDashboard/BundleManager";
import ProductManager from "./components/SellerDashboard/ProductManager";
import Navbar from "./components/Header/Navbar";
import Login from "./components/Auth/Login";
import { useSelector, useDispatch } from "react-redux";
import { rehydrate } from "./redux/slices/userSlice";

const Home = () => <div>Welcome to the Marketplace!</div>;

function PrivateRoute({ children, sellerOnly = false }) {
  const { user } = useSelector((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  if (sellerOnly && !user.isSeller) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const dispatch = useDispatch();
  const { rehydrated } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(rehydrate());
  }, [dispatch]);

  if (!rehydrated) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: "60vh", padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bundles" element={<BundleDisplay />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/seller"
            element={
              <PrivateRoute sellerOnly={true}>
                <BundleManager />
              </PrivateRoute>
            }
          />
          <Route
            path="/seller/products"
            element={
              <PrivateRoute sellerOnly={true}>
                <ProductManager />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
