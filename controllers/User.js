import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "fullname",
        "email",
        "status",
        "change_password",
        "createdAt",
        "updatedAt",
      ],
    });
    res.json(users);
  } catch (error) {
    res.status(400).json({ msg: "Something wrong" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: [
        "id",
        "fullname",
        "email",
        "status",
        "change_password",
        "createdAt",
        "updatedAt",
      ],
      where: {
        id: req.params.id,
      },
    });

    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ msg: "Something wrong" });
  }
};

export const saveUser = async (req, res) => {
  const { fullname, email } = req.body;

  // Check duplicate email
  const checkEmail = await User.findOne({
    where: {
      email: email,
    },
  });

  if (checkEmail) {
    return res.status(409).json({ msg: "Email already used" });
  }

  // Password default
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

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  // Check duplicate email
  const checkEmail = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (checkEmail && checkEmail.id != req.params.id) {
    return res.status(409).json({ msg: "Email already used" });
  }

  try {
    await User.update(
      {
        fullname: req.body.fullname,
        email: req.body.email,
        status: req.body.status,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.json({ msg: "Update user is success" });
  } catch (error) {
    res.json({ msg: "Update user is failed" });
  }
};

export const resetPassword = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  // Password default
  const defPassword = "Pass12345";

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(defPassword, salt);

  try {
    await User.update(
      {
        password: hashPassword,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.json({ msg: "Reset password user is success" });
  } catch (error) {
    res.json({ msg: "Reset password user is failed" });
  }
};
