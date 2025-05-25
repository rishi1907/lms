import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: String, // fixed from ObjectId to String
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
}, {
  timestamps: true
});

export const Purchase = mongoose.model("Purchase", purchaseSchema);
