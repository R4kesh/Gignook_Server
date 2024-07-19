export class freelancerUseCase{
    private freelancerrepository:any
    constructor(repository:any){
        this.freelancerrepository=repository
    }

    async kycDetails(datas:any){
        try {
            const {
                displayName, description,  occupation,personalWebsite,phoneNumber,Print,articleVideo, webDevelopment, animation,...rest
            } = datas;
    
            const languages = [];
            if (rest.language1) languages.push(rest.language1);
            if (rest.language2) languages.push(rest.language2);
      
            const skills = [];
            if (rest.skill1) skills.push(rest.skill1);
            if (rest.skill2) skills.push(rest.skill2);
    
            const education = [];
            if (rest.Education1) education.push(rest.Education1);
            if (rest.education1) education.push(rest.education1);
      
            const services = [];
            if (Print === 'on') services.push('Print');
            if (articleVideo === 'on') services.push('Article/Video');
            if (webDevelopment === 'on') services.push('Web Development');
            if (animation === 'on') services.push('Animation');
    
          const data={
                displayName,
                description,
                occupation,
                personalWebsite,
                phoneNumber,
                languages,
                skills,
                education,
                services,
                email:rest.email
            }
            
            const newFreelancer=await this.freelancerrepository.freelancerData(data)
            if(newFreelancer){
                return true
            }else{
                return false
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }

    async profileImageUpload(userId:string,imageUrl:string){
        try {
            const result=await this.freelancerrepository.profileImageUpload(userId,imageUrl)
            if(result){
                return result
            }else{
                return false
            }
        } catch (error) {
            
        }
    }




    async findFreelancer(userId:string){
        try {
            const newUser=await this.freelancerrepository.findFreelancer(userId)
        if(newUser){
            return newUser
        }else{
            return false
        }
            
        } catch (error:any) {
            return { success: false, data: error.message }; 
        }
        

    }

    async updateProfile(userId:string,data:any){
        try {
            const update=await this.freelancerrepository.updateProfile(userId,data)
            if(update){
                return update
            }else{
                return false
            }
            
        } catch (error:any) {
            return { success: false, data: error.message };  
        }

   
    }

    async fileUpload(file:any,id:any){
        try {


        const result=await this.freelancerrepository.updateFile(file,id)
        if(result){
            return result
        }else{
            return false
        }
        
        
            
        } catch (error:any) {
            return { success: false, data: error.message };  
            
        }

    }

    async postInterest(userid:any,postId:any){
        try {

        const result=await this.freelancerrepository.postInterest(userid,postId)
            
        if(result){
            return result
        }else{
            return false
        }

        } catch (error:any) {
            return { success: false, data: error.message };  
            
        }

        
    }

    async savePost(userid:any,postId:any){
        try {
            const result=await this.freelancerrepository.savePost(userid,postId)
            
            if(result){
                return result
            }else{
                return false
            }

        } catch (error) {
            
        }
    }


    async workUpload(file:any,id:any){
        try {
            console.log('usecase');
            
           
        const result=await this.freelancerrepository.workUpload(file,id)
        if(result){
            return result
        }else{
            return false
        }
       
        } catch (error:any) {
            return { success: false, data: error.message };  
            
        }

    }

    async postWorkDatas(postId:any,postData:any){
        try {
        const result=await this.freelancerrepository.postWorkDatas(postId,postData)
           if(result){
            return result
           }else{
            false
           }
            
        } catch (error) {
            
        }
    }

    async workDetails(id:string){
        try {
        const result=await this.freelancerrepository.workDetails(id)
        if(result){
            return result
           }else{
            false
           }
            
        } catch (error) {
            
        }
    }

    async freelancerDetails(id:string){
        try {
        const result=await this.freelancerrepository.freelancerDetails(id)

        if(result){
            return result
        }else{
            false
        }
            
        } catch (error) {
            
        }
    }

    async freelancerWorks(id:string){
        try {
        const result=await this.freelancerrepository.freelancerWorks(id)

        if(result){
            return result
        }else{
            false
        }
            
        } catch (error) {
            
        }
    }



}