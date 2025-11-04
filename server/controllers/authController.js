import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

/* -------------------------------
   ✅ Hardcoded Admin Emails
   (For production: move to .env)
-------------------------------- */
const ADMIN_EMAILS = [
  "kevalsinh_m250833cs@nitc.ac.in",
  "pratik_m250461cs@nitc.ac.in"
];

/* -------------------------------
   REGISTER (Local)
-------------------------------- */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Automatically assign admin if email matches
    const assignedRole = ADMIN_EMAILS.includes(email.toLowerCase())
      ? "ADMIN"
      : role || "USER";

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

/* -------------------------------
   LOGIN (Local)
-------------------------------- */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Role auto-sync (if admin email added later)
    if (ADMIN_EMAILS.includes(email.toLowerCase()) && user.role !== "ADMIN") {
      user.role = "ADMIN";
      await user.save();
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

/* -------------------------------
   GOOGLE LOGIN / CALLBACK
-------------------------------- */
export const googleAuthCallback = async (req, res) => {
  try {
    const googleUser = req.user?.user;
    const tokenFromPassport = req.user?.token;

    if (!googleUser || !googleUser.email) {
      console.error("⚠️ Missing Google profile data:", req.user);
      return res.redirect(process.env.CLIENT_URL + "/login?error=missing_data"); //dynamic URL - Pratik
    }

    const { name, email, googleId } = googleUser;
    let user = await User.findOne({ email });

    // ✅ Create new if not exists
    if (!user) {
      const assignedRole = ADMIN_EMAILS.includes(email.toLowerCase())
        ? "ADMIN"
        : "USER";

      user = await User.create({
        name,
        email,
        googleId,
        authProvider: "google",
        role: assignedRole,
      });
    }

    // ✅ Keep admin roles synced
    if (ADMIN_EMAILS.includes(email.toLowerCase()) && user.role !== "ADMIN") {
      user.role = "ADMIN";
      await user.save();
    }

    // ✅ Token (from passport or new)
    const token = tokenFromPassport || generateToken(user._id, user.role);

    // ✅ Redirect to frontend (token + role)
    const redirectUrl = process.env.CLIENT_URL + `/?token=${token}&role=${user.role}`; //pratik dynamic CLIENT_URL
    console.log(`🔐 Google Login Success: ${email} (${user.role})`);
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google login error:", error);
    return res.redirect(process.env.CLIENT_URL +"/login?error=google_auth_failed"); //pratik dynamic CLIENT_URL
  }
};

/* -------------------------------
   GET CURRENT USER
-------------------------------- */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching user information" });
  }
};
