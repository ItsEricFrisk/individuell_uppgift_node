import { Router } from "express";
import {
  addItemMenu,
  modifyItem,
  removeProduct,
  createOffers,
} from "../controllers/menuController.js";
import isAdminLoggedIn from "../middleware/isAdminLoggedIn.js";

const router = Router();

// You need to be logged in as admin to use these routes.

// Add item to menu
router.put("/addItem", isAdminLoggedIn, addItemMenu);

// Modify item in menu
router.put("/modifyItem/:productId", isAdminLoggedIn, modifyItem);

// Remove item from menu
router.delete("/deleteProduct/:productId", isAdminLoggedIn, removeProduct);

// Create offers
router.put("/offers", isAdminLoggedIn, createOffers);

export default router;
