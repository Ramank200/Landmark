const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally, fetch user from DB if you want fresh data
    req.user = decoded; // { _id, email, isSeller, ... }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
