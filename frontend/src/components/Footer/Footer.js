import React from "react";
import styles from "./Footer.module.scss";

const Footer = () => (
  <footer className={styles.footer}>
    <p>
      &copy; {new Date().getFullYear()} Marketplace. All rights reserved.
      <a href="/" target="_blank" rel="noopener noreferrer">
        Your Company
      </a>
    </p>
  </footer>
);

export default Footer;
