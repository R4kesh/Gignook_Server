import { Request,Response,NextFunction } from "express"
import User from "../../../infrastructure/models/userModel"
import {IfreelancerControl} from "../../../application/interface/IfreelancerControl"
import mongoose from 'mongoose';
import Post from "../../../infrastructure/models/post"
import Work from "../../../infrastructure/models/freelancerWork"
import Feedback from "../../../infrastructure/models/feedback"
import Payment from "../../../infrastructure/models/payment"
import Order from "../../../infrastructure/models/orders"

export class freelancerController{
    private freelancerusecase
    constructor(freelancerusecase:IfreelancerControl){
        this.freelancerusecase=freelancerusecase
    }
  
async  kycDetails(req:Request,res:Response,next:NextFunction){
    try {
        const data=req.body
        

        if (!data.displayName || !data.language1|| !data.skill1 || !data.education1 || !data.phoneNumber) {
            return res.status(400).json({
              success: false,
              message: 'Please fill up all the required fields.',
            });
          }
        
    const result=await this.freelancerusecase.kycDetails(data)
    if(result){
       
        return res.status(201).json({ success: true, message: 'Personal details addded successfully' });
        
    }else{
        return res.status(400).json({success:false,messsage:'Failed'})
        
    }
   
    } catch (error) {
        
    }
}   

async  profileImageUpload(req:Request,res:Response,next:NextFunction){
    const {imageUrl,userId}=req.body
   
    
    try {
    const uploadUrl=await this.freelancerusecase.profileImageUpload(userId,imageUrl)

        if(uploadUrl){
            return res.status(201).json({ success: true, message: 'Picture upload successfully',uploadUrl});
        }  else{
        return res.status(400).json({success:false,messsage:'picture upload Failed'})

        }

    } catch (error) {
        console.error('Error in profile upload:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}



async  fileUpload(req:Request,res:Response,next:NextFunction){
    try {
        const  {id}  = req.params;
       
    const datas=await this.freelancerusecase.fileUpload(req.files,id)

  if(datas){
    return res.status(201).json({ success: true, message: 'document upload successfullt',datas});
}  else{
return res.status(400).json({success:false,messsage:'document upload Failed'})

}
  
} catch (error) {
    return res.status(403).json({ success: false, message: 'Internal server error',error:error });

}

}


async  profileData(req:Request,res:Response,next:NextFunction){
    try {
    const { userId } = req.params;
    
    const result=await this.freelancerusecase.findFreelancer(userId)
  
    if(result){
        return res.status(200).json({ success: true, message: 'Freelancer found',result });
       }else{
        return res.status(500).json({ success: false, message: 'Error ' });
       } 
 
    } catch (error) {
        console.error('Freelancer data couldnt find', error);
  return res.status(500).json({ success: false, message: 'Internal server error' }); 
    }
}

async  profileUpdate(req:Request,res:Response,next:NextFunction){
    try {
        const data=req.body 
        const userId= req.params.id;
        const result=await this.freelancerusecase.updateProfile(userId,data)
        if(result){
            return res.status(200).json({ success: true, message: 'Freelancer found',result });
           }else{
            return res.status(500).json({ success: false, message: 'Error in updating' });
           } 
        
    } catch (error) {
        console.error('Freelancer data couldnt updated', error);
        return res.status(500).json({ success: false, message: 'Internal server error' }); 
        
    }  
}

async  workImage(req:Request,res:Response,next:NextFunction){
    const data=req.body.data
    try {
        const userId= req.params.id;
        console.log('id',userId);
        console.log('red',req.body);
        
        
        console.log('dz',data);
        
        
    } catch (error) {
        console.error('Error in work upload:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    }

    async  listPost(req:Request,res:Response,next:NextFunction){
        try {
            
            const posts = await Post.find().sort({ created: -1 }).populate('userId','firstname profilePicture')
            
            if(posts){
                return res.status(200).json({ posts });
            }else{
                return res.status(500).json({ message: 'Error fetching posts' });
            }
            
        } catch (error) {
            res.status(500).json({ message: 'Error fetching posts', error });
        }

    }

    async postInterest(req:Request,res:Response,next:NextFunction){
        try {
            
            
        const  postId  = req.params.id;
        const { userid } = req.body;
        
            
        const result=await this.freelancerusecase.postInterest(userid,postId)
            
        // io.emit('like',{postId,userid})
        if(result){
            
            return res.status(200).json({ message: `User ${result.isInterested ? 'removed interest' : 'shown interest'}`, result });   
        }else{
            return res.status(500).json({ message: 'Error in interest' });

        }
            
        } catch (error) {
            res.status(500).json({ message: 'Error fetching posts', error });
            
        }

    }

    async savePost(req:Request,res:Response,next:NextFunction){
        try {
        const  postId  = req.params.id;
        const { userid } = req.body;
      
            const result= await this.freelancerusecase.savePost(userid,postId)
        
            if(result){
                return res.status(200).json({ message: `Post ${result.userIndex > -1 ? 'unsaved' : 'saved'}`, result });   
            }else{
                return res.status(500).json({ message: 'Error in interest' });
    
            }

            
        } catch (error) {
            res.status(500).json({ message: 'Error fetching posts', error });
            
        }

    }

    async savedPost(req:Request,res:Response,next:NextFunction){
        try {
           
            const  userId  = req.params.id;
            console.log('save',userId);
            
            const user = await User.findById(userId).populate('savedPosts').exec()
            console.log('uz',user);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
              }

             return res.status(200).json({ savedPosts: user.savedPosts });
            
           
            
            
        } catch (error) {
            res.status(500).json({ message: 'Error fetching posts', error });
            
        }

    }


    async unSavePost(req:Request,res:Response,next:NextFunction){
        try {
            const  {id,postId}  = req.params;
            await User.findByIdAndUpdate(
                id,
                { $pull: { savedPosts: postId } },
                { new: true }
              );
                
              await Post.findByIdAndUpdate(postId, {
                $pull: { savedBy: id },
              });


            return res.json({ msg: 'Post unsaved successfully' });
            
        } catch (error) {
            res.status(500).json({ message: 'Error in unSave posts', error });
            
        }

    }

    


    async postWork(req:Request,res:Response,next:NextFunction){
        try {
            
            
         
          const  {id}  = req.params;
         
        const datas=await this.freelancerusecase.workUpload(req.files,id)
    
        if(datas){
          return res.status(201).json({ success: true, message: 'document upload successfullt',datas});
      }  else{
      return res.status(400).json({success:false,messsage:'document upload Failed'})
      
      }
          
        } catch (error) {
          
        }
      }

    async postWorkDatas(req:Request,res:Response,next:NextFunction){
        try {
            
            const {postId } = req.params;
            const postData = req.body;
            
            const datas=await this.freelancerusecase.postWorkDatas(postId,postData)

            if(datas){
              return res.status(201).json({ success: true, message: 'document upload successfullt',datas});
          }  else{
          return res.status(400).json({success:false,messsage:'document upload Failed'})
          
          }
            

            
        } catch (error) {
            
        }
    }

    async workList(req:Request,res:Response,next:NextFunction){
        try {
            
            const works = await Work.find({ userId: req.params.userId });
            res.status(200).json(works);
          } catch (err:any) {
            res.status(500).json({ message: err.message });
          }
    }

    async workDetails(req:Request,res:Response,next:NextFunction){
        try {
        
            const { id } = req.params;
           
            const result=await this.freelancerusecase.workDetails(id)

            if(result){

               return res.status(200).json(result);
               }else{
                return res.status(400).json({success:false,messsage:'document upload Failed'})
               }
            
        } catch (err:any) {
            res.status(500).json({ message: err.message });
        }
    }

    async freelancerDetails(req:Request,res:Response,next:NextFunction){
        try {
            const userId= req.params.id
            

            const result=await this.freelancerusecase.freelancerDetails(userId)
            
            if(result){

                return res.status(200).json(result);
                }else{
                 return res.status(400).json({success:false,messsage:'Cannot finde the freelancer details'})
                }

        } catch (error) {
            
        }
    }


    async freelancerWorks(req:Request,res:Response,next:NextFunction){
        try {
            const userId= req.params.id
            

            const result=await this.freelancerusecase.freelancerWorks(userId)
            
            if(result){

                return res.status(200).json(result);
                }else{
                 return res.status(400).json({success:false,messsage:'Cannot finde the freelancer details'})
                }

        } catch (error) {
            
        }
    }

    async feedbackList(req:Request,res:Response,next:NextFunction){
        try {
            const userId= req.params.id
                
                
            const feedback = await Feedback.find({freelancerId: userId }).populate('workId').populate('userId');

            console.log('feed',feedback);
            
            if(feedback){
                return res.status(200).json(feedback);
            }else{
                return res.status(400).json({success:false,messsage:'Cannot finde the feedback'})
            }
            
        } catch (error) {
            
        }
    }

    async workFeedback(req:Request,res:Response,next:NextFunction){
        try {
            const workId= req.params.id
              
                
            const feedback = await Feedback.find({ workId: workId })
  .populate('workId')
  .populate('userId')
  .sort({ date: -1 });

    
            
            if(feedback){
                return res.status(200).json(feedback);
            }else{
                return res.status(400).json({success:false,messsage:'Cannot finde the feedback'})
            }
            
        } catch (error) {
            
        }
    }

    async paymentHistory(req:Request,res:Response,next:NextFunction){
        try {
            const Id= req.params.id
            
            const payment=await Payment.find({freelancer:Id}).populate('userId').populate('workId')
            
            if(payment){
                return res.status(200).json(payment);
            }else{
                return res.status(400).json({success:false,messsage:'Cannot finde the payments'})
            }
            

            
        } catch (error) {
            
        }
    }

    async orderCount(req:Request,res:Response,next:NextFunction){
        
            const freelancerId= req.params.id
            
            
            
            try {
                const completedOrdersCount = await Order.countDocuments({
                  freelancer: new mongoose.Types.ObjectId(freelancerId),
                  status: 'completed',
                });
            
                const pendingOrdersCount = await Order.countDocuments({
                  freelancer: new mongoose.Types.ObjectId(freelancerId),
                  status: 'pending',
                });
            
                const totalPayments = await Order.aggregate([
                  { $match: { freelancer: new mongoose.Types.ObjectId(freelancerId), status: 'completed' } },
                  { $group: { _id: null, total: { $sum: '$amount' } } },
                  { $project: { _id: 0, total: 1 } },
                ]);

               
                
            
                res.json({
                  completedOrdersCount,
                  pendingOrdersCount,
                  totalPayments: totalPayments.length > 0 ? totalPayments[0].total : 0,
                });
            

            
        } catch (error) {
            
        }
    
    }

    async graphTotal(req:Request,res:Response,next:NextFunction){
        try {
            const  freelancerId  = req.params.id;

            const dailyOrdersCount = await Order.aggregate([
                { $match: { freelancer: new mongoose.Types.ObjectId(freelancerId) } },
                {
                  $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    count: { $sum: 1 },
                  },
                },
                { $sort: { _id: 1 } },
              ]);
          
             
              const monthlyOrdersCount = await Order.aggregate([
                { $match: { freelancer: new mongoose.Types.ObjectId(freelancerId) } },
                {
                  $group: {
                    _id: { $month: '$date' },
                    count: { $sum: 1 },
                  },
                },
                { $sort: { _id: 1 } },
              ]);
              console.log('daily',dailyOrdersCount,'mont',monthlyOrdersCount);
              
          
              return res.json({
                dailyOrdersCount,
                monthlyOrdersCount,
              });
         
            
            
            
        } catch (error) {
          console.log('error in fetching order',error);
            
        }
    }

    async freelancerOrders(req:Request,res:Response,next:NextFunction){
        try {
            
            const freelancerId = req.params.id;
          
            const orders = await Order.find({ freelancer: new mongoose.Types.ObjectId(freelancerId) })
            .populate('userId', 'firstname email ')
            .populate('workId', 'title');
            
           
            

          res.json(orders);

            
        } catch (error) {
           console.log('error in order fetch',error);
            
        }
    }

    async orderStatus(req:Request,res:Response,next:NextFunction){
        try {
            console.log('satt');
            const orderId=req.params.id
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { status: 'completed' },
                { new: true }
              );
          
              if (!updatedOrder) {
                return res.status(404).json({ error: 'Order not found' });
              }
          
             return  res.json(updatedOrder);
            
            
        } catch (error) {
           console.log('error in updating status',error);
            
        }
    }







    
}