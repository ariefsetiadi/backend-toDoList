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
      return res.status(400).json({ msg: "Email is wrong" });
    }

    const pass = await bcrypt.compare(req.body.password, user.password);
    if (!pass) {
      return res.status(400).json({ msg: "Password is wrong" });
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
      { refresh_token: refreshToken },
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

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.sendStatus(401);

    const user = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user.refresh_token) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const userId = user.id;
      const fullname = user.fullname;
      const email = user.email;

      const accessToken = jwt.sign(
        { userId, fullname, email },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "1h",
        }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    res.json({ msg: "Something wrong" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(204);

  const user = await User.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user.refresh_token) return res.sendStatus(204);

  const userId = user.id;

  await User.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );

  res.clearCookie("refreshToken");
  res.json({ msg: "Logout is success" });
};

export const register = async (req, res) => {
  const users = await User.findAll({
    attributes: ["id"],
  });

  if (users)
    return res
      .status(409)
      .json({
        msg: "There is already user in database, please adding user via Create User",
      });

  const { fullname, email } = req.body;

  if (!fullname) return res.status(402).json({ msg: "Fullname is required" });

  if (!email) return res.status(402).json({ msg: "Email is required" });

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

    res.json({ msg: "Register is success, default Password: Pass12345" });
  } catch (error) {
    res.json({ msg: "Register is failed" });
  }
};
