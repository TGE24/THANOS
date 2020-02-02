import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SupervisorSchema = new Schema({
  supervisor: { type: Schema.Types.ObjectId, ref: "supervisor" },
  adminApproved: { type: Boolean }
});

const Supervisor = mongoose.model("supervisor", SupervisorSchema);

module.exports = Supervisor;
