import { Request,Response,NextFunction } from "express"
import dotenv from 'dotenv'
import { adminGenerateJWT } from "../../../services/jwtServices";
import User from "../../../infrastructure/models/userModel";
import Payment from "../../../infrastructure/models/payment";
dotenv.config();

export class adminController{
    private adminusecase:any;
    constructor(usecase:any){
    this.adminusecase=usecase
    }

async login(req:Request,res:Response,next:NextFunction){
    try {
    const {email,password}=req.body;
    let adminEmail=process.env.ADEMAIL
    let adminPassword=process.env.ADPASSWORD

    if (adminEmail!== email || adminPassword!== password) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password.',
                  });
        }
        
        const token = adminGenerateJWT(adminEmail as string);
      console.log('Token:', token);
      console.log('Email:', adminEmail);
               return res
                
              .status(200)
              .json({success:true,token});
    
        
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
          success: false,
          message: 'Error during login',
        }); 
    }

    
}

async userList(req:Request,res:Response,next:NextFunction){
    try {
        const users=await this.adminusecase.listUsers()
        if(users){
           return res.json({users}); 
        }else{
            return res.json({message:'Internal server error'})
        }
        
    } catch (error) {
        
    }
}


async usersAction(req:Request,res:Response,next:NextFunction){
    const { userId, action } = req.params;
    try {
       
        
        const user=await this.adminusecase.findUser(userId)
       
        
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        user.isBlocked = action === 'block';
        await user.save()

        return  res.json({ message: `User ${action === 'block' ? 'blocked' : 'unblocked'} successfully`, user });
     
    } catch (error) {
        console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}


async freelancerList(req:Request,res:Response,next:NextFunction){
try {

    const freelancer=await this.adminusecase.listFreelancer()
    if(freelancer){
        return res.json({freelancer}); 
    }else{
        return res.json({message:'Internal server error'})  
    }

    
} catch (error) {
    console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
}

}

async freelancerDetails(req:Request,res:Response,next:NextFunction){
    const {freelancerId} = req.params;
    try {
        const freelancer=await this.adminusecase.findUser(freelancerId)
        if(freelancer){
            return res.json({freelancer}); 

        }else{
        return res.json({message:'Internal server error'})  

        }
 
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }


}

async freelancerApproval(req:Request,res:Response,next:NextFunction){
    const {id} = req.params;
    try {
        const result=await this.adminusecase.freelancerApproval(id)

        if (!result){
            return res.status(404).json({ message: 'Freelancer not found' });
        }else{
            res.json({ message: 'User approved', result});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
}

async freelancerReject(req:Request,res:Response,next:NextFunction){
    const {id} = req.params;
    try {
        const result=await this.adminusecase.freelancerReject(id)
        
        if (!result){
            return res.status(404).json({ message: 'Freelancer not found' });
        }else{
            res.json({ message: 'User rejected', result});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
}

async freelancersList(req:Request,res:Response,next:NextFunction){
    try {
        const freelancers=await this.adminusecase.listFreelancers()
        if(freelancers){
            return res.json({freelancers}); 
         }else{
             return res.json({message:'Internal server error'})
         }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }

}


async freelancersAction(req:Request,res:Response,next:NextFunction){
    const { userId, action } = req.params;
    try {
        const freelancer=await this.adminusecase.findUser(userId)

         if(!freelancer){
            return res.status(404).json({ message: 'Freelancer not found' });
        }
        freelancer.isFreelancer = action === 'block';
        await freelancer.save()

        return  res.json({ message: `User ${action === 'block' ? 'blocked' : 'unblocked'} successfully`, freelancer });

        
    } catch (error) {
        console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

}

async postList(req:Request,res:Response,next:NextFunction){
    try {
        
        const posts=await this.adminusecase.postList()
        return res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async postListUnlist(req:Request,res:Response,next:NextFunction){
    try {
        const { postid, action } = req.params;
       
        const post=await this.adminusecase.findPost(postid)

        if(!post){
            return res.status(404).json({ message: 'post not found' });
        }else{
            post.isListed = action === 'list';
            await post.save()
    
            return  res.json({ message: `Post ${action === 'list' ? 'listed' : 'unlisted'} successfully`, post });
        }
        
        
    } catch (error) {
        
    }
}

async paymentList(req:Request,res:Response,next:NextFunction){
    try {
        const payment=await this.adminusecase.paymentList()
        

        if(payment){
            return res.json({payment})
        }else{
        return res.json({message:'Internal server error'})  

        }
        
    } catch (error) {
        
    }
}

async countDocument(req:Request,res:Response,next:NextFunction){
    try {
       
        const userCount = await User.countDocuments({ isVerified: true });
        const freelancerCount = await User.countDocuments({ isFreelancer: true });
        const totalPayments = await Payment.aggregate([
          {
            $group: {
              _id: null,
              totalAmount: { $sum: '$amount' },
            },
          },
        ]);
        console.log('user',userCount);
        console.log('free',freelancerCount);
        console.log('pay',totalPayments);
        
        
    
        res.json({
          userCount,
          freelancerCount,
          totalPayments: totalPayments[0]?.totalAmount || 0,
        });
        
    } catch (error) {
        
    }
}



async totalPayments(req:Request,res:Response,next:NextFunction){
    try {
        console.log('opayme');
        const dailyPayments = await Payment.aggregate([
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
                    totalAmount: { $sum: "$amount" } 
                } 
            },
            { $sort: { _id: 1 } } 
        ]);
          console.log('da',dailyPayments);
          
      
      
          const monthlyPayments = await Payment.aggregate([
            { $group: { _id: { $month: "$date" }, totalAmount: { $sum: "$amount" } } },
            { $sort: { _id: 1 } } 
          ]);
          console.log('ma',monthlyPayments);

      
         return  res.json({
            dailyPayments,
            monthlyPayments
          });
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch payment totals' });
        }
}





}