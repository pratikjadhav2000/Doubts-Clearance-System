// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // ✅ Ensure uploads folder exists
// const uploadDir = path.join(process.cwd(), "server", "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log("📁 Created uploads directory:", uploadDir);
// }

// // ✅ Configure Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
//     cb(null, uniqueSuffix);
//   },
// });

// // ✅ File filter (optional)
// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Only image files are allowed"), false);
// };

// // ✅ Export upload middleware
// export const upload = multer({ storage, fileFilter });

// server/middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Detect environment
const isVercel = !!process.env.VERCEL;

// ✅ Use writable temp dir on Vercel; use /server/uploads locally
const uploadDir = isVercel
  ? path.join(os.tmpdir(), "uploads")
  : path.join(process.cwd(), "server", "uploads");

// ✅ Create folder only if environment allows
if (!isVercel) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📁 Created uploads directory:", uploadDir);
  }
} else {
  console.log("⚙️ Using temporary upload directory:", uploadDir);
}

// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueSuffix);
  },
});

// ✅ File filter (optional)
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

// ✅ Export upload middleware
export const upload = multer({ storage, fileFilter });
