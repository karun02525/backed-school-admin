import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    classes: { type: mongoose.Schema.Types.ObjectId, ref: 'Classes'},
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    type: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", AttendanceSchema);
