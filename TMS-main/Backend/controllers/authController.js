import { User } from "../models/userModel.js";

async function register(req, res) {
  const { firstName, lastName, email, password, roleId } = req.body;
  try {
    const user = new User({ firstName, lastName, email, password, roleId });
    await user.save();
    return res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    console.error("Error creating user", error);
    return res.status(400).json({ msg: "Error creating user" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error();

    const isMatch = await user.comparePassword(password);

    if (!isMatch) throw new Error();
    const token = await user.generateToken();
    return res.status(200).json({ msg: "logged", token });
  } catch (error) {
    console.log("Error while logging in", error);
    return res.status(401).json({ msg: "incorrect password or email" });
  }
}

export { register, login };
