import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
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
    phone: {
      type: String,
      required: true,
      trim: true
    },
    regNo: {
      type: String,
      trim: true
    },
    avatar: {
      type: String
    },
    accessToken: {
      type: String
    }
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
