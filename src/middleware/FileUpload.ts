const multer = require('multer');
const path = require('path');
const util = require('util')
import dotenv from "dotenv";
import { Request,Response,NextFunction, } from "express"

dotenv.config();
const {S3Client}= require('@aws-sdk/client-s3')
const multerS3=require('multer-s3')
const s3=new S3Client({
    credentials:{
       secretAccessKey:process.env.S3_SECRET_KEY,
       accessKeyId:process.env.S3_ACCESS_KEY,
    },
    region:"eu-north-1"
})

const storage=multerS3({
    s3:s3,
    bucket:"gignook" ,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata:function(req:Request,file:any,cb:any){
        cb(null,{fieldName:file.fieldname})
    },
    key:function(req:Request,file:any,cb:any){
        cb(null,Date.now().toString())
    }
})

function checkFileType(file:any, cb:any) {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|png|pdf/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);
    

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Files only (jpeg, jpg, png, gif, mp4, mov, png,pdf)!');
    }
  }

  const upload = multer({
    storage: storage,
    fileFilter: function (req:Request, file:any, cb:any) {
      checkFileType(file, cb);
    },
  }); 
  
  const uploadMiddleWare = upload

  export= uploadMiddleWare







