import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import setupSocket from "./socket.js";
import messageRoutes from "./routes/messagesRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongodbURL = process.env.MONGODB_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(port, () => {
  console.log("connected to the server at port:", port);
});

setupSocket(server);

mongoose
  .connect(mongodbURL)
  .then(() => console.log("Connected to mongodb successfully"))
  .catch((err) => console.log(err.message));
