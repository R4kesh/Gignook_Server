export interface user {
_id?:string;    
firstname:string;
lastname:string;
email:string;
password:string;
emailToken?:any;
isVerified:Boolean;
isBlocked:Boolean;
joinedate:Date;
}