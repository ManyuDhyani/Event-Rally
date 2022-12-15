const path = require("path");
const multer = require("multer");
const e = require("express");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/profilePictures");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg") {
      callback(null, true);
    } else {
      console.log("only jpg and png files supported");
      callback(null, false);
    }
  },
});

module.exports = upload;
