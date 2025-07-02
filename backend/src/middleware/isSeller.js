module.exports = (req, res, next) => {
  if (!req.user || !req.user.isSeller) {
    return res.status(403).json({ message: "Seller access required" });
  }
  next();
};
