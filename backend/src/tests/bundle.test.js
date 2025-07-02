import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app.js";
import mongoose from "mongoose";
import Bundle from "../models/Bundle.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

chai.use(chaiHttp);
const { expect } = chai;

// Helper to generate JWT
function generateToken(user) {
  return jwt.sign(
    { _id: user._id.toString(), email: user.email, isSeller: user.isSeller },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

describe("Bundle API", function () {
  let seller,
    otherSeller,
    buyer,
    product1,
    product2,
    product3,
    bundle,
    sellerToken,
    otherSellerToken,
    buyerToken;

  before(async function () {
    // Connect to test DB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Bundle.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    // Create users
    seller = await User.create({
      name: "Seller",
      email: "seller@test.com",
      password: "pass",
      isSeller: true,
    });
    otherSeller = await User.create({
      name: "Other Seller",
      email: "other@test.com",
      password: "pass",
      isSeller: true,
    });
    buyer = await User.create({
      name: "Buyer",
      email: "buyer@test.com",
      password: "pass",
      isSeller: false,
    });
    sellerToken = generateToken(seller);
    otherSellerToken = generateToken(otherSeller);
    buyerToken = generateToken(buyer);
    // Create products
    product1 = await Product.create({
      name: "P1",
      price: 10,
      seller: seller._id,
    });
    product2 = await Product.create({
      name: "P2",
      price: 20,
      onSale: true,
      salePrice: 15,
      seller: seller._id,
    });
    product3 = await Product.create({
      name: "P3",
      price: 30,
      seller: seller._id,
    });
    // Create a bundle
    bundle = await Bundle.create({
      name: "Bundle1",
      products: [product1._id, product2._id],
      seller: seller._id,
      discountedPrice: 22.5,
    });
  });

  after(async function () {
    await Bundle.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  describe("POST /bundles", function () {
    it("should create a bundle (seller)", async function () {
      const res = await chai
        .request(app)
        .post("/bundles")
        .set("Authorization", `Bearer ${sellerToken}`)
        .send({ name: "Test Bundle", products: [product1._id, product2._id] });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property("name", "Test Bundle");
      expect(res.body).to.have.property("discountedPrice");
    });
    it("should not create a bundle if not seller", async function () {
      const res = await chai
        .request(app)
        .post("/bundles")
        .set("Authorization", `Bearer ${buyerToken}`)
        .send({ name: "Test Bundle", products: [product1._id, product2._id] });
      expect(res).to.have.status(403);
    });
    it("should not create a bundle with <2 products", async function () {
      const res = await chai
        .request(app)
        .post("/bundles")
        .set("Authorization", `Bearer ${sellerToken}`)
        .send({ name: "Test Bundle", products: [product1._id] });
      expect(res).to.have.status(400);
    });
    it("should not create a bundle if unauthenticated", async function () {
      const res = await chai
        .request(app)
        .post("/bundles")
        .send({ name: "Test Bundle", products: [product1._id, product2._id] });
      expect(res).to.have.status(401);
    });
  });

  describe("GET /bundles", function () {
    it("should get all bundles (paginated)", async function () {
      const res = await chai.request(app).get("/bundles?page=1&limit=2");
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("bundles");
      expect(res.body).to.have.property("page", 1);
    });
  });

  describe("PATCH /bundles/:id", function () {
    it("should update bundle (owner seller)", async function () {
      const res = await chai
        .request(app)
        .patch(`/bundles/${bundle._id}`)
        .set("Authorization", `Bearer ${sellerToken}`)
        .send({
          name: "Updated Bundle",
          products: [product1._id, product3._id],
        });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("name", "Updated Bundle");
    });
    it("should not update if not owner", async function () {
      const res = await chai
        .request(app)
        .patch(`/bundles/${bundle._id}`)
        .set("Authorization", `Bearer ${otherSellerToken}`)
        .send({ name: "Hacked Bundle" });
      expect(res).to.have.status(403);
    });
    it("should not update if not seller", async function () {
      const res = await chai
        .request(app)
        .patch(`/bundles/${bundle._id}`)
        .set("Authorization", `Bearer ${buyerToken}`)
        .send({ name: "Hacked Bundle" });
      expect(res).to.have.status(403);
    });
    it("should not update if unauthenticated", async function () {
      const res = await chai
        .request(app)
        .patch(`/bundles/${bundle._id}`)
        .send({ name: "No Auth" });
      expect(res).to.have.status(401);
    });
    it("should return 404 for non-existent bundle", async function () {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await chai
        .request(app)
        .patch(`/bundles/${fakeId}`)
        .set("Authorization", `Bearer ${sellerToken}`)
        .send({ name: "No Bundle" });
      expect(res).to.have.status(404);
    });
  });

  describe("DELETE /bundles/:id", function () {
    it("should delete bundle (owner seller)", async function () {
      const newBundle = await Bundle.create({
        name: "ToDelete",
        products: [product1._id, product2._id],
        seller: seller._id,
        discountedPrice: 22.5,
      });
      const res = await chai
        .request(app)
        .delete(`/bundles/${newBundle._id}`)
        .set("Authorization", `Bearer ${sellerToken}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message", "Bundle deleted");
    });
    it("should not delete if not owner", async function () {
      const res = await chai
        .request(app)
        .delete(`/bundles/${bundle._id}`)
        .set("Authorization", `Bearer ${otherSellerToken}`);
      expect(res).to.have.status(403);
    });
    it("should not delete if not seller", async function () {
      const res = await chai
        .request(app)
        .delete(`/bundles/${bundle._id}`)
        .set("Authorization", `Bearer ${buyerToken}`);
      expect(res).to.have.status(403);
    });
    it("should not delete if unauthenticated", async function () {
      const res = await chai.request(app).delete(`/bundles/${bundle._id}`);
      expect(res).to.have.status(401);
    });
    it("should return 404 for non-existent bundle", async function () {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await chai
        .request(app)
        .delete(`/bundles/${fakeId}`)
        .set("Authorization", `Bearer ${sellerToken}`);
      expect(res).to.have.status(404);
    });
  });

  describe("GET /bundles/:id/checkDiscount", function () {
    it("should return discounted price for bundle", async function () {
      const res = await chai
        .request(app)
        .get(`/bundles/${bundle._id}/checkDiscount`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("discountedPrice");
    });
    it("should return 404 for non-existent bundle", async function () {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await chai
        .request(app)
        .get(`/bundles/${fakeId}/checkDiscount`);
      expect(res).to.have.status(404);
    });
  });
});
