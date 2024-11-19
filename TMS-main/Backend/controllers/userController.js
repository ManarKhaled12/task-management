import { User } from "../models/userModel.js";

async function getUsers(req, res) {
  try {
    const users = await User.find({ roleId: 1 });
    return res.status(200).json(
      users.map((user) => ({
        id: user._id,
        name: user.firstName + " " + user.lastName,
      }))
    );
  } catch (error) {
    console.log("Error happened while getting users");
    return res.status(500).json({ msg: "Error while getting users" });
  }
}

export { getUsers };
