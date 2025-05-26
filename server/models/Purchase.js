import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "User",
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
}, {
    timestamps: true
});

export const Purchase = mongoose.model("Purchase", PurchaseSchema);
