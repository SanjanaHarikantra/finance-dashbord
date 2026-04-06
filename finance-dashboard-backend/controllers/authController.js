const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { asyncHandler, AppError } = require("../utils/error");
const {
  validateRequiredFields,
  validateEmail,
  validatePassword
} = require("../utils/validators");
const { sanitizeUser } = require("../utils/sanitize");

const signToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role, status: user.status },
    process.env.JWT_SECRET || "secret123",
    { expiresIn: "1d" }
  );

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  validateRequiredFields({ name, email, password });
  validateEmail(email);
  validatePassword(password);

  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    throw new AppError(
      "Self registration is disabled after bootstrap. Ask an admin to create users.",
      403
    );
  }

  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    throw new AppError("Email is already in use.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "admin",
    status: "active"
  });

  const token = signToken(user);

  res.status(201).json({
    message: "Bootstrap admin account created.",
    token,
    user: sanitizeUser(user)
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  validateRequiredFields({ email, password });
  validateEmail(email);

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.status !== "active") {
    throw new AppError("This user account is inactive.", 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = signToken(user);

  res.json({
    message: "Login successful.",
    token,
    user: sanitizeUser(user)
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
