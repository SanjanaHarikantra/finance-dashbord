const { AppError } = require("./error");

const ROLES = ["viewer", "analyst", "admin"];
const STATUSES = ["active", "inactive"];
const RECORD_TYPES = ["income", "expense"];

const isBlank = (value) =>
  value === undefined || value === null || String(value).trim() === "";

exports.validateRequiredFields = (fields) => {
  const missingFields = Object.entries(fields)
    .filter(([, value]) => isBlank(value))
    .map(([key]) => key);

  if (missingFields.length > 0) {
    throw new AppError(
      `Missing required field(s): ${missingFields.join(", ")}.`,
      400
    );
  }
};

exports.validateEmail = (email) => {
  if (isBlank(email)) {
    throw new AppError("Email is required.", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    throw new AppError("Please provide a valid email address.", 400);
  }
};

exports.validatePassword = (password) => {
  if (isBlank(password) || String(password).length < 6) {
    throw new AppError("Password must be at least 6 characters long.", 400);
  }
};

exports.validateRole = (role) => {
  if (!ROLES.includes(role)) {
    throw new AppError(`Role must be one of: ${ROLES.join(", ")}.`, 400);
  }
};

exports.validateStatus = (status) => {
  if (!STATUSES.includes(status)) {
    throw new AppError(
      `Status must be one of: ${STATUSES.join(", ")}.`,
      400
    );
  }
};

exports.validateRecordType = (type) => {
  if (!RECORD_TYPES.includes(type)) {
    throw new AppError(
      `Type must be one of: ${RECORD_TYPES.join(", ")}.`,
      400
    );
  }
};

exports.validateOptionalString = (value, fieldName, options = {}) => {
  const { required = false, minLength = 0, maxLength = Infinity } = options;

  if (value === undefined || value === null) {
    if (required) {
      throw new AppError(`${fieldName} is required.`, 400);
    }
    return;
  }

  if (typeof value !== "string") {
    throw new AppError(`${fieldName} must be a string.`, 400);
  }

  const trimmedValue = value.trim();

  if (required && trimmedValue.length === 0) {
    throw new AppError(`${fieldName} is required.`, 400);
  }

  if (trimmedValue.length < minLength) {
    throw new AppError(
      `${fieldName} must be at least ${minLength} characters long.`,
      400
    );
  }

  if (trimmedValue.length > maxLength) {
    throw new AppError(
      `${fieldName} must be at most ${maxLength} characters long.`,
      400
    );
  }
};

exports.validateAmount = (amount) => {
  const parsed = Number(amount);

  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new AppError("Amount must be a number greater than zero.", 400);
  }
};

exports.validateDate = (value, fieldName) => {
  if (isBlank(value)) {
    throw new AppError(`${fieldName} is required.`, 400);
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError(`${fieldName} must be a valid date.`, 400);
  }

  return parsedDate;
};

exports.parsePagination = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
