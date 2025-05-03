import { Router } from "express";
import { signup } from "../controller/authControllers.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);

export default authRoutes;
