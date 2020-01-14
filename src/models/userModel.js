import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "student",
    enum: ["student", "supervisor", "coordinator"]
  },
  accessToken: {
    type: String
  }
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
