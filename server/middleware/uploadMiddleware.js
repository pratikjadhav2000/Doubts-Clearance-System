import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "server", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created uploads directory:", uploadDir);
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
