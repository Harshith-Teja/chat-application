import { Router } from "express";
import { getMessages } from "../controller/messagesController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const messageRoutes = Router();

messageRoutes.post("/get-messages", verifyToken, getMessages);

export default messageRoutes;
