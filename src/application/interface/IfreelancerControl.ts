import { promises } from "dns"

export interface IfreelancerControl{
    kycDetails(data:any):Promise<any>
    findFreelancer(userId:any):Promise<any>
    updateProfile(userId:any,data:any):Promise<any>
    fileUpload(file:any,id:string):Promise<any>
    profileImageUpload(userId:any,imageUrl:any):Promise<any>
    postInterest(userid:any,postId:any):Promise<any>
    savePost(userid:any,postId:any):Promise<any>
    workUpload(file:any,id:any):Promise<any>
    postWorkDatas(postId:any,postData:any):Promise<any>
    workDetails(id:string):Promise<any>
    freelancerDetails(id:string):Promise<any>
    freelancerWorks(userId:string):Promise<any>
}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl?: string;
  contentType: string;
  contentDisposition?: string;
  contentEncoding?: string;
  storageClass: string;
  serverSideEncryption?: string;
  metadata: { fieldName: string };
  location: string;
  etag: string;
  versionId?: string;
}
