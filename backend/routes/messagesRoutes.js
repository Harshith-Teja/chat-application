import { Router } from "express";
import {
  getMessages,
  summarizeMissedMessages,
  uploadFile,
} from "../controller/messagesController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";

const messageRoutes = Router();
const upload = multer({ dest: "uploads/files" });

messageRoutes.post("/get-messages", verifyToken, getMessages);
messageRoutes.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFile
);
messageRoutes.post(
  "/summarize/:channelId",
  verifyToken,
  summarizeMissedMessages
);

export default messageRoutes;
