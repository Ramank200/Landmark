const jwt = require("jsonwebtoken");

const payload = {
  _id: "6865076b638b213a5fd0d613", // your seller user's _id
  email: "alice@example.com",
  isSeller: true,
};

const token = jwt.sign(payload, "kettyPerry999666333", { expiresIn: "1h" });
console.log(token);

// {
//     _id: "64f1a2b3c4d5e6f7890a9999", // your seller user's _id
//     email: "seller@example.com",
//     isSeller: true,
//   };

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGYxYTJiM2M0ZDVlNmY3ODkwYTk5OTkiLCJlbWFpbCI6InNlbGxlckBleGFtcGxlLmNvbSIsImlzU2VsbGVyIjp0cnVlLCJpYXQiOjE3NTE0NTI5MDYsImV4cCI6MTc1MTQ1NjUwNn0.JSaIZB-d9R1EpOEJYdTQhqRzcRfTtBHGDV4kY89r5yQ
