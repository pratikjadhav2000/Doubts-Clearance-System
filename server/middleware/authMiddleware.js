import jwt from "jsonwebtoken";
import User from "../models/user.js";

/**
 * 🔐 Protect Middleware
 * Validates JWT and attaches user object to req.user
 */
export const protect = async (req, res, next) => {
  try {
    // 1️⃣ Extract token from header or cookie
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.jwt_token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // 2️⃣ Verify token (no fallback secret — must exist)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // 3️⃣ Fetch user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4️⃣ Check account status
    if (user.status === "SUSPENDED") {
      return res.status(403).json({ message: "Account suspended by admin" });
    }

    // 5️⃣ Attach user and proceed
    req.user = user;
    return next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please log in again" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(500).json({ message: "Internal authentication error" });
  }
};

/**
 * 🛡️ Role-Based Access Control
 * Example: router.get("/admin", protect, authorizeRoles("ADMIN"), ...)
 */
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Access denied: insufficient permissions" });
  }
  next();
};
