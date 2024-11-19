import { mongoose } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const roleSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Role = mongoose.model("Role", roleSchema);

export const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordSalt: {
    type: String,
  },
  roleId: {
    type: mongoose.Schema.Types.Number,
    ref: "Role",
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    user.passwordSalt = salt;

    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.generateToken = async function () {
  const data = {
    nameid: this._id,
    email: this.email,
    role: this.roleId,
    unique_name: `${this.firstName} ${this.lastName}`,
    // exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };
  const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: "30m" });
  return token;
};

export const User = mongoose.model("User", userSchema);
