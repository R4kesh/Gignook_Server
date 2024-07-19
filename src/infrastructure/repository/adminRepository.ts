import User from '../models/userModel'
import Post from '../models/post'
import Payment from '../models/payment'

export class adminRepository{

async listUsers(){
    try {
       const users=await User.find()
       if(users){
        return users
       } else{
        return false
       }
        
    } catch (error) {
        
    }
    }

async findUser(userId:string){
    try {

        const user=await User.findById(userId)
        if(user){
            return user
        }else{
            return false
        }
        
    } catch (error) {
        
    }
} 

async listFreelancer(){
    try {
        const result=await User.find({ 
            isFreelancer: false, 
            application: "Requested" 
        });
        if(result){
            return result
        }else{
            false
        }   
    } catch (error) {
        
    }
}

async freelancerApproval(id:string){
    const result=await User.findByIdAndUpdate(id,{ 
        isFreelancer: true, 
        application: "Approved" 
    },{new:true})
    if(result){
        return result
    }else{
        false
    }  
}

async freelancerReject(id:string){
    const result = await User.findByIdAndUpdate(
        id,
        {
            $unset: {
                languages: "",
                service: "",
                skills: "",
                education: "",
                description: "",
                displayName: "",
                personalWebsite: "",
                phoneNumber: "",
                occupation: "",
                document:"",
            },
            $set: {
                application: "Rejected"
            }
        },
        { new: true }
    );
    if(result){
        return result
    }else{
        false
    }  
}

async listFreelancers(){

    const result=await User.find({application: "Approved" })
    if(result){
        return result
    }else{
        return false
    }
}

async postList(){
    try {
       
        const posts = await Post.find().populate('userId','firstname email')
       
        if(posts){
            return posts
        }else{
            return false
        }
        
        
    } catch (error) {
        
    }
     
}

async paymentList() {
    try {
        const result = await Payment.find()
            .populate('userId')
            .populate('workId')
            .populate('freelancer')
            .sort({ date: -1 }); 

           
            
        if (result) {
            return result;
        } else {
            return false;
        }
        
    } catch (error) {
        console.error('Error retrieving payments:', error);
        throw error;
    }
}




    
}
