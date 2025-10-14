const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceSchema = new mongoose.Schema(
    {
        serviceName: {
            type: String,
            required: true,
            unique: true,
        },
        subServices: {
            type: [String],
            default: [],
        },
        icon: {
            data: Buffer,
            contentType: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Services", ServiceSchema);