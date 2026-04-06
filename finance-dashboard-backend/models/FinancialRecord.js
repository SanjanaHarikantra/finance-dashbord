const mongoose = require("mongoose");

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required."],
      min: [0.01, "Amount must be greater than zero."]
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Type is required."]
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      trim: true
    },
    date: {
      type: Date,
      required: [true, "Date is required."]
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

financialRecordSchema.index({ type: 1, category: 1, date: -1 });
financialRecordSchema.index({ isDeleted: 1, date: -1 });

module.exports = mongoose.model("FinancialRecord", financialRecordSchema);
