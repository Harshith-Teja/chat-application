import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";

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

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).send("FirstName, LastName and color are required");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      color: userData.color,
    });
  } catch (err) {
    console.log(err.message);
  }
};

export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
    }

    const date = Date.now();
    let filePath = "./uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, filePath);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: filePath },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ image: updatedUser.image });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server Error");
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).send("User not found");
    }

    if (user.image) {
      unlinkSync(user.image); //deletes the image from the directory
    }

    user.image = null;
    await user.save();

    return res.status(200).send("Profile image removed successfully");
  } catch (err) {
    console.log(err.message);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).send("Logout successfull");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};
