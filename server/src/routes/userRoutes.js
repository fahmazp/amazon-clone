import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import passport from "passport";
import { generateToken } from "../utils/generateToken.js";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/login`,
    session: true,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${CLIENT_URL}/`);
  }
);

router.get("/me", authUser, (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role || "user",
      phone: req.user.phone || "",
      isActive: req.user.isActive,
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.clearCookie("connect.sid", { path: "/" });
  if (req.logout) {
    req.logout((err) => {
      // ignore logout errors
    });
  }
  res.json({ message: "Logged out successfully" });
});

// Also support GET /logout for convenience
router.get("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.clearCookie("connect.sid", { path: "/" });
  if (req.logout) {
    req.logout((err) => {});
  }
  res.json({ message: "Logged out successfully" });
});

export { router as userRouter };
