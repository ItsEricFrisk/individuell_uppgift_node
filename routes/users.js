import { Router } from "express";
import {
  createUser,
  login,
  logout,
  createAdmin,
  loginAdmin,
} from "../controllers/usersController.js";

const router = Router();

// Log in user
router.post("/login", login);

// Create user
router.post("/signup", createUser);

// Log out user
router.post("/logout", logout);

// Create admin
router.post("/signup/admin", createAdmin);

// Log in admin
router.post("/login/admin", loginAdmin);

export default router;
