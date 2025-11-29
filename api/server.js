import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ✅ these paths MUST match your real filenames exactly (with .js)
import Patient from "./models/Patient.js";
import Doctor from "./models/Doctor.js";
import Appointment from "./models/Appointment.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- MongoDB connection ---------- */
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI is missing in .env (apps/api/.env).");
  process.exit(1);
}

mongoose.set("strictQuery", true);
mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => {
    console.error("❌ MongoDB connection error:", e.message);
    process.exit(1);
  });

/* ---------- Patients ---------- */
app.get("/api/patients", async (_req, res) => {
  const rows = await Patient.find().sort({ _id: -1 });
  res.json(rows);
});

app.get("/api/patients/:id", async (req, res) => {
  const row = await Patient.findById(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

app.post("/api/patients", async (req, res) => {
  const { name, dob, gender, phone } = req.body;
  if (!name || !dob || !gender)
    return res.status(400).json({ error: "name, dob, gender required" });
  const p = await Patient.create({ name, dob, gender, phone });
  res.status(201).json({ id: p._id });
});

app.put("/api/patients/:id", async (req, res) => {
  const { name, dob, gender, phone } = req.body;
  const updated = await Patient.findByIdAndUpdate(
    req.params.id,
    { name, dob, gender, phone },
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

app.delete("/api/patients/:id", async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* ---------- Doctors ---------- */
app.get("/api/doctors", async (_req, res) => {
  const docs = await Doctor.find().sort({ _id: -1 });
  res.json(docs);
});

app.post("/api/doctors", async (req, res) => {
  const { name, specialty, phone } = req.body;
  if (!name || !specialty)
    return res.status(400).json({ error: "name, specialty required" });
  const d = await Doctor.create({ name, specialty, phone });
  res.status(201).json({ id: d._id });
});

/* ---------- Appointments ---------- */
app.get("/api/appointments", async (_req, res) => {
  const rows = await Appointment.find()
    .populate("patient_id", "name")
    .populate("doctor_id", "name")
    .sort({ appt_time: -1 });

  const out = rows.map((a) => ({
    id: a._id,
    appt_time: a.appt_time,
    patient_id: a.patient_id?._id,
    doctor_id: a.doctor_id?._id,
    patient_name: a.patient_id?.name,
    doctor_name: a.doctor_id?.name,
    status: a.status,
    reason: a.reason,
  }));
  res.json(out);
});

app.post("/api/appointments", async (req, res) => {
  const { patient_id, doctor_id, appt_time, reason } = req.body;
  if (!patient_id || !doctor_id || !appt_time)
    return res
      .status(400)
      .json({ error: "patient_id, doctor_id, appt_time required" });

  const a = await Appointment.create({ patient_id, doctor_id, appt_time, reason });
  res.status(201).json({ id: a._id });
});

app.put("/api/appointments/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!["Scheduled", "Completed", "Cancelled"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  const upd = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!upd) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

app.delete("/api/appointments/:id", async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* ---------- Start server ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 HMS API running at http://localhost:${PORT}`)
);

/* ---------- Status Check ---------- */
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "HMS API", environment: process.env.NODE_ENV || "development" });
});