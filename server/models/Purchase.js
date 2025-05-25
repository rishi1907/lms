import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: String, // Clerk user ID
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

export const Purchase = mongoose.model("Purchase", purchaseSchema);
