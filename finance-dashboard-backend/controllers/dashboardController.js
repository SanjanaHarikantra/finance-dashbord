const FinancialRecord = require("../models/FinancialRecord");
const { asyncHandler } = require("../utils/error");
const { validateDate } = require("../utils/validators");

const buildDateMatch = (query) => {
  const match = { isDeleted: false };

  if (query.startDate || query.endDate) {
    match.date = {};

    if (query.startDate) {
      match.date.$gte = validateDate(query.startDate, "startDate");
    }

    if (query.endDate) {
      match.date.$lte = validateDate(query.endDate, "endDate");
    }
  }

  return match;
};

exports.getDashboardSummary = asyncHandler(async (req, res) => {
  const match = buildDateMatch(req.query);

  const [totals, categoryTotals, monthlyTrend, recentActivity, recordCount] = await Promise.all([
    FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]),
    FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]),
    FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]),
    FinancialRecord.find(match)
      .populate("createdBy", "name email role")
      .sort({ date: -1, createdAt: -1 })
      .limit(5),
    FinancialRecord.countDocuments(match)
  ]);

  const income = totals.find((item) => item._id === "income")?.total || 0;
  const expenses = totals.find((item) => item._id === "expense")?.total || 0;

  res.json({
    totalIncome: income,
    totalExpenses: expenses,
    netIncome: income - expenses,
    recordCount: recordCount,
    recentRecords: recentActivity,
    categoryTotals: categoryTotals.map((item) => ({
      category: item._id.category,
      type: item._id.type,
      total: item.total
    })),
    monthlyTrend: monthlyTrend.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      type: item._id.type,
      total: item.total
    }))
  });
});
