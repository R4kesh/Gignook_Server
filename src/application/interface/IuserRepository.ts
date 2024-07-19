import { user } from "../../domain/entities/user";

export interface IuserRepository{
    SignupUser(userData:user):Promise<any|null>;
    findUser(email:string):Promise<any>
    verifyUser(token:any,acceptHeader:any):Promise<any>
    googleUser(details:user):Promise<any>
    elsegoogleUser(details:user):Promise<any>
    forgetPasswordSendEmail(email:string,verificationCode:number):Promise<any>
    resetPassword(email:string,hashedPassword:any):Promise<any>
    updateFile(file:any,id:any):Promise<any>
    postDatas(id:any,postId:any,postData:any):Promise<any>
    gigPayment(amount:number,title:string,image:any,workId:any,userId:any,Fname:any):Promise<any>
   feedback(workId:string,freelancerId:string,userId:string,rating:any,feedback:string):Promise<any>

}