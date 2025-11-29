import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dob: { type: String, required: true }, // store ISO "YYYY-MM-DD" for simplicity
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Patient", PatientSchema);
