const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
    {
        clientId: {
            type: String,
            unique: true,
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        address: {
            type: String,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        idType: {
            type: String,
            enum: ["Aadhaar", "PAN", "Voter ID", "Driving License", "Other"],
            default: "Other"
        },
        idNumber: {
            type: String,
            trim: true
        },
        notes: {
            type: String,
            trim: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Client", clientSchema);