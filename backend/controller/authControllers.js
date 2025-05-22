import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000;

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("Email and password are required");

    const user = await User.create({ email, password });

    const accessToken = jwt.sign(
      { email, userId: user.id },
      process.env.JWT_KEY,
      {
        expiresIn: maxAge,
      }
    );

    res.cookie("jwt", accessToken, { maxAge, secure: true, sameSite: "None" });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send("Email and password are required");

  const user = await User.findOne({ email });

  if (!user) return res.status(404).send("Email not found");

  const pwdMatch = await bcrypt.compare(password, user.password);

  if (!pwdMatch) return res.status(400).send("Password is incorrect");

  const accessToken = jwt.sign(
    { email, userId: user.id },
    process.env.JWT_KEY,
    { expiresIn: maxAge }
  );

  res.cookie("jwt", accessToken, { maxAge, secure: true, sameSite: "None" });

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      color: user.color,
    },
  });
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);

    if (!userData) return res.status(404).send("User id not found");

    return res.status(200).json({
      user: {
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        color: userData.color,
      },
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};
