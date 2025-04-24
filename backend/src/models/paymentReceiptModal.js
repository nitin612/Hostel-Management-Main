import mongoose from "mongoose";

const paymentReceiptSchema = new mongoose.Schema(
  {
    userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
    title: { type: String, required: true },
    description: { type: String, required: true },

    image: { type: String },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },
  },
  
  { timestamps: true }
);

export default mongoose.model("receipt", paymentReceiptSchema);
