import { Request,Response,NextFunction } from "express"
import bcryptjs from "bcryptjs"
import dotenv from 'dotenv'
dotenv.config();
import { IuserUsecase } from "../../../application/interface/IuserUsecase";
import Work from "../../../infrastructure/models/freelancerWork";
import Post from "../../../infrastructure/models/post";
import Payment from "../../../infrastructure/models/payment";
import User from "../../../infrastructure/models/userModel";
import { generateGoogleUserJWT, generateUserJWT } from "../../../services/jwtServices";
import { generateRefreshJWT } from "../../../services/jwtServices";
import Conversation from "../../../infrastructure/models/conversation";
import Message from "../../../infrastructure/models/messages";




export class userController{
  private userusecase:IuserUsecase
  constructor(usecase:IuserUsecase){
    this.userusecase=usecase
  }
  

  async signupPost(req:Request,res:Response,next:NextFunction){
    try {
        
        const userData=req.body;

        if (!userData.email || !userData.password || !userData.firstname || !userData.lastname) {
          return res.status(400).json({
            success: false,
            message: 'Please fill up all the required fields.',
          });
        }
      
        const existingUser=await this.userusecase.findUserExist(req.body.email)

        if(userData==null){
          return res.status(400).json({
            success: false,
            message:'Fillup all the field',
          });
        }

        if (existingUser){
          
          if (!existingUser.isVerified){
            return res.status(400).json({
              success: false,
              message:'Email is already registered but not verified. Verification email has been sent.',
            });
          } else {
            return res.status(400).json({
              success: false,
              message: 'Email is already registered and verified.',
            });
          }
        }else{

          const result=await this.userusecase.userSignup(userData);
       

          if(result){
            return res.status(201).json({ success: true, message: 'Signup successful. Verification email sent.' });

          }else{
            return res.status(400).json({success:false,messsage:'signup fail.Email.sent'})
          }
        }
        
    } catch (error) {
      res.status(500).json({ message: "internal server error" });  
    }
  }

  async verifyEmail(req:Request,res:Response,next:NextFunction){
    try {
      
      const acceptHeader = req.headers.accept || "";
      const { token } = req.query;
  
      if (!token) return res.status(404).json("email not found ...");

      const user=await this.userusecase.userVerify(token,acceptHeader)
      if(user){
        res.redirect(302,`${process.env.BASE_URL}/login`)
      }else{
        return res.status(400).json({success:false,messsage:'Email verification failed'})
      }

      
    } catch (error) {

      res.status(500).json({ message: "internal server error" });  
    }
  }

