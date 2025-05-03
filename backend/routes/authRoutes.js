import { Router } from "express";
import { login, signup } from "../controller/authControllers.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);

export default authRoutes;
