import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import passport from "passport";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post("/google", googleSignIn);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: true,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`http://localhost:5173/?token=${token}`);
    //res.redirect("http://localhost:5173/");
  }
);

router.get("/me", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid", { path: "/" });
    res.json({ message: "Logged out successfully" });
  });
});


export { router as userRouter };
