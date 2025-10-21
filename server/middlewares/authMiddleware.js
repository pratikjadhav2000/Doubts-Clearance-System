import jwt from "jsonwebtoken";
import User from "../models/user.js";

// ✅ verify JWT for all protected routes
export const protect = async (req, res, next) => {
  try {
    // 1️⃣ read token from Authorization header
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    // 2️⃣ verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ fetch user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    // 4️⃣ block suspended users
    if (user.status === "SUSPENDED") {
      return res.status(403).json({ message: "Account suspended" });
    }

    // 5️⃣ attach user object to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ restrict access based on roles (optional)
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied: insufficient permissions" });
  }
  next();
};
