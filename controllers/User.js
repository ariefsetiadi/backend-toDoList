import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const saveUser = async (req, res) => {
  const { fullname, email } = req.body;

  //   Password default
  const defPassword = "Pass12345";

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(defPassword, salt);

  try {
    await User.create({
      fullname: fullname,
      email: email,
      password: hashPassword,
    });

    res.json({ msg: "Save user is success" });
  } catch (error) {
    res.json({ msg: "Save user is failed" });
  }
};
