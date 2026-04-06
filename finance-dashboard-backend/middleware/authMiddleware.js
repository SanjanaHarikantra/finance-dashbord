const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { asyncHandler, AppError } = require("../utils/error");

exports.protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authorization token is required.", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
  } catch (error) {
    throw new AppError("Invalid or expired token.", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError("User linked to this token no longer exists.", 401);
  }

  if (user.status !== "active") {
    throw new AppError("Inactive users cannot access this resource.", 403);
  }

  req.user = user;
  next();
});

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission for this action.", 403));
  }

  next();
};
