const FinancialRecord = require("../models/FinancialRecord");
const { asyncHandler, AppError } = require("../utils/error");
const {
  validateAmount,
  validateRecordType,
  validateOptionalString,
  validateDate,
  parsePagination
} = require("../utils/validators");

const buildRecordFilter = (query) => {
  const filter = { isDeleted: false };

  if (query.type) {
    validateRecordType(query.type);
    filter.type = query.type;
  }

  if (query.category) {
    filter.category = query.category.trim();
  }

  if (query.startDate || query.endDate) {
    filter.date = {};

    if (query.startDate) {
      filter.date.$gte = validateDate(query.startDate, "startDate");
    }

    if (query.endDate) {
      filter.date.$lte = validateDate(query.endDate, "endDate");
    }
  }

  if (query.search) {
    filter.$or = [
      { category: { $regex: query.search.trim(), $options: "i" } },
      { notes: { $regex: query.search.trim(), $options: "i" } }
    ];
  }

  return filter;
};

exports.listRecords = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const sortBy = ["date", "amount", "category", "createdAt"].includes(req.query.sortBy)
    ? req.query.sortBy
    : "date";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
  const filter = buildRecordFilter(req.query);

  const [records, total] = await Promise.all([
    FinancialRecord.find(filter)
      .populate("createdBy", "name email role")
      .sort({ [sortBy]: sortOrder, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    FinancialRecord.countDocuments(filter)
  ]);

  res.json({
    data: records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  });
});

exports.getRecordById = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findOne({
    _id: req.params.id,
    isDeleted: false
  }).populate("createdBy", "name email role");

  if (!record) {
    throw new AppError("Financial record not found.", 404);
  }

  res.json({ record });
});

exports.createRecord = asyncHandler(async (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  validateAmount(amount);
  validateRecordType(type);
  validateOptionalString(category, "category", { required: true, minLength: 2 });
  const parsedDate = validateDate(date, "date");

  if (notes !== undefined) {
    validateOptionalString(notes, "notes", { maxLength: 300 });
  }

  const record = await FinancialRecord.create({
    amount: Number(amount),
    type,
    category: category.trim(),
    date: parsedDate,
    notes: notes ? notes.trim() : "",
    createdBy: req.user._id
  });

  res.status(201).json({
    message: "Financial record created successfully.",
    record
  });
});

exports.updateRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findOne({
    _id: req.params.id,
    isDeleted: false
  });

  if (!record) {
    throw new AppError("Financial record not found.", 404);
  }

  const { amount, type, category, date, notes } = req.body;

  if (amount !== undefined) {
    validateAmount(amount);
    record.amount = Number(amount);
  }

  if (type !== undefined) {
    validateRecordType(type);
    record.type = type;
  }

  if (category !== undefined) {
    validateOptionalString(category, "category", { required: true, minLength: 2 });
    record.category = category.trim();
  }

  if (date !== undefined) {
    record.date = validateDate(date, "date");
  }

  if (notes !== undefined) {
    validateOptionalString(notes, "notes", { maxLength: 300 });
    record.notes = typeof notes === "string" ? notes.trim() : "";
  }

  await record.save();

  res.json({
    message: "Financial record updated successfully.",
    record
  });
});

exports.deleteRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findOne({
    _id: req.params.id,
    isDeleted: false
  });

  if (!record) {
    throw new AppError("Financial record not found.", 404);
  }

  record.isDeleted = true;
  record.deletedAt = new Date();
  await record.save();

  res.json({ message: "Financial record deleted successfully." });
});
