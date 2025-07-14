import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Save files in this local directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Example: avatar-1620000123456-987654321
  },
});

export const upload = multer({
  storage,
});
