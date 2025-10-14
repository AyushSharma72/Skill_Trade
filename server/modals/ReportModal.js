const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ReportSchema = mongoose.Schema(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "Requests",
      required: true,
    },
    Report: [
      {
        worker: {
          type: Schema.Types.ObjectId,
          ref: "Workers",
          required: true,
        },
        IssueType: {
          type: String,
        },
      },
    ],
    ReviewRequested: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reports", ReportSchema);
