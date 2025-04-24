import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    status:{
        type: String, enum: ['pending', 'resolved', 'rejected'], default: 'pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model("complain", complaintSchema);
