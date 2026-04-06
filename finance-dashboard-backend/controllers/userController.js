const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { asyncHandler, AppError } = require("../utils/error");
const {
  validateEmail,
  validatePassword,
  validateRole,
  validateStatus,
  validateOptionalString,
  parsePagination
} = require("../utils/validators");
const { sanitizeUser } = require("../utils/sanitize");

exports.getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { role, status, search } = req.query;

  const filter = {};

  if (role) {
    validateRole(role);
    filter.role = role;
  }

  if (status) {
    validateStatus(status);
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { email: { $regex: search.trim(), $options: "i" } }
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter)
  ]);

  res.json({
    data: users.map(sanitizeUser),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  res.json({ user: sanitizeUser(user) });
});

exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = "viewer", status = "active" } = req.body;

  validateOptionalString(name, "name", { required: true, minLength: 2 });
  validateEmail(email);
  validatePassword(password);
  validateRole(role);
  validateStatus(status);

  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    throw new AppError("Email is already in use.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
    status
  });

  res.status(201).json({
    message: "User created successfully.",
    user: sanitizeUser(user)
  });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { name, role, status, password } = req.body;
  const user = await User.findById(req.params.id).select("+password");

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (name !== undefined) {
    validateOptionalString(name, "name", { required: true, minLength: 2 });
    user.name = name.trim();
  }

  if (role !== undefined) {
    validateRole(role);
    user.role = role;
  }

  if (status !== undefined) {
    validateStatus(status);
    user.status = status;
  }

  if (password !== undefined) {
    validatePassword(password);
    user.password = await bcrypt.hash(password, 10);
  }

  if (
    req.user._id.toString() === user._id.toString() &&
    user.status === "inactive"
  ) {
    throw new AppError("Admins cannot deactivate themselves.", 400);
  }

  if (
    req.user._id.toString() === user._id.toString() &&
    user.role !== "admin"
  ) {
    throw new AppError("Admins cannot change their own role.", 400);
  }

  await user.save();

  res.json({
    message: "User updated successfully.",
    user: sanitizeUser(user)
  });
});
