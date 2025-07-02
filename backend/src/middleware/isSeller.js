module.exports = function (req, res, next) {
  if (!req.user || !req.user.isSeller) {
    return res
      .status(403)
      .json({ message: "Access denied: Seller only resource." });
  }
  next();
};
