// middleware/roleMiddleware.js

// This middleware checks if the logged-in user has one of the allowed roles
export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    // Make sure req.user exists (set by your authMiddleware after login)
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Check if the user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }

    next(); // user has permission, continue to route
  };
};
