import mongoose from "mongoose";
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    project: { type: String }
  },
  { timestamps: true }
);

const Student = mongoose.model("student", StudentSchema);

module.exports = Student;
