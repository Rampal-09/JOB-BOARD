import multer from "multer";

const storage = multer.memoryStorage();

const filtertype = (file, cb, req) => {
  if (file.mimetype === "appication/pdf") {
    return cb(null, true);
  } else {
    cb(new Error(cb(new Error("Only PDF files are allowed"), false)));
  }
};
export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
}).single("resume");
