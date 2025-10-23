import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from "express-session";
import connectDB from "./src/config/db.js";
import passport from "./src/config/passport.js";
import { userRouter } from "./src/routes/userRoutes.js";
import { productRouter } from "./src/routes/productRoutes.js";
import { cartRouter } from "./src/routes/cartRoutes.js";
import { orderRouter } from "./src/routes/orderRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
  origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Session middleware for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// export default app;
