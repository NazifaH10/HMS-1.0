import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appt_time: { type: String, required: true }, // ISO datetime string
    reason: { type: String },
    status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", AppointmentSchema);
