# E-Commerce Marketplace Project Documentation

## Overview

This project is a full-stack e-commerce marketplace application, featuring a React/Redux frontend and a Node.js/Express/MongoDB backend. It supports user authentication, seller dashboards, product and bundle management, a cart system, and is ready for Docker deployment.

---

## Features

- **User Authentication:** JWT-based login/logout, session persistence, protected routes
- **Seller Dashboard:** Manage products and bundles, only see/manage own items
- **Product Management:** CRUD for products, seller-only access
- **Bundle Management:** Create/edit/delete bundles (at least 2 products, 10% discount logic)
- **Cart System:** Add bundles to cart, update quantities, remove/clear cart, cart persists per user
- **Pagination:** All listings (products, bundles, seller dashboards) support pagination
- **Modern UI:** Responsive, clean design with navigation, protected seller/customer views
- **Testing:** Jest + React Testing Library for frontend, backend tests (if implemented)
- **Deployment:** Dockerfile for backend, ready for production deployment

---

## Tech Stack

- **Frontend:** React, Redux Toolkit, React Router, Sass, Jest, React Testing Library
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **DevOps:** Docker

---

## Project Structure

```
Assignment/
  backend/
    src/
      controllers/      # Express controllers (products, bundles, cart, user)
      middleware/       # Auth and role middleware
      models/           # Mongoose models (User, Product, Bundle, Cart)
      routes/           # Express routes
      tests/            # Backend tests (if any)
    Dockerfile          # Backend Dockerfile
    package.json        # Backend dependencies
  frontend/
    src/
      components/       # React components (Header, Footer, ProductList, Cart, SellerDashboard, etc.)
      redux/            # Redux slices (products, bundles, cart, user)
      tests/            # Frontend tests (Jest/RTL)
      app/              # Redux store
      styles/           # Sass modules
      utils/            # Helper functions (authFetch, etc.)
      App.js            # Main app with routing
      setupTests.js     # Jest setup
    package.json        # Frontend dependencies
  README.md             # Project overview and setup
  Project_Documentation.md # (This file)
```

---

## Setup & Installation

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB
- Docker (optional, for containerized deployment)

### Backend

```bash
cd backend
npm install
# Set up your .env file (see README.md for variables)
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Docker (Backend)

```bash
cd backend
docker build -t my-backend .
docker run -p 5000:5000 my-backend
```

---

## Key Business Logic

### Authentication & Authorization

- JWT tokens for login/logout
- Token stored in Redux and localStorage
- Protected routes for seller-only pages (via PrivateRoute)
- Token expiry handled: 401 logs out user

### Product & Bundle Management

- Sellers can only see/manage their own products/bundles
- Bundle creation requires at least 2 products, applies 10% discount
- Pagination for all listings (products, bundles, seller dashboards)

### Cart System

- Only bundles can be added to cart (not individual products)
- Cart supports add, update quantity, remove, clear
- Cart state persists per user
- Price and product info always populated after cart updates

### UI/UX

- Responsive, modern design
- Navigation between customer and seller views
- Clear error/loading states
- Pagination controls for all lists

---

## Testing

- **Frontend:** Jest + React Testing Library
  - Example: `frontend/src/tests/BundleManager.test.js` covers rendering, loading, error, CRUD UI, and pagination for BundleManager
- **Backend:** (Add backend test info if implemented)

---

## Deployment

- Backend is Dockerized (see backend/Dockerfile)
- See README.md for full deployment instructions

---

## Additional Notes

- All code is modular, clean, and production-ready
- Comments and unused files have been removed
- For further enhancements, consider adding more tests, Docker Compose, or advanced features (search, filtering, etc.)
