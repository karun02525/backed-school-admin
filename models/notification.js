import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    classes: { type: mongoose.Schema.Types.ObjectId, ref: 'Classes'},
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    type: { type: String, required: true },
    title: { type: String,default:"" },
    message: { type: String,default:"" },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
