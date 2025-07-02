require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/models/Product");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/marketplace";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const products = [
      {
        name: "Blazer",
        description: "Nylon Blazer",
        price: 1000,
        onSale: false,
        seller: new mongoose.Types.ObjectId("6865076b638b213a5fd0d613"),
      },
      {
        name: "Pants",
        description: "Summer Pants",
        price: 25,
        onSale: true,
        salePrice: 18,
        seller: new mongoose.Types.ObjectId("6865076b638b213a5fd0d613"),
      },
    ];
    const result = await Product.insertMany(products);
    console.log("Inserted products:", result);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error(err);
    mongoose.disconnect();
  });
