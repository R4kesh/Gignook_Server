import Jwt  from 'jsonwebtoken';
import dotenv from "dotenv";
import { user } from '../../domain/entities/user';
import { IuserUsecase } from '../interface/IuserUsecase';
import { IuserRepository } from '../interface/IuserRepository';
import User from '../../infrastructure/models/userModel';
import Stripe from 'stripe';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,{
  apiVersion:"2024-04-10",
});




export class userUseCase implements IuserUsecase{
    private userrepository:IuserRepository
    constructor(repository:IuserRepository){
        this.userrepository=repository
    }

    async userSignup(userData:user){
        try {
            
           
            const newUser=await this.userrepository.SignupUser(userData)
            
            
            if(newUser){
                return true
            }else{
                return false
            }
        } catch (error:any) {
            return { success: false, data: error.message };
        }

    }

    async findUserExist(email:string){
        try {
            const newUser=await this.userrepository.findUser(email)
        if(newUser){
            return newUser
        }else{
            return false
        }
            
        } catch (error:any) {
            return { success: false, data: error.message }; 
        }
        

    }

 async userVerify(token:any,acceptHeader:any){
        try {
           
            const verifyUser=await this.userrepository.verifyUser(token,acceptHeader)
            if(verifyUser){
                return true
            }else{
                return false
            }

        } catch (error:any) {
            return { success: false, data: error.message }; 
            
        }
    }

  


     
     async googleDatabase(details:any){ 
        try {
            
            const verifyUser= await this.userrepository.googleUser(details)
            if(verifyUser){
                return true
            }else{
                return false
            }

        } catch (error) {
            
        }
     }

     async  elsegoogleDatabase(details:any){
        try {
            const verifyUser=await this.userrepository.elsegoogleUser(details)
            if(verifyUser){
                return true
            }else{
                return false
            }
        } catch (error) {
            
        }
     }


     async forgetPasswordSendEmail(email:string){
        try {
            const verificationCode = Math.floor(1000 + Math.random() * 9000);
            const sentEmail=this.userrepository.forgetPasswordSendEmail(email,verificationCode)
          
            if(sentEmail){
                return sentEmail
            }else{
                return false
            }
            
        } catch (error) {
            
        }
     }

     async resetPassword(email:string,hashedPassword:string){
        try {
            const sentEmail=await this.userrepository.resetPassword(email,hashedPassword)
            if(sentEmail){
                return true
            }else{
                return false
            }
            
        } catch (error) {
            
        }
     }

     async listFreelancers(search:string, category:string, sortOrder:string){
        try {

            let filter: any = {
                isFreelancer: true,
                isBlocked: false
              };
            
              if (search) {
                filter.$or = [
                  { firstname: { $regex: search, $options: 'i' } },
                  { lastname: { $regex: search, $options: 'i' } }
                ];
              }
            
              if (category) {
                filter.service = category;
              }
            
              let sort: any = {};
              if (sortOrder === 'lowToHigh') {
                sort.rating = 1;
              } else if (sortOrder === 'highToLow') {
                sort.rating = -1;
              }

            const result =  await User.find(filter).sort(sort);
              
    if(result){
        return result
    }else{
        return false
    }


        } catch (error) {
            
        }
     }

     async fileUpload(file:any,id:any){
        try {
           
        const result=await this.userrepository.updateFile(file,id)
        if(result){
            return result
        }else{
            return false
        }
       
        } catch (error:any) {
            return { success: false, data: error.message };  
            
        }

    }


     async postDatas(id:any,postId:any,postData:any){
        try {
        const result=await this.userrepository.postDatas(id,postId,postData)
           if(result){
            return result
           }else{
            false
           }
            
        } catch (error) {
            
        }

     }

     

 async gigPayment(amount:number,title:string,image:string[],workId:String,userId:String,Fname:String){
        try {
            
    const product = await stripe.products.create({
      name:title,
      images:image
       
  });

    const price=await stripe.prices.create({
      product:product.id,
      unit_amount:Math.round(amount*100),
      currency:'inr'
    })

    const session = await stripe.checkout.sessions.create({
        
        line_items:<any>[
          {
            price: price.id,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/work/payment/success`,
        cancel_url: `${process.env.BASE_URL}/work/payment/failure`,
        
      });
      
     

      const result=await this.userrepository.gigPayment(amount,title,image,workId,userId,Fname)
      
      if(result){
        if(session){
            return session
        }  else{
        return false
        
        }
    
      }else{
        if(session){
            return session
        }  else{
        return false
        
        }
    
      }
        
        } catch (error) {
            console.log('error in usecase',error);
            
        }
     }


     async feedback(workId:string,freelancerId:string,userId:string,rating:number,feedback:string){
        try {

      const result=await this.userrepository.feedback(workId,freelancerId,userId,rating,feedback)
      if(result){
        return result
      }else{
        return false
      }
  
        } catch (error) {
            
        }

     }






}
