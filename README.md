# E-Commerce Marketplace

A scalable full-stack e-commerce marketplace with product bundles, seller dashboards, and a robust cart system.

---

## Features

- **User Authentication:** JWT-based login/register, session restore, seller-only routes
- **Product Management:** Sellers can create, update, and delete products
- **Bundle Management:** Sellers can create product bundles with automatic discount logic
- **Cart System:** Customers can add products and bundles to cart, update quantities, and checkout
- **Pagination:** Supported for products and bundles
- **Responsive UI:** Modern React app with Redux Toolkit and Sass modules
- **Dockerized:** Easy deployment with Docker

---

## Tech Stack

- **Frontend:** React, Redux Toolkit, React Router, Sass
- **Backend:** Node.js, Express, MongoDB, JWT
- **Testing:** Mocha/Chai (backend), Jest/React Testing Library (frontend)
- **Containerization:** Docker

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- Docker (optional, for containerized deployment)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Assignment
```

### 2. Environment Variables

#### Backend (`backend/.env`):

```
MONGO_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=your_jwt_secret
PORT=5000
```

#### Frontend (`frontend/.env`):

```
REACT_APP_API_URL=http://localhost:5000
```

USE EMAIL - jenifer@example.com, PASSWORD - yourpassword for authentication as seller

### 3. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

### 4. Run the App

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend
npm start
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

---

## Docker Deployment

1. **Build the Docker image for the backend:**

   ```bash
   cd backend
   docker build -t my-app:latest .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -d -p 5000:5000 --name my-container my-app:latest
   ```

   - The backend will be available at [http://localhost:5000](http://localhost:5000)
   - Make sure your `.env` file is present in the `backend` directory for environment variables.

3. (Optional) Use Docker Compose for full stack deployment.

---

## Project Structure

```
Assignment/
  backend/
    src/
      controllers/
      models/
      routes/
      middleware/
      ...
  frontend/
    src/
      components/
      redux/
      styles/
      ...
```

---

## Key Business Logic

- **Bundle Discount:** 10% off the total price of products in a bundle (after sale prices, if any). Bundles require at least 2 products.
- **Seller Dashboard:** Sellers manage their own products and bundles.
- **Cart:** Supports both products and bundles, with quantity updates and removal.

---

## Testing

- Backend: `npm test` in `backend/`
- Frontend: `npm test` in `frontend/`

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)
