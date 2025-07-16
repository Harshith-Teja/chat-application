import { Router } from "express";
import { createChannel } from "../controller/channelController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);

export default channelRoutes;
