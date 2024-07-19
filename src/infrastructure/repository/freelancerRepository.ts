import User from "../models/userModel";
import { UploadedFile } from "../../application/interface/IfreelancerControl";
import Post from "../models/post";
import mongoose from 'mongoose';
import Work from "../models/freelancerWork";


export class freelancerRepository {

    async freelancerData(data:any){
        try {
            const {
                displayName,
                description,
                occupation,
                personalWebsite,
                phoneNumber,
                languages,
                skills,
                education,
                services,
                email
              } = data;
        
     const user = await User.findOne({ email });
     if(!user){
        return false
     }
     
     
     user.displayName = displayName || user.displayName;
      user.description = description || user.description;
      user.occupation = occupation || user.occupation;
      user.personalWebsite = personalWebsite || user.personalWebsite;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.languages = languages || user.languages;
      user.skills = skills || user.skills;
      user.education = education || user.education;
      user.service = services || user.service;
    user.application='Requested'
      await user.save();
      
      return user;
            
        } catch (error) {
          console.log('error in repository freelancer data',error);

            
        }
    }

    async profileImageUpload(userId:string,imageUrl:string){
      try {
         const uploadUrl=await User.findByIdAndUpdate(userId,{
            $set:{
                profilePicture:imageUrl
            }
          },{ new: true });

          if(uploadUrl){
            return uploadUrl
          }else{
            return false
          }
        
      } catch (error) {
        
      }
    }


    async findFreelancer(userId:string){
      try {
        
        
        const existingUser = await User.findOne({userId});
       
        
        if(existingUser){
          return  existingUser
        }else{
          return false
        }
        
      } catch (error) {
        console.log('error in repository find freelancer',error);
        
      }
     
    }

    async updateProfile(userId:string,data:any){
        try {
 
        const updatedFreelancer = await User.findByIdAndUpdate(userId,data, { new: true });
   
        if(updatedFreelancer){
          return  updatedFreelancer
        }else{
          return false
        }  


        } catch (error) {
          console.log('error in repository update profile',error);
          
        }
    }

    

    async updateFile(files:UploadedFile[],id:any){

      try {
       
        
        const fileLocations = files.map(file => file.location);

        const updatedUser = await User.findByIdAndUpdate(
          id,
          { $push: { document: { $each: fileLocations } } },
          { new: true, useFindAndModify: false }
        );
       
        
      if(updatedUser){
        return updatedUser
      }else{
        return false
      }
        
      } catch (error) {
        console.log('error in repository update file',error);
        
      }

    }


    async postInterest(userid:any,postId:any){
      try {
       
        const post = await Post.findById(postId);
        if(!post){
          return false
        }

        const isInterested = post.interestedUsers.indexOf(userid);
        if (isInterested>-1) {
          post.interestedUsers.splice(isInterested, 1);
        } else {
            post.interestedUsers.push(userid);
        }
        await post.save(); 
       
        return post
        
        
      } catch (error) {
        console.log('error in repository update file',error);
        
      }

    }


    async savePost(userid:any,postId:any){
      try {
        const post = await Post.findById(postId);
        const user=await User.findById(userid)

        if(!user){
          return false
        }
        const userIndexes = user.savedPosts.indexOf(postId);
        if (userIndexes > -1) {
          
          user.savedPosts.splice(userIndexes, 1);
        } else {
         
          user.savedPosts.push(postId);
        }
    
        await user.save(); 

        if(!post){
          return false
        }
        
        const userIndex = post.savedBy.indexOf(userid);
        if (userIndex > -1) {
          
          post.savedBy.splice(userIndex, 1);
        } else {
         
          post.savedBy.push(userid);
        }
    
        await post.save();

        return post
        
      } catch (error) {
        console.log('error in repository update file',error);
        
      }
    }


    async workUpload(files:UploadedFile[],id:any){

      try {
        
     
        const fileLocations = files.map(file => file.location);
      

const flattenedLocations = fileLocations.flat();
      
        
        let post = await Work.findOne({ userId: new mongoose.Types.ObjectId(id) });
        
        
        if (post) {
          post = new Work({
            userId: new mongoose.Types.ObjectId(id),
            images: flattenedLocations
        });
      } else {
          post = new Work({
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

    async postWorkDatas(postId:any,postData:any){
      try {
       
        const updatedData = await Work.findByIdAndUpdate(postId, postData, { new: true });

        if(updatedData){
          return updatedData
        }else{
          return false
        }

        
      } catch (error) {
        
      }
    }

    async workDetails(id:string){
      try {

        const result=await Work.findById(id).populate('userId')
        if(result){
          return result
        }else{
          return false
        }
        
      } catch (error) {
        
      }
    }

    async freelancerDetails(id:string){
      try {
        const result=await User.findById(id)
        
        if(result){
          return result
          
        }else{
          return false
          
        }

        
      } catch (error) {
        
      }
    }

    async freelancerWorks(id:string){
      try {
        const result=await Work.find({userId:id})
   
        
        
        if(result){
          return result
          
        }else{
          return false
          
        }

        
      } catch (error) {
        
      }
    }



}