import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

dotenv.config();

/* -------------------------------
   ✅ Hard-coded Admin List
   (Replace with your actual emails)
-------------------------------- */
const ADMIN_EMAILS = ["kevalsinh_m250833cs@nitc.ac.in", "sanket@nitc.ac.in"];

/* -------------------------------
   ✅ Google OAuth Configuration
-------------------------------- */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // ✅ Use absolute callback to avoid OAuth redirect mismatch
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || "";
        const name = profile.displayName || "User";

        // ✅ Restrict only NITC domain (optional)
        if (!email.endsWith("@nitc.ac.in")) {
          console.log(`❌ Blocked non-NITC user: ${email}`);
          return done(null, false, { message: "Only NITC accounts allowed" });
        }

        // ✅ Check existing user
        let user = await User.findOne({ email });

        // ✅ Create new user if not found
        if (!user) {
          user = await User.create({
            name,
            email,
            authProvider: "google",
            googleId: profile.id,
            role: ADMIN_EMAILS.includes(email.toLowerCase()) ? "ADMIN" : "USER",
          });
          console.log(`🆕 Created new user: ${email} (${user.role})`);
        }

        // ✅ Sync admin role dynamically
        if (ADMIN_EMAILS.includes(email.toLowerCase()) && user.role !== "ADMIN") {
          user.role = "ADMIN";
          await user.save();
          console.log(`🔄 Updated ${email} to ADMIN role`);
        }

        // ✅ Generate token for frontend
        const token = generateToken(user._id, user.role);

        console.log(`✅ ${email} logged in successfully as ${user.role}`);

        // ✅ Attach token + user to session
        return done(null, { user, token });
      } catch (err) {
        console.error("OAuth Error:", err.message);
        done(err, null);
      }
    }
  )
);

/* -------------------------------
   ✅ Passport Session Handlers
-------------------------------- */
passport.serializeUser((obj, done) => done(null, obj));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;
