const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Storage Destination:", file);
    console.log("Uploading to directory: uploads/");
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const filename =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

// Check file type
function checkFileType(file, cb) {
  console.log("Checking file type for:", file.originalname);
  console.log("Mimetype:", file.mimetype);
  console.log("Extension:", path.extname(file.originalname));

  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  console.log("Extension valid:", extname);
  console.log("Mimetype valid:", mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Images only! (jpeg, jpg, png)");
  }
}

// Init upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    console.log("Processing file:", file.originalname);
    checkFileType(file, cb);
  },
});

module.exports = upload;
