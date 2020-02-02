import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AssignedSchema = new Schema(
  {
    student: {
      type: String,
      required: true
    },
    supervisorId: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

const Assigned = mongoose.model("asigned", AssignedSchema);

module.exports = Assigned;
