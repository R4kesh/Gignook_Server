import { response } from 'express';
import User from '../models/userModel'
import bcryptjs from "bcryptjs"
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import dotenv from "dotenv";
import mongoose from 'mongoose';
import nodemailer from 'nodemailer'
import { IuserRepository } from '../../application/interface/IuserRepository';
import { user } from '../../domain/entities/user';
import { UploadedFile } from '../../application/interface/IfreelancerControl';
import Post from '../models/post';
import Payment from '../models/payment';
import Feedback from '../models/feedback';
import Order from '../models/orders';
dotenv.config();


export class  userRepository implements IuserRepository{

  async SignupUser(userData:any){
        try {
              
        const {firstname,lastname,email,password}=userData
      
        
          const hashedPassword=bcryptjs.hashSync(password,10)
          const emailToken = crypto.randomBytes(64).toString('hex');
          const newUser=new User({firstname,lastname,email,password:hashedPassword,emailToken,})
          await newUser.save()
          
          let BASE_URL=`${process.env.PUBLIC_BASE_URL}/api/user`
          console.log('base',BASE_URL);
          
    
          const verificationLink = `${BASE_URL}/verify?token=${emailToken}`;
                                                   
          const emailTemplatePath = path.join(__dirname, '../../../public/verifyEmail/emailVerify.html');
          const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');
          const emailContent = emailTemplate.replace(/{firstname}/g, firstname).replace(/{verificationLink}/g, verificationLink);
    
          const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user:process.env.NODEMAILER_USER ,
              pass:process.env.NODEMAILER_PASSWORD ,
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
    
          const mailOptions = {
            from: "GigNook",
            to: email,
            subject: 'Email Verification',
            html: emailContent,
          };
    

        await transporter.sendMail(mailOptions);
    console.log('Email sent:');
    return true;
      
        } catch (error) {
          console.error('Error sending email:', error);
    return false;
          
        }
    }

async findUser(email:string){
  const existingUser = await User.findOne({ email });
  if(existingUser){
    return  existingUser
  }else{
    return false
  }
}

async verifyUser(token:any,acceptHeader:any){
      try {
        
      const user = await User.findOne({ emailToken: token });
      if (user) {
                  user.emailToken = null;
                  user.isVerified = true;
                  user.save();
                  
                  const isHtmlRequest = acceptHeader.includes("text/html");
                  
                  if (isHtmlRequest) {
            
                    return true
                  
                  } else {
                    return false
                  }
                } else {
                  return response.status(404).json({ success: false, message: "Email verification failed. Invalid token." });
                }

        
      } catch (error) {
        console.error(error);
                return response.status(500).json({ success: false, message: "Internal server error." });
      }
    }


    async googleUser(details:user){
      try {
        const {firstname,lastname,email}=details
       
        const newUser=new User({firstname,lastname,email,isVerified:true})
        
          await newUser.save()
        return true
      } catch (error) {
        
      }

    }

    async elsegoogleUser(details:user){
      try {
        const email=details.email
        const user = await User.findOne({email:email});
        if (user) {
          user.emailToken = null;
          user.isVerified = true;
          user.save();
        }
        return true
      } catch (error) {
        
      }
    
    }

    async forgetPasswordSendEmail(email:string,verificationCode:number){
      try {
        const transporter=nodemailer.createTransport({
                service:"gmail",
                auth:{
                  user:process.env.NODEMAILER_USER ,
                  pass:process.env.NODEMAILER_PASSWORD ,
                },
            })

     const mailOptions={
    from:"Otp generate",
    to:email,
    subject:"Forgot password Email Verification",
    text:`your otp code is:${verificationCode}`
  }

  transporter.sendMail(mailOptions, async (error, info) => {
  if (error) {
    return  false
  } else {
   return verificationCode   
  }
});
return verificationCode
      } catch (error) {

      }
    }

async resetPassword(email:string,hashedPassword:any){
try {

  const user = await User.findOneAndUpdate({ email }, { password: hashedPassword });
  if(user){
    return true
  }else{
    false
  }
} catch (error) { 
}
    }



    async updateFile(files:UploadedFile[],id:any){

      try {
     
        const fileLocations = files.map(file => file.location);
const flattenedLocations = fileLocations.flat();
       
        
        let post = await Post.findOne({ userId: new mongoose.Types.ObjectId(id) });
        
        
        if (post) {
          post = new Post({
            userId: new mongoose.Types.ObjectId(id),
            images: flattenedLocations
        });
      } else {
          post = new Post({
              userId: new mongoose.Types.ObjectId(id),
              images: flattenedLocations
          });
      } 


      const savedPost = await post.save();
   if(savedPost){
    return savedPost
   }else{
    false
   }
        
      } catch (error) {
        console.log('error in repository update file',error);
        
      }

    }

    async postDatas(id:any,postId:any,postData:any){
      try {
      
        
        const updatedPost = await Post.findByIdAndUpdate(postId, postData, { new: true });
        
        if(updatedPost){
          return updatedPost
        }else{
          return false
        }
        
      } catch (error) {
        
      }

    }

    async gigPayment(amount:any,title:any,image:any,workId:String,userId:String,Fname:string){
      try {
        const newPayment = new Payment({
          userId: userId,
          workId: workId,
          amount: amount,
          title: title,
          image: image,
          freelancer:Fname
        });
    
        const result = await newPayment.save();
        console.log('Payment saved successfully:', result);

        const newOrder=new Order({
          userId: userId,
          workId: workId,
          amount: amount,
          title: title,
          freelancer:Fname
        })
        const orderresult=await newOrder.save();


       if(result&&orderresult){
        return true
       }else{
        false
       }
        
      } catch (error:any) {
        console.log('error in repo',error);
        
      }
    }

    async feedback(workId:string,freelancerId:string,userId:string,rating:number,feedback:string){
      try {

        const newFeedback = new Feedback({
          workId,
          freelancerId,
          userId,
          rating,
          feedback,
        });
    
        
        const result=await newFeedback.save();

        const feedbacks = await Feedback.aggregate([
          { $match: { freelancerId:new mongoose.Types.ObjectId(freelancerId) } },
          { $group: { _id: null, avgRating: { $avg: '$rating' } } },
        ]);

        const avgRating = feedbacks.length > 0 ? feedbacks[0].avgRating : 0;

        const updatedFreelancer = await User.findByIdAndUpdate(
          freelancerId,
          { rating: avgRating },
          { new: true }
        );

        if(result&&updatedFreelancer){
          return result
        }else{
          false
        }
        
        
      } catch (error) {
        
      }
    }



}

