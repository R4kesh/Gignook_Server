import { user } from "../../domain/entities/user";

export interface IuserUsecase{
    userSignup(userData:user):Promise<any>;
    findUserExist(email:string):Promise<user>
    userVerify(token:any,acceptHeader:any):Promise<any>
   googleDatabase(details:any):Promise<any>
   elsegoogleDatabase(details:any):Promise<any>
   forgetPasswordSendEmail(email:string):Promise<string>
   resetPassword(email:string,hashedPassword:string):Promise<any>
   listFreelancers(search:any, category:any, sortOrder:any):Promise<any>
   fileUpload(file:any,id:any):Promise<any>
   postDatas(id:any,postId:any,postData:any):Promise<any>
   gigPayment(amount:number,title:string,image:any,workId:string,userId:string,Fname:string):Promise<any>
   feedback(workId:string,freelancerId:string,userId:string,rating:any,feedback:string):Promise<any>
}
