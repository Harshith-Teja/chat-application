import { Router } from "express";
import {
  createChannel,
  getUserChannels,
} from "../controller/channelController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels);

export default channelRoutes;
