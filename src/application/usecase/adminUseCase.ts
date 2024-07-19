import Post from "../../infrastructure/models/post";
export class adminUseCase{
    private adminrepository:any;
    constructor(repository:any){
        this.adminrepository=repository
    }

    async listUsers(){
        try {
            const users=this.adminrepository.listUsers()
            if(users){
                return users
               } else{
                return false
               }
            
        } catch (error:any) {
            return { success: false, data: error.message };
        }
    }

    async findUser(userId:string){
        try {
            const user=this.adminrepository.findUser(userId)
            if(user){
                return user
            }else{
                return false
            }
            
        } catch (error:any) {
            return { success: false, data: error.message }; 
        }
    }

    async listFreelancer(){
        try {
            const result=await this.adminrepository.listFreelancer()
            if(result){
                return result
            }else{
                return false
            }
            
        } catch (error) {
            
        }
    }

    async freelancerApproval(id:string){
        try {
            const result=await this.adminrepository.freelancerApproval(id)
            if(result){
                return result
            }else{
                return false
            }
            
        } catch (error) {
            
        }
    }

    async freelancerReject(id:string){
        try {
            const result=await this.adminrepository.freelancerReject(id)
            if(result){
                return result
            }else{
                return false
            }
            
        } catch (error) {
            
        }
    }

    async listFreelancers(){
        try {
            const result=await this.adminrepository.listFreelancers()
            if(result){
                return result
            }else{
                return false
            }
            
        } catch (error) {
            
        }
    }

    async postList(){
        try {
       

            const result=await this.adminrepository.postList()
            if(result){
                return result
            }else{
                return false
            }
            
        } catch (error) {
            
        }
    }

    async findPost(postid:any){
        try {
            const post=await Post.findById(postid)
            if(post){
                return post
            }else{
                return false
            }
            
        } catch (error) {
            
        }

    }

    async paymentList(){
        try {
            const result=await this.adminrepository.paymentList()

            if(result){
                return result
            }else{
                return false
            }
            
        } catch (error) {
            
        }
    }




}