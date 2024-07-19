"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const multer = require('multer');
const path = require('path');
const util = require('util');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const s3 = new S3Client({
    credentials: {
        secretAccessKey: process.env.S3_SECRET_KEY || "AoQ8wK9Gp2lx9A5C/qlPkRr5h2QpL3c0hMqnEGad",
        accessKeyId: process.env.S3_ACCESS_KEY || "AKIASLAJZHQ3FL2IQRCV"
    },
    region: "eu-north-1"
});
const storage = multerS3({
    s3: s3,
    bucket: "gignook",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        cb(null, Date.now().toString());
    }
});
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb('Error: Files only (jpeg, jpg, png, gif, mp4, mov, png,pdf)!');
    }
}
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});
const uploadMiddleWare = upload;
module.exports = uploadMiddleWare;
