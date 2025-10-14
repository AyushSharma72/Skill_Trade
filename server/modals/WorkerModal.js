const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkerSchema = mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    MobileNo: {
      type: Number,
      required: true,
      unique: true,
    },
    ServiceType: {
      type: String,
      required: true,
    },
    ServiceId: {
      type: Schema.Types.ObjectId,
      ref: "Services",
      required: false,
    },
    SubServices: {
      type: [String],
      default: [],
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Address: {
      type: String,
      // required: true,
    },
    coordinates: {
      type: { type: String, enum: ["Point"] },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    pincode: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
    },
    role: {
      type: Number,
      default: 1,
    },
    gender: {
      type: String,
    },
    UnAssignedRequest: [
      {
        request: {
          type: Schema.Types.ObjectId,
          ref: "Requests",
        },
        unassignReason: {
          type: String,
          default: null,
        },
        unassignesAt: {
          type: Date,
          default: null,
        },
        unAssignedBy: {
          type: Number, // user, worker
        },
        markAsValid: {
          type: Boolean,
          default: false,
        },
      },
    ],
    CompletedRequest: {
      type: Number,
      default: 0,
    },
    OverallRaitngs: {
      type: Number,
      default: 0,
    },
    Reviews: [
      {
        stars: {
          type: Number,
        },
        comment: {
          type: String,
        },
        sentimentScore: {
          type: Number,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "Users",
        },
        date: {
          type: Date,
        },
      },
    ],
    overAllSentimentScore: {
      type: Number,
    },
    TotalStars: {
      type: Number,
    },
    Verified: {
      verified: {
        type: String,
        default: "Unverified",
      },
      rejectedReason: {
        type: String,
      },
      rejectionDate: {
        type: Date,
      },
    },
    VerifyId: {
      data: Buffer,
      contentType: String,
    },
    Banned: {
      ban: {
        type: Boolean,
        default: false,
      },
      tillDate: {
        type: Date,
      },
    },
    HireRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "Requests",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create a geospatial index on coordinates for efficient location-based queries
WorkerSchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Workers", WorkerSchema);