  async loginVerify(req:Request,res:Response,next:NextFunction){
    try {
      console.log('controller');
      
      const {email,password}=req.body;
      const existingUser=await this.userusecase.findUserExist(email)
      
      if (!existingUser) {
               return res.status(401).json({
               success: false,
             message: 'Invalid email or password.',
            });
           }
        
      if (!existingUser?.isVerified) {
              return res.status(401).json({
             success: false,
              message: 'Email not verified. Please check your email for verification instructions.',
                 });
                  }
        
     if (existingUser?.isBlocked) {
              return res.status(401).json({
               success: false,
               message: 'You are blocked. Please contact support for assistance.',
               });
                  }
 const validPassword = bcryptjs.compareSync(password, existingUser.password);
               if (!validPassword) {
                  return res.status(401).json({
                 success: false,
                    message: 'Invalid email or passwordz.',
                    });
                 }

   const tokenCreation=generateUserJWT(existingUser._id as string)
   const refreshTokenCreation=generateRefreshJWT(existingUser._id as string) 


   if(tokenCreation && refreshTokenCreation){
    return res
    .cookie('token', tokenCreation, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 15 * 60 * 1000), 
      sameSite: 'strict',
    })
  
    .cookie('refresh_token', refreshTokenCreation, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      sameSite: 'strict',
    })

.status(200)
  .json({success:true,token:tokenCreation,refresh_token:refreshTokenCreation,existingUser}); 

   }else{
    return res.json({success:false})
   }
    } catch (error:any) {
      console.error('Error during login:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Error during login',
      });
    }

  }

  async googleSign(req:Request,res:Response,next:NextFunction){
    try {
      const {name,email}=await req.body
      const [firstname, lastname] = name.split(' ');
      const details={
        firstname,lastname,email
      }
      const user=await this.userusecase.findUserExist(email)
      if(!user){
         const user=await this.userusecase.googleDatabase(details)

      }else{
        const user=await this.userusecase.elsegoogleDatabase(details)

      }
      const token=generateGoogleUserJWT(user._id as string)
     
     
      
      return res
      .cookie('token', token, { httpOnly: true,secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 1000
    ,sameSite: 'strict', })
      .status(200).json({
              success: true,
              message: 'User authenticated successfully.',
              token
            });

    } catch (error) {
      
    }

  }

  async forgetPasswordSendEmail(req:Request,res:Response,next:NextFunction){
    try {
      const {email}=req.body
      const user=await this.userusecase.findUserExist(email)
      
      if(!user){
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const result=await this.userusecase.forgetPasswordSendEmail(email)
      
      
      if(result){
       return res.status(200).json({
                success: true,
                message: 'Email sent successfully',
                verificationCode: result
              });
      }else{
       return res.status(500).json({
        success: false,message:'Error sending email',
       })
      }
      
    } catch (error) {
  }}

  async verifyForgetOtp(req:Request,res:Response,next:NextFunction){
    try {
      const { otp, email, verificationCode } = req.body;
      if (!otp || !verificationCode) {
            return res.status(400).json({ success: false, message: 'OTP and verification code are required' });
          }
       
          if (otp === verificationCode) {
                return res.status(200).json({ success: true, message: 'OTP verified successfully' });
              } else {
                return res.status(400).json({ success: false, message: 'Invalid OTP' });
              }
      
    } catch (error) {
      console.error('Error in verifyForgotOtp:', error);
  return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async forgetResetPassword(req:Request,res:Response,next:NextFunction){
    try {
         const { email, newPassword } = req.body; 
         const hashedPassword = await bcryptjs.hashSync(newPassword,10);
         const result=await this.userusecase.resetPassword(email,hashedPassword)
         if(result){
          return res.status(200).json({ success: true, message: 'Password reset successfully' });
         }else{
          return res.status(500).json({ success: false, message: 'Error resetting password' });
         }
      
    } catch (error) {
      console.error('Error in verifyForgotOtp:', error);
  return res.status(500).json({ success: false, message: 'Internal server error' });
    }

  }

  async freelancerOrNot(req:Request,res:Response,next:NextFunction){
    try {
      const {email}=req.body
      const user=await this.userusecase.findUserExist(email)
      if (!user){
        return res.status(400).json({
          success: false,
          message:'Cannott find the freelancer',
        });
      }else{
        return res.status(200).json({
          success:true,data:user
        })
      }
      
    } catch (error) {
      console.error('Error in verifyForgotOtp:', error);
  return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async listFreelancers(req:Request,res:Response,next:NextFunction){
    try {
      const { search, category, sortOrder } = req.query;
      const result= await this.userusecase.listFreelancers(search, category, sortOrder)
     
      
      if (!result){
        return res.status(400).json({
          success: false,
          message:'Cannott find the freelancer',
        });
      }else{
        return res.status(200).json({
          success:true,data:result
        })
      }
     
      
    } catch (error) {
      
    }
  }

  async notBlocked(req:Request,res:Response,next:NextFunction){
  
    const { id } = req.params;
    
    const user=await this.userusecase.findUserExist(id)
    if (!user){
      return res.status(400).json({
        success: false,
        message:'Cannott find the User',
      });
    }else{
      return res.status(200).json({
        success:true,data:user
      })
    }

  }


  async postUpload(req:Request,res:Response,next:NextFunction){
    try {
     
    } catch (error) {
      
    }
  }

  async postFile(req:Request,res:Response,next:NextFunction){
    try {
      
     
      const  {id}  = req.params;
     
    const datas=await this.userusecase.fileUpload(req.files,id)

    if(datas){
      return res.status(201).json({ success: true, message: 'document upload successfullt',datas});
  }  else{
  return res.status(400).json({success:false,messsage:'document upload Failed'})
  
  }
      
    } catch (error) {
      
    }
  }

  async postDatas(req:Request,res:Response,next:NextFunction){
    try {    
      const { id, postId } = req.params;
  const postData = req.body;

    const datas=await this.userusecase.postDatas(id,postId,postData)

    if(datas){
      return res.status(201).json({ success: true, message: 'document upload successfullt',datas});
  }  else{
  return res.status(400).json({success:false,messsage:'document upload Failed'})
  
  }
      
    } catch (error) {
      
    }

  }


  async listWorks(req:Request,res:Response,next:NextFunction){
    try {

      const result=await Work.find({}).populate('userId')

      if (!result){
        return res.status(400).json({
          success: false,
          message:'Cannot find the Works',
        });
      }else{
        return res.status(200).json({
          success:true,data:result
        })
      }
      
    } catch (error) {
      
    }

  }

  async gigPayment(req:Request,res:Response,next:NextFunction){
    try {
      console.log('contrp',req.body);
     
      const {amount,title,image,workId,userId,Fname}=req.body
    

      const session=await this.userusecase.gigPayment(amount,title,image,workId,userId,Fname)

      if (session){
        return res.status(201).json({ success: true, message: 'payment done',session});

      }else{
        return res.status(400).json({success:false,messsage:'payment  Failed'})
      }

      
    } catch (error) {
      console.log('error in controller',error);
      
    }
  }


  async feedback(req:Request,res:Response,next:NextFunction){
    try {
      
      const {workId,freelancerId,userId,rating,feedback}=req.body
      const result=await this.userusecase.feedback(workId,freelancerId,userId,rating,feedback)
      
      if(result){
        return res.status(201).json({ success: true, message: 'feedback Updated',result});
      }else{
        return res.status(400).json({success:false,messsage:'updation Failed'})
       
      }
       
      
    } catch (error) {
      
    }
  }

  async postList(req:Request,res:Response,next:NextFunction){
    try {

      const { id } = req.params;

      const result=await Post.find({userId:id}).populate('interestedUsers', 'firstname profilePicture') // Populate interestedUsers with name and profilePicture
      .exec();
      
      
      if(result){
        return res.status(201).json({ success: true, message: 'list posts',result});
      }else{
        return res.status(400).json({success:false,messsage:'List Postes Failed'})
      }
      
      

      
    } catch (error) {
      
    }
  }

  async paymentHistory(req:Request,res:Response,next:NextFunction){
    try {
        const Id= req.params.id
        
        const payment=await Payment.find({userId:Id}).populate('freelancer').populate('workId')
        
        if(payment){
            return res.status(200).json(payment);
        }else{
            return res.status(400).json({success:false,messsage:'Cannot find the payments'})
        }
        

        
    } catch (error) {
        
    }
}

async findUser(req:Request,res:Response,next:NextFunction){
  try {
      const Id= req.params.id
      
      const result=await User.findById(Id)
      
      if(result){
          return res.status(200).json(result);
      }else{
          return res.status(400).json({success:false,messsage:'Cannot find the user'})
      }
      

      
  } catch (error) {
      
  }
}



async conversation(req:Request,res:Response,next:NextFunction){
  try {
 
    
      const userId= req.params.id
      const conversations = await Conversation.find({ members: { $in: [userId] } });
      const conversationUserData = Promise.all(conversations.map(async (conversation) => {
          const receiverId = conversation.members.find((member) => member !== userId);
          const user = await User.findById(receiverId);
          return { user: { receiverId: user?._id, email: user?.email, firstname: user?.firstname }, conversationId: conversation._id }
      }))
      
      
      
      
      if(conversationUserData){
          return res.status(200).json(await conversationUserData);
      }else{
          return res.status(400).json({success:false,messsage:'Cannot find the user'})
      }
      

      
  } catch (error) {
      
  }
}

async users(req:Request,res:Response,next:NextFunction){
  try {
    
    
    const userId = req.params.id;
    const users = await User.find({$and: [{ _id: { $ne: userId } }, { isFreelancer: true }
      ]
    });
   
    
    const usersData = Promise.all(users.map(async (user) => {
        return { user: { email: user.email, fullName: user.firstname, receiverId: user._id,profilePicture:user.profilePicture } }
    }))
    
    
      
      if(usersData){
          return res.status(200).json(await usersData);
      }else{
          return res.status(400).json({success:false,messsage:'Cannot find the user'})
      }
 
  } catch (error) {
      
  }
}

async messageConversations(req:Request,res:Response,next:NextFunction){
  try {
 
   
    const checkMessages = async (conversationId: any) => {
      console.log(conversationId, 'conversationId')
      const messages = await Message.find({ conversationId });
      const messageUserData =await Promise.all(messages.map(async (message) => {
          const user = await User.findById(message.senderId);

          return { user: { id: user?._id, email: user?.email, fullName: user?.firstname }, message: message.message }
      }));
      console.log('messada',messageUserData);
      
     return res.status(200).json( messageUserData);
  }
  const conversationId = req.params.conversationId;
  console.log('CONID',conversationId);
  
  if (conversationId === 'new') {
      const checkConversation = await Conversation.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });
      console.log('check',checkConversation);
      
      if (checkConversation.length > 0) {
          checkMessages(checkConversation[0]._id);
      } else {
          return res.status(200).json([])
      }
  } else {
      checkMessages(conversationId);
  }
  } catch (error) {
      
  }
}

async message(req:Request,res:Response,next:NextFunction){
  try {
    console.log('messageeee');
    console.log('body',req.body);
    
    

    const { conversationId, senderId, message, receiverId = '' } = req.body;
    if (!senderId || !message) return res.status(400).send('Please fill all required fields')
    if (conversationId === 'new' && receiverId) {
        const newCoversation = new Conversation({ members: [senderId, receiverId] });
        await newCoversation.save();
        const newMessage = new Message({ conversationId: newCoversation._id, senderId, message });
        await newMessage.save();
        return res.status(200).send(newMessage);
    } else if (!conversationId && !receiverId) {
        return res.status(400).send('Please fill all required fields')
    }
    const newMessage = new Message({ conversationId, senderId, message });
    await newMessage.save();
   return res.status(200).send(newMessage);
    
    
    
  } catch (error) {
      
  }
}




}

