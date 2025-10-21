import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

dotenv.config();

// ✅ Only allow NITC accounts
const ALLOWED_DOMAIN = "nitc.ac.in";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || "";
        const name = profile.displayName || "User";

        // 1️⃣ Block non-NITC users
        if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
          console.log(`❌ Blocked login attempt: ${email}`);
          return done(null, false, { message: "Only NITC accounts allowed" });
        }

        // 2️⃣ Check if user already exists
        let user = await User.findOne({ email });

        // 3️⃣ If not, create new Google user
        if (!user) {
          user = await User.create({
            name,
            email,
            authProvider: "google",
            googleId: profile.id,
            role: "ASKER", // default role
          });
        }

        // 4️⃣ Create JWT for your API
        const token = generateToken(user._id, user.role);

        // 5️⃣ Attach both to req.user for callback route
        return done(null, { user, token });
      } catch (err) {
        console.error("OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

// ✅ Required for passport sessions (temporary handshake)
passport.serializeUser((obj, done) => done(null, obj));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;
