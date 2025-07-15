import { Router } from "express";
import { getMessages, uploadFile } from "../controller/messagesController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";

const messageRoutes = Router();
const upload = multer({ dest: "/uploads/files" });

messageRoutes.post("/get-messages", verifyToken, getMessages);
messageRoutes.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFile
);

export default messageRoutes;
