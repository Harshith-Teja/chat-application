import User from "../model/userModel.js";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000;

export const signup = async (req, res, next) => {
  try {
    const { email, pwd } = req.body;

    if (!email || !pwd)
      return res.status(400).send("Email and password are required");

    const user = await User.create({ email, pwd });

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
