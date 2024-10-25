import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "Hello, I'm a new user. 👋",
    maxLength: 230,
  },
  lastActive: {
    type: Date,
    default: Date.now(),
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
