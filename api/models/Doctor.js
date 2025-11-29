import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true },
    phone: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", DoctorSchema);
