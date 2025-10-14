const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Services",
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // Array of numbers for [longitude, latitude]
      },
    },
    pincode: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Assigned", "Completed", "Deleted"],
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    acceptedBy: [
      {
        worker: {
          type: Schema.Types.ObjectId,
          ref: "Workers",
        },
        estimatedPrice: {
          type: Number,
        },
        priceJustification: {
          type: String,
        },
        acceptedAt: {
          type: Date,
        },
      },
    ],
    confirmedAt: {
      type: Date,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Workers",
    },
    actualPrice: {
      type: Number,
    },
    completedAt: {
      type: Date,
    },
    ReportedInfo: {
      Info: {
        type: String,
      },
      Deleted: {
        type: Boolean,
      },
      Review: {
        type: Boolean,
        default: false,
      },
    },
    personalRequestTo: {
      type: Schema.Types.ObjectId,
      ref: "Workers",
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
RequestSchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Requests", RequestSchema);