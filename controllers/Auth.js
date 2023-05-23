import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
  try {
    // If email is empty
    if (!req.body.email) {
      return res.status(422).json({ msg: "Email is required" });
    }

    // If password is empty
    if (!req.body.password) {
      return res.status(422).json({ msg: "Password is required" });
    }

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(400).json({ msg: "Email or Password is wrong" });
    }

    const pass = await bcrypt.compare(req.body.password, user.password);
    if (!pass) {
      return res.status(400).json({ msg: "Email or Password is wrong" });
    }

    const userId = user.id;
    const fullname = user.fullname;
    const email = user.email;

    // Access Token
    const accessToken = jwt.sign(
      { userId, fullname, email },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "1h",
      }
    );

    // Refresh Token
    const refreshToken = jwt.sign(
      { userId, fullname, email },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    // Update User for insert refresh token
    await User.update(
      { refres_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // for Production
      // secure: true
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(400).json({ msg: "Something wrong" });
  }
};
