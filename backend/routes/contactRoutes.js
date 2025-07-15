import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getContactsForDmList,
  searchContacts,
} from "../controller/ContactsController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDmList);

export default contactsRoutes;
