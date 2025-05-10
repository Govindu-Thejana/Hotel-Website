// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  salt: String,
  isAdmin: { type: Boolean, default: false } // NEW
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
