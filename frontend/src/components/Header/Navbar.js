import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";

const Navbar = () => (
  <nav className={styles.navbar}>
    <Link to="/">Home</Link>
    <Link to="/bundles">Bundles</Link>
    <Link to="/products">Products</Link>
    <Link to="/cart">Cart</Link>
    <Link to="/seller">Seller Dashboard</Link>
  </nav>
);

export default Navbar;
