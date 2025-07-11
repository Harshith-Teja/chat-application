import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { searchContacts } from "../controller/ContactsController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);

export default contactsRoutes;
