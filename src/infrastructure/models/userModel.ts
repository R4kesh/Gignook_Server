import mongoose,{Schema,Document} from 'mongoose'

interface UserDocument extends Document{
    firstname:string;
    lastname:string;
    email:string;
    password:string;
    emailToken:any;
    isVerified:boolean;
    isBlocked:boolean;
    joinedate:Date;
    isFreelancer: boolean;
    displayName:string;
    description:string;
    languages:string[];
    occupation:string;
    service:string[];
    skills:string[];
    education:string[];
    personalWebsite:string;
    phoneNumber:number;
    profilePicture:string;
    document: string[];
    application:string;
    work: mongoose.Types.ObjectId | null;
    rating:number;
    posts: mongoose.Types.ObjectId[];
    savedPosts: mongoose.Types.ObjectId[];
    payment:mongoose.Types.ObjectId[]
}



const userSchema =new Schema<UserDocument>({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        
    },
    emailToken: {
        type: String,
        
      },
    isVerified:{
      type:Boolean,
      default:false , 
    },
    isBlocked:{
        type: Boolean,
        default: false
      },
    joinedate:{
        type:Date,
        default:Date.now
    },
    isFreelancer: {
        type: Boolean,
        default: false,
    },
    displayName:{
        type:String,
    },
    description:{
        type:String,
    },
    languages:{
        type:[String],
    },
    occupation:{
        type:String,
    },
    service:{
        type:[String],
    },
    skills:{
        type:[String],
    },
    education:{
        type:[String],
    },
    personalWebsite:{
        type:String,
    },
    phoneNumber:{
        type:Number,
    },
    rating:{
        type:Number,
        default:1
    },
    profilePicture: {
        type: String,
       
        default:
          'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
      },
    document:{
        type:[String]
    },  

      application: {
        type: String,
    },
    work: {
        type: mongoose.Types.ObjectId,
        ref: 'Work' 
    },
    posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
     payment:[{type:mongoose.Types.ObjectId, ref:'payment'}],   
})

const User=mongoose.model<UserDocument>('userCollection',userSchema)
export default User